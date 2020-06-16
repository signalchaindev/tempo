package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
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
	 * TODO: make dynamic if user doesn't want to serve from an src dir
	 */
	inputPath, err := filepath.Abs(path.Join(root, "src"))
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
	 * Read/Write files SDL files
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

	content := []byte(string(schemaOutput))
	err = ioutil.WriteFile(schemaOutputPath, content, 0644)
	if err != nil {
		log.Fatal(err)
	}

	//* Below is code for registerAPI and is a [WIP]
	//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// /**
	//  * Query and mutation slices
	//  */
	// var resolvers = make(map[string]string)

	// /**
	//  * Read JS files and store them to slices
	//  */
	// for _, file := range jsFiles {
	// 	// TODO: instead of excluding things that aren't resolvers, just get the resolvers
	// 	isResolver := false
	// 	if !strings.Contains(file, "registerAPI") && !strings.Contains(file, "typeDefs") && !strings.Contains(file, "scalars") && !strings.Contains(file, "utils") && !strings.Contains(file, "lib") && !strings.Contains(file, "model") && !strings.Contains(file, "server") {
	// 		isResolver = true
	// 	}

	// 	if !isResolver {
	// 		continue
	// 	}

	// 	if strings.Contains(file, "scalars") {
	// 		// Write in the scaler
	// 	}

	// 	/**
	// 	 * Split mutations and queries into there own slices
	// 	 */
	// 	path := fmt.Sprintf("%s", strings.Split(file, "src")[:2][1])
	// 	_, file := filepath.Split(path)
	// 	// dirName := file.Join
	// 	functionName := strings.TrimSuffix(file, filepath.Ext(file))
	// 	resolvers[functionName] = filepath.ToSlash(path)
	// }

	// /**
	//  *
	//  */
	// var mutation = make(map[string]string)
	// var query = make(map[string]string)

	// for functionName, path := range resolvers {
	// 	if strings.Contains(path, "mutation") {
	// 		mutation[functionName] = filepath.ToSlash(path)
	// 	}

	// 	if strings.Contains(path, "query") {
	// 		query[functionName] = filepath.ToSlash(path)
	// 	}

	// 	// DELETE - log path assets
	// 	// TODO: figure out how to write register api
	// 	fmt.Printf("\npath: ../src%s\nfunction: %s\n", filepath.ToSlash(path), functionName)
	// 	// DELETE
	// }

	// fmt.Println(mutation)
	// fmt.Println(query)
}
