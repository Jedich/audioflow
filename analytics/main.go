package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3" // Import the SQLite3 driver
)

// Define a struct to represent the data in your table
type SongStat struct {
	SongID        int    `json:"song_id"`
	SongName      string `json:"song_name"`
	TotalListens  int    `json:"total_listens"`
	UniqueListens int    `json:"unique_listens"`
	Duration      int    `json:"duration"`
}

type DailyListen struct {
	Date    string `json:"date"`
	Listens int    `json:"listens"`
}

type ArtistStats struct {
	ArtistID      int           `json:"artist_id"`
	TotalListens  int           `json:"total_listens"`
	UniqueListens int           `json:"unique_listens"`
	SongStats     []SongStat    `json:"song_listens"`
	DailyListens  []DailyListen `json:"daily_listens"` // Add this field
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
func main() {
	// Open the SQLite database file
	db, err := sql.Open("sqlite3", "../backend/db.sqlite3")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize Gin router
	router := gin.Default()
	m := CORSMiddleware
	router.Use(m())

	// Handle GET request for artist statistics
	router.GET("/artist_stats/:artist_id", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		artistIDStr := c.Param("artist_id")
		artistID, err := strconv.Atoi(artistIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Artist ID"})
			return
		}

		// Get total listens
		var totalListens int
		row := db.QueryRow("SELECT COUNT(*) FROM music_songlistenmetric WHERE song_id IN (SELECT song_id FROM music_song WHERE artist_id = ?)", artistID)
		err = row.Scan(&totalListens)
		if err != nil {
			panic(err)
		}

		// Get unique listens (requires joining with a table of unique user-song combinations)
		var uniqueListens int
		row = db.QueryRow(`
					SELECT COUNT(*) FROM (
						SELECT DISTINCT user_id, song_id 
						FROM music_songlistenmetric 
						WHERE song_id IN (SELECT song_id FROM music_song WHERE artist_id = ?)
					)
				`, artistID)
		err = row.Scan(&uniqueListens)
		if err != nil {
			panic(err)
		}

		// Get song listens for the artist
		rows, err := db.Query("SELECT user_id, song_id, timestamp FROM music_songlistenmetric WHERE song_id IN (SELECT song_id FROM music_song WHERE artist_id = ?)", artistID)
		if err != nil {
			panic(err)
		}
		defer rows.Close()

		if err := rows.Err(); err != nil {
			panic(err)
		}

		dailyListens, err := getDailyListens(db, artistID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		songStats, err := getSongStats(db, artistID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Create ArtistStats object
		artistStats := ArtistStats{
			ArtistID:      artistID,
			TotalListens:  totalListens,
			UniqueListens: uniqueListens,
			SongStats:     songStats,
			DailyListens:  dailyListens,
		}

		c.JSON(http.StatusOK, artistStats)
	})

	fmt.Println("Server listening on :8080")
	router.Run(":8080")
}

func getDailyListens(db *sql.DB, artistID int) ([]DailyListen, error) {
	// Calculate start date for last 30 days
	startDate := time.Now().AddDate(0, 0, -30)

	var dailyListens []DailyListen

	// Loop through each day in the last 30 days
	for i := 0; i <= 30; i++ {
		// Calculate date for the current day
		currentDate := startDate.AddDate(0, 0, i)

		// Create a string for the date in the format 'YYYY-MM-DD'
		dateStr := currentDate.Format("2006-01-02")

		// Query to get listens for the current day
		var count int
		err := db.QueryRow(`
					SELECT COUNT(*) 
					FROM music_songlistenmetric
					WHERE song_id IN (SELECT id FROM music_song WHERE artist_id = ?)
					  AND DATE(timestamp) = ?
				`, artistID, dateStr).Scan(&count)
		if err != nil {
			return nil, err
		}

		// Store the listen count for the current day
		dailyListens = append(dailyListens, DailyListen{
			Date:    dateStr,
			Listens: count,
		})
	}

	return dailyListens, nil
}

func getSongStats(db *sql.DB, artistID int) ([]SongStat, error) {
	var songStats []SongStat

	rows, err := db.Query(`
                SELECT 
                    s.id, 
                    s.name AS song_name,
					s.duration AS duration,
                    COUNT(*) AS total_listens, 
                    COUNT(DISTINCT sl.user_id) AS unique_listens
                FROM 
                    music_song s
                JOIN 
                    music_songlistenmetric sl ON s.id = sl.song_id
                WHERE 
                    s.artist_id = ?
                GROUP BY 
                    s.id, s.name
            `, artistID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var stat SongStat
		err := rows.Scan(&stat.SongID, &stat.SongName, &stat.Duration, &stat.TotalListens, &stat.UniqueListens)
		if err != nil {
			return nil, err
		}
		songStats = append(songStats, stat)
	}

	fmt.Println(songStats)

	return songStats, nil
}
