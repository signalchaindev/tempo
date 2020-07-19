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
	fmt.Println(inputPath)

	/**
	 * Chunk files into JS and graphql slices
	 * https://flaviocopes.com/go-list-files
	 */
	var sdlFiles []string
	var jsFiles []string

	error := filepath.Walk(inputPath, func(path string, info os.FileInfo, err error) error {
		skipDirs := []string{".git", "node_modules", "packages"}

		for _, item := range skipDirs {
			if info.IsDir() && info.Name() == item {
				return filepath.SkipDir
			}
		}

		if info.IsDir() {
			return nil
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
	 * Define build to directory
	 */
	buildDir, err := filepath.Abs(path.Join(root, "node_modules", "tempo"))
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
		isResolver := false

		if strings.Contains(file, "mutation") || strings.Contains(file, "query") {
			isResolver = true
		}

		if !isResolver {
			continue
		}

		/**
		 * Split mutations and queries into there own slices
		 */
		path := fmt.Sprintf("%s", strings.Split(file, projectRootDir)[:2][1])
		_, file := filepath.Split(path)
		functionName := strings.TrimSuffix(file, filepath.Ext(file))
		resolvers[functionName] = filepath.ToSlash(path)
	}

	/**
	 * Build imports
	 */
	var importsOutput = ""
	var relativeRoot = "../../"

	for functionName, path := range resolvers {
		importStr := fmt.Sprintf("import %s from \"%s%s%s\";\n", functionName, relativeRoot, projectRootDir, filepath.ToSlash(path))
		importsOutput = importsOutput + importStr
	}

	var mutation = ""
	var query = ""

	for functionName, path := range resolvers {

		if strings.Contains(path, "mutation") {
			mutation = mutation + functionName + ",\n\t\t"
		}

		if strings.Contains(path, "query") {
			query = query + functionName + ",\n\t\t"
		}
	}

	mutationMap := fmt.Sprintf("%s\n", mutation)
	queryMap := fmt.Sprintf("%s\n", query)
	resolverMap := fmt.Sprintf("%s\nconst resolvers = {\n\tMutation: {\n\t\t%s\t},\n\tQuery: {\n\t\t%s\t},\n}\n\nexport default resolvers;\n", importsOutput, mutationMap, queryMap)

	registerAPIOutputPath, err := filepath.Abs(path.Join(buildDir, "registerAPI.js"))
	if err != nil {
		log.Fatal(err)
	}

	err = ioutil.WriteFile(registerAPIOutputPath, []byte(resolverMap), 0644)
	if err != nil {
		log.Fatal(err)
	}
}
