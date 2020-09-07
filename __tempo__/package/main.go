package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

func main() {

	/**
	 * Benchmark start
	 */
	start := time.Now()

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
	 * Another option for getting the root of the working process
	 * Root of project
	 * Because we are passing the root of the node process through os.Args, you cannot run this package without specifying a project root path
	 */
	// root := os.Args[1]

	/**
	 * The input directory (defaults to `<root>/src`)
	 */
	// TODO: make dynamic if user doesn't want to serve from an src dir
	projectRootDir := "src"
	inputPath, err := filepath.Abs(path.Join(root, projectRootDir))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Define output directory
	 */
	buildDir, err := filepath.Abs(path.Join(root, "__tempo__", "build"))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Define schema output file
	 */
	schemaOutputPath, err := filepath.Abs(path.Join(buildDir, "schema.graphql"))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Define resolver map output file
	 */
	registerAPIOutputPath, err := filepath.Abs(path.Join(buildDir, "registerAPI.js"))
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * If path to build dir does not exist, mkdir
	 */
	if _, err := os.Stat(buildDir); os.IsNotExist(err) {
		os.MkdirAll(buildDir, os.ModePerm)
	}

	/**
	 * Handle JS and graphql files
	 */

	type resolver struct {
		FunctionName string
		FilePath     string
	}

	skipDirs := []string{".git", "node_modules", "utils"}
	var allSchemas string
	var resolvers = []resolver{}

	error := filepath.Walk(inputPath, func(path string, info os.FileInfo, err error) error {
		// Skip specified skipDirs
		for _, skipDir := range skipDirs {
			if info.IsDir() && info.Name() == skipDir {
				return filepath.SkipDir
			}
		}

		// Skip all directories
		if info.IsDir() {
			return nil
		}

		// If the file starts with an underscore, skip it
		if info.Name()[0] == 95 {
			return nil
		}

		// Concatenate graphql files into allSchemas string
		if filepath.Ext(path) == ".graphql" {
			contents, err := ioutil.ReadFile(path)
			if err != nil {
				log.Fatal(err)
			}

			sdl := fmt.Sprintf("%s\n", contents)
			allSchemas = allSchemas + sdl
		}

		// Make slice with .js file paths
		if filepath.Ext(path) == ".js" {
			// if the path is not in a mutation or query directory (it's not a resolver) skip to the next file
			if !strings.Contains(path, "mutation") && !strings.Contains(path, "query") {
				return nil
			}

			// Get file/function name and import path for each resolver
			relPath := fmt.Sprintf("%s", strings.Split(path, projectRootDir)[1])
			functionName := strings.TrimSuffix(info.Name(), filepath.Ext(info.Name()))

			r := resolver{functionName, filepath.ToSlash(projectRootDir + relPath)}
			resolvers = append(resolvers, r)
		}

		return nil
	})

	if error != nil {
		panic(error)
	}

	/**
	 * Output schema to build dir
	 */
	concatinatedSDL := []byte(allSchemas)
	err = ioutil.WriteFile(schemaOutputPath, concatinatedSDL, 0644)
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Build resolver map (registerAPI)
	 */
	// TODO: find relative root dynamically
	var relativeRoot = "../../"
	var importsStr = ""
	var mutationMap = ""
	var queryMap = ""

	for _, rd := range resolvers {
		functionName := rd.FunctionName
		path := rd.FilePath

		importStr := fmt.Sprintf("import %s from \"%s%s\";\n", functionName, relativeRoot, filepath.ToSlash(path))
		importsStr = importsStr + importStr

		if strings.Contains(path, "mutation") {
			mutationMap = mutationMap + "\n\t\t" + functionName + ","
		}

		if strings.Contains(path, "query") {
			queryMap = queryMap + "\n\t\t" + functionName + ","
		}
	}

	resolverMap := fmt.Sprintf("%s\nexport const resolvers = {\n\tMutation: {%s\n\t},\n\tQuery: {%s\n\t},\n}\n", importsStr, mutationMap, queryMap)

	err = ioutil.WriteFile(registerAPIOutputPath, []byte(resolverMap), 0644)
	if err != nil {
		log.Fatal(err)
	}

	/**
	 * Benchmark END
	 */
	t := time.Now()
	elapsed := t.Sub(start)
	fmt.Printf("[tempo] Time to build %v", elapsed)
}
