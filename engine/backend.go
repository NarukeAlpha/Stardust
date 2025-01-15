package main

import (
	"log"
	"net/http"
	"os"

	m "stardustEngine/engine/module"

	"github.com/gorilla/mux"
	"github.com/playwright-community/playwright-go"
)

func main() {
	//test
	err := playwright.Install()
	if err != nil {
		log.Panic("Could not install Playwright", err)
	}
	go m.ProxyService()
	//go m.Tasks
	//go m.Settings
	rt := mux.NewRouter()
	rt.HandleFunc("/benginequitsaio", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Engine Quitting")
		w.Write([]byte("Engine Quitting"))
		os.Exit(0)
	})
	err = http.ListenAndServe(":85395", rt)
	if err != nil {
		log.Panic("Could not start server", err)
	}

}
