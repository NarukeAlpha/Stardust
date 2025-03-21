package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

func ServerRoutes(db **sql.DB) *mux.Router {
	router := mux.NewRouter()

	ChatEndpoint(router, db)

	return router
}

func ChatEndpoint(router *mux.Router, db **sql.DB) {
	chat := router.PathPrefix("/chat").Subrouter()
	chat.HandleFunc("/new-session", func(w http.ResponseWriter, r *http.Request) {
		var req newChat
		body, err := io.ReadAll(r.Body)

	})
	chat.HandleFunc("/New-Chat", func(w http.ResponseWriter, r *http.Request) {

		wg := sync.WaitGroup{}
		wg.Add(3)

	})

}
