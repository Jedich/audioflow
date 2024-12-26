import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = ({ url, song_id, artist_id }) => {
  return (
    <AudioPlayer
      autoPlay
      src={url}
      onPlay={e => { 
        console.log("Playing")
        fetch('http://localhost:8000/api/listen_metrics/', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            user_id: 1, 
            song_id: song_id,
            artist_id: artist_id
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); 
        })
        .then(data => {
          console.log('Success:', data); 
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
      }
      // other props here
    />
  );
};

export default MusicPlayer;
