package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func main() {
	/**
	 * Get the working directory for the executable
	 */
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	/**
	 * Find root from the executable's working directory
	 */
	root, err := filepath.Abs(path.Join(wd, "../../../"))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * The input file path (defaults to `<root>/src`)
	 *
	 * TODO: make dynamic if user doesn't want to serve from an src dir
	 */
	projectRootDir := "src"
	inputPath, err := filepath.Abs(path.Join(root, projectRootDir))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Chunk files into JS and graphql slices
	 * https://flaviocopes.com/go-list-files
	 */
	var sdlFiles []string
	var jsFiles []string

	error := filepath.Walk(inputPath, func(path string, info os.FileInfo, err error) error {
		skipDirs := []string{".git", "node_modules", "utils"}

		for _, skipDir := range skipDirs {
			if info.IsDir() && info.Name() == skipDir {
				return filepath.SkipDir
			}
		}

		if info.IsDir() {
			return nil
		}

		// If the file starts with an underscore, skip it
		// Get file name for skip file match
		_, file := filepath.Split(path)

		for i, f := range file {
			// 95 is the byte representation of the underscore
			if i == 0 && f == 95 {
				return nil
			}
			break
		}

		if filepath.Ext(path) == ".graphql" {
			sdlFiles = append(sdlFiles, path)
		}

		if filepath.Ext(path) == ".js" {
			jsFiles = append(jsFiles, path)
		}

		return nil
	})

	if error != nil {
		panic(error)
	}

	/**
	 * Define build directory
	 */
	buildDir, err := filepath.Abs(path.Join(root, "__tempo__"))
	if err != nil {
		log.Fatal(err)
	}

	// If path to build dir does not exist, mkdir
	if _, err := os.Stat(buildDir); os.IsNotExist(err) {
		os.MkdirAll(buildDir, os.ModePerm)
	}

	/**
	 * Output schema to build dir
	 */
	schemaOutputPath, err := filepath.Abs(path.Join(buildDir, "schema.graphql"))
	if err != nil {
		log.Fatal(err)
	}

	var schemaOutput string

	/**
	 * Concatenate SDL files
	 */
	for _, file := range sdlFiles {
		// contents of the file input
		contents, err := ioutil.ReadFile(file)
		if err != nil {
			log.Fatal(err)
		}

		sdl := fmt.Sprintf("%s", contents)
		schemaOutput = schemaOutput + sdl
	}

	concatinatedSDL := []byte(string(schemaOutput))
	err = ioutil.WriteFile(schemaOutputPath, concatinatedSDL, 0644)
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Build registerAPI
	 */
	var resolvers = make(map[string]string)

	/**
	 * Separate resolvers from other js files in the tree
	 */
	for _, file := range jsFiles {
		// if the path is not in a mutation or query directory (it's not a resolver) skip to the next file
		if !strings.Contains(file, "mutation") && !strings.Contains(file, "query") {
			continue
		}

		// Get file/function name and import path for each resolver
		path := fmt.Sprintf("%s", strings.Split(file, projectRootDir)[1])
		_, file := filepath.Split(path)
		functionName := strings.TrimSuffix(file, filepath.Ext(file))
		resolvers[functionName] = filepath.ToSlash(projectRootDir + path)
	}

	/**
	 * Build imports from resolvers map
	 */
	var importsStr = ""
	var relativeRoot = "../"
	var mutationMap = ""
	var queryMap = ""

	for functionName, path := range resolvers {
		importStr := fmt.Sprintf("import %s from \"%s%s\";\n", functionName, relativeRoot, filepath.ToSlash(path))
		importsStr = importsStr + importStr

		if strings.Contains(path, "mutation") {
			mutationMap = mutationMap + "\n\t\t" + functionName + ","
		}

		if strings.Contains(path, "query") {
			queryMap = queryMap + "\n\t\t" + functionName + ","
		}
	}

	resolverMap := fmt.Sprintf("%s\nconst resolvers = {\n\tMutation: {%s\n\t},\n\tQuery: {%s\n\t},\n}\n\nexport default resolvers;\n", importsStr, mutationMap, queryMap)

	registerAPIOutputPath, err := filepath.Abs(path.Join(buildDir, "registerAPI.js"))
	if err != nil {
		log.Fatal(err)
	}

	err = ioutil.WriteFile(registerAPIOutputPath, []byte(resolverMap), 0644)
	if err != nil {
		log.Fatal(err)
	}
}
