package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/mmarchesotti/ask-me-anything/internal/api"
	"github.com/mmarchesotti/ask-me-anything/internal/store/pgstore"
)

func main() {
	ctx := context.Background()

	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	var pool *pgxpool.Pool
	var err error

	connString := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s",
		os.Getenv("WS_DATABASE_USER"),
		os.Getenv("WS_DATABASE_PASSWORD"),
		os.Getenv("WS_DATABASE_HOST"),
		os.Getenv("WS_DATABASE_PORT"),
		os.Getenv("WS_DATABASE_NAME"),
	)

	for i := range 10 {
		pool, err = pgxpool.New(ctx, connString)
		if err == nil {
			err = pool.Ping(ctx)
			if err == nil {
				fmt.Println("Successfully connected to the database!")
				break
			}
		}

		fmt.Printf("Database at %s not ready yet, retrying in 2s... (%d/10)\n", os.Getenv("WS_DATABASE_HOST"), i+1)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database after retries: %v", err))
	}

	handler := api.NewHandler(pgstore.New(pool))

	go func() {
		if err := http.ListenAndServe(":8080", handler); err != nil {
			if !errors.Is(err, http.ErrServerClosed) {
				panic(err)
			}
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
}
