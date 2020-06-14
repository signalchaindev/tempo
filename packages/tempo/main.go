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
	// Get the working directory for the executable
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	// Find root from the executable's working directory
	root, err := filepath.Abs(path.Join(wd, "../../../"))
	if err != nil {
		log.Fatal(err)
	}

	// The input file path
	// TODO: make dynamic if user doesn't want to serve from an src dir
	// inputPath, err := filepath.Abs(path.Join(root, "src"))
	inputPath, err := filepath.Abs(path.Join(root, "src"))
	if err != nil {
		log.Fatal(err)
	}

	// define empty slices to push file paths to
	var sdlFiles []string
	var jsFiles []string

	/**
	 * The file chunker
	 * https://flaviocopes.com/go-list-files/
	 */
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

	buildDir, err := filepath.Abs(path.Join(root, "__tempo__"))
	if err != nil {
		log.Fatal(err)
	}

	// If path to build dir does not exist
	if _, err := os.Stat(buildDir); os.IsNotExist(err) {
		os.MkdirAll(buildDir, os.ModePerm)
	}

	// The schema output file path
	schemaOutputPath, err := filepath.Abs(path.Join(buildDir, "schema.graphql"))
	if err != nil {
		log.Fatal(err)
	}

	var schemaOutput string

	/**
	 * Read files
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

	for _, file := range jsFiles {
		sdlFiles = append(sdlFiles, file)
		fmt.Println(file)
	}

}
