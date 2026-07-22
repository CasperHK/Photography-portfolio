package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "modernc.org/sqlite"
)

// Photo represents a single photo record with optional EXIF data.
type Photo struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	FileURL     string     `json:"fileUrl"`
	ThumbURL    string     `json:"thumbUrl"`
	Width       int        `json:"width"`
	Height      int        `json:"height"`
	SortOrder   int        `json:"sortOrder"`
	Exif        *PhotoExif `json:"exif,omitempty"`
}

// PhotoExif holds camera metadata for a photo.
type PhotoExif struct {
	Camera       string `json:"camera"`
	Lens         string `json:"lens"`
	Aperture     string `json:"aperture"`
	ShutterSpeed string `json:"shutterSpeed"`
	ISO          int    `json:"iso"`
	FocalLength  string `json:"focalLength"`
	Location     string `json:"location"`
}

// Album represents a photo album.
type Album struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
}

func main() {
	dbPath := os.Getenv("DB_DATABASE")
	if dbPath == "" {
		dbPath = "./database/database.sqlite"
	}

	if err := os.MkdirAll("./database", 0o755); err != nil {
		log.Fatal("mkdir database:", err)
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatal("open db:", err)
	}
	defer db.Close()

	if err := runSQLFile(db, "./database/schema.sql"); err != nil {
		log.Fatal("schema:", err)
	}
	if err := runSQLFile(db, "./database/seed.sql"); err != nil {
		log.Fatal("seed:", err)
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(corsMiddleware)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	r.Mount("/api/v1", apiRoutes(db))

	// Serve static media files from ./storage at /media/*
	fs := http.FileServer(http.Dir("./storage"))
	r.Handle("/media/*", http.StripPrefix("/media/", fs))

	log.Println("backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func apiRoutes(db *sql.DB) http.Handler {
	r := chi.NewRouter()

	r.Get("/albums", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(`SELECT id, title, slug, COALESCE(description, '') FROM albums ORDER BY id`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		albums := []Album{}
		for rows.Next() {
			var a Album
			if err := rows.Scan(&a.ID, &a.Title, &a.Slug, &a.Description); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			albums = append(albums, a)
		}
		writeJSON(w, albums)
	})

	r.Get("/albums/{slug}/photos", func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "slug")
		query := `
		SELECT p.id, p.title, COALESCE(p.description,''), p.file_path, p.thumb_path, p.width, p.height, p.sort_order,
		       COALESCE(e.camera,''), COALESCE(e.lens,''), COALESCE(e.aperture,''), COALESCE(e.shutter_speed,''),
		       COALESCE(e.iso,0), COALESCE(e.focal_length,''), COALESCE(e.location,'')
		FROM photos p
		JOIN albums a ON a.id = p.album_id
		LEFT JOIN photo_exif e ON e.photo_id = p.id
		WHERE a.slug = ?
		ORDER BY p.sort_order, p.id
		`
		rows, err := db.Query(query, slug)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		photos := []Photo{}
		for rows.Next() {
			var p Photo
			var exif PhotoExif
			if err := rows.Scan(
				&p.ID, &p.Title, &p.Description, &p.FileURL, &p.ThumbURL, &p.Width, &p.Height, &p.SortOrder,
				&exif.Camera, &exif.Lens, &exif.Aperture, &exif.ShutterSpeed, &exif.ISO, &exif.FocalLength, &exif.Location,
			); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			p.Exif = &exif
			photos = append(photos, p)
		}

		writeJSON(w, map[string]any{
			"slug":   slug,
			"photos": photos,
		})
	})

	r.Get("/photos/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		query := `
		SELECT p.id, p.title, COALESCE(p.description,''), p.file_path, p.thumb_path, p.width, p.height, p.sort_order,
		       COALESCE(e.camera,''), COALESCE(e.lens,''), COALESCE(e.aperture,''), COALESCE(e.shutter_speed,''),
		       COALESCE(e.iso,0), COALESCE(e.focal_length,''), COALESCE(e.location,'')
		FROM photos p
		LEFT JOIN photo_exif e ON e.photo_id = p.id
		WHERE p.id = ?
		LIMIT 1
		`
		row := db.QueryRow(query, id)

		var p Photo
		var exif PhotoExif
		if err := row.Scan(
			&p.ID, &p.Title, &p.Description, &p.FileURL, &p.ThumbURL, &p.Width, &p.Height, &p.SortOrder,
			&exif.Camera, &exif.Lens, &exif.Aperture, &exif.ShutterSpeed, &exif.ISO, &exif.FocalLength, &exif.Location,
		); err != nil {
			http.Error(w, "photo not found", http.StatusNotFound)
			return
		}
		p.Exif = &exif
		writeJSON(w, p)
	})

	return r
}

func runSQLFile(db *sql.DB, path string) error {
	b, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	_, err = db.Exec(string(b))
	return err
}

func writeJSON(w http.ResponseWriter, payload any) {
	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	_ = enc.Encode(payload)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("CORS_ALLOWED_ORIGINS")
		if origin == "" {
			origin = "http://localhost:3000"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
