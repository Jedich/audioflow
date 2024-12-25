package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Mock database setup for testing
func setupMockDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		fmt.Println("Error creating in-memory database:", err)
		return nil
	}

	// Migrating the schema
	db.AutoMigrate(&Song{})
	return db
}

// Test the initialization of the database connection
func TestInitDB(t *testing.T) {
	db := setupMockDB()
	if db == nil {
		t.Error("Failed to initialize mock DB")
	}
}

// Test the `getSongID` function (for extracting the song ID from URL)
func TestGetSongID(t *testing.T) {
	r := httptest.NewRequest("GET", "/songs/listen/123", nil)
	params := mux.Vars(r)
	id, err := getSongID(r)

	// Validate the extracted ID
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	assert.Equal(t, 123, id, "Song ID should be 123")
}

// Test the `getSongFromDB` function (for fetching a song from the database)
func TestGetSongFromDB(t *testing.T) {
	db := setupMockDB()

	// Create a test song
	testSong := Song{Name: "Test Song", Author: "Test Author", File: "test.mp3", Thumbnail: "thumb.jpg"}
	db.Create(&testSong)

	// Fetch song from the database
	fetchedSong, err := getSongFromDB(int(testSong.ID))
	if err != nil {
		t.Errorf("Failed to fetch song: %v", err)
	}
	assert.Equal(t, testSong.Name, fetchedSong.Name, "Song name should match")
}

// Test the `fetchFile` function (for fetching file via HTTP request)
func TestFetchFile(t *testing.T) {
	// In a real-world scenario, you would mock the HTTP request and its response
	// For example, we could mock a "localhost" server or test with file existence in our local setup
	resp, err := fetchFile("valid_file.mp3")
	if err != nil {
		t.Errorf("Expected no error while fetching file, got %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusOK, got %v", resp.StatusCode)
	}
}

// Test range header parsing logic
func TestParseRangeHeader(t *testing.T) {
	tests := []struct {
		rangeHeader string
		fileSize    int64
		expectedStart int64
		expectedEnd int64
		expectedError bool
	}{
		{"bytes=0-999", 2000, 0, 999, false},
		{"bytes=500-1500", 2000, 500, 1500, false},
		{"bytes=1000-", 2000, 1000, 1999, false},
		{"bytes=0-3000", 2000, 0, 1999, false},
		{"bytes=-100", 2000, 1900, 1999, false},
		{"bytes=100-50", 2000, 100, 50, true},
		{"bytes=abc-xyz", 2000, 0, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.rangeHeader, func(t *testing.T) {
			start, end, err := parseRangeHeader(tt.rangeHeader, tt.fileSize)
			if (err != nil) != tt.expectedError {
				t.Errorf("Expected error: %v, got: %v", tt.expectedError, err)
			}
			assert.Equal(t, tt.expectedStart, start)
			assert.Equal(t, tt.expectedEnd, end)
		})
	}
}

// Test the streamHandler function (for simulating actual HTTP requests)
func TestStreamHandler(t *testing.T) {
	// Set up mock DB and router
	db := setupMockDB()
	testSong := Song{Name: "Test Song", File: "test.mp3"}
	db.Create(&testSong)

	r := mux.NewRouter()
	r.HandleFunc("/songs/listen/{id}", streamHandler)

	tests := []struct {
		id          int
		expectedCode int
	}{
		{int(testSong.ID), http.StatusOK},    // valid request
		{9999, http.StatusNotFound},          // invalid song ID
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("Song ID: %d", tt.id), func(t *testing.T) {
			req := httptest.NewRequest("GET", fmt.Sprintf("/songs/listen/%d", tt.id), nil)
			rr := httptest.NewRecorder()
			r.ServeHTTP(rr, req)

			if rr.Code != tt.expectedCode {
				t.Errorf("Expected status %v, got %v", tt.expectedCode, rr.Code)
			}
		})
	}
}