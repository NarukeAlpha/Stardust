package main

import (
	"database/sql"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func init() {
	log.Println("Initializing")
	logfile, err := os.OpenFile("log-"+strconv.Itoa(time.Now().Hour())+"-"+
		strconv.Itoa(time.Now().YearDay())+"-"+
		time.Now().Month().String()+"-"+
		strconv.Itoa(time.Now().Year())+".log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Panic(err)
	}
	mw := io.MultiWriter(os.Stdout, logfile)
	log.SetOutput(mw)
}

func main() {
	db, err := sql.Open("sqlite3", "SIO.db")
	if err != nil {
		log.Println(err, "\nFailed to open SQLite3 database")

	}
	server := ServerRoutes(&db)
	log.Println("Starting server")
	err = http.ListenAndServe(":72048", server)
	if err != nil {
		log.Panicln(err, "\nServer was stopped")
	}
}
