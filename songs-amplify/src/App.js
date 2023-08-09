import './App.css';
import awsconfig from "./aws-exports"
import {withAuthenticator} from "@aws-amplify/ui-react"
import {Amplify, API, graphqlOperation } from 'aws-amplify';
import { useEffect,useState } from 'react';
import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';

import { Paper, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';

Amplify.configure(awsconfig)

function App() {
  const [songs, setSongs] = useState([]);
  const fetchSongs = async () => {
    try {
        const songData = await API.graphql(graphqlOperation(listSongs));
        const songList = songData.data.listSongs.items;
        console.log('song list', songList);
        setSongs(songList);
    } catch (error) {
        console.log('error on fetching songs', error);
    }
  };
  useEffect(() => {
    fetchSongs();
  }, []);
  const addLike = async (song, index) => {
    try {
        // const song = songs[index];        
        song.likes = song.likes + 1;
        song.title="Updated Test Title from UI";
        delete song.createdAt;
        delete song.updatedAt;
        delete song.__typename;
        console.log("Song to update likes: ", song)
        const songData = await API.graphql(graphqlOperation(updateSong, { input: song }));
        console.log("Update response: ", songData.data.updateSong)
        const songList = [...songs];
        songList[index] = songData.data.updateSong;
        setSongs(songList);
    } catch (error) {
        console.log('error on adding Like to song', error);
    }
};

  return (
    <div className="App">
      <header className="App-header">
        <h2>My App Content</h2>
      </header>
      <div className="songList">
          {songs.map((song, index) => {
              return (
                  <Paper variant="outlined" elevation={2} key={`song${index}`}>
                      <div className="songCard">
                          <IconButton aria-label="play">
                              <PlayArrowIcon />
                          </IconButton>
                          <div>
                              <div className="songTitle">{song.title}</div>
                              <div className="songOwner">{song.owner}</div>
                          </div>
                          <div>
                              <IconButton aria-label="like" onClick={() => addLike(song, index)}>
                                  <FavoriteIcon />
                              </IconButton>
                              {song.likes}
                          </div>
                          <div className="songDescription">{song.description}</div>
                      </div>
                  </Paper>
              );
          })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
