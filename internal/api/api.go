package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mmarchesotti/ask-me-anything/internal/store/pgstore"
)

type apiHandler struct {
	q *pgstore.Queries // TODO CHANGE TO INTERFACE TO NOT DEPEND ON POSTGRES
	r *chi.Mux
}

func (h apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.r.ServeHTTP(w, r)
}

func NewHandler(q *pgstore.Queries) http.Handler {
	a := apiHandler{
		q: q,
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID, middleware.Recoverer, middleware.Logger)

	a.r = r
	return a
}
