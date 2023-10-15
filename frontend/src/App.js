import './App.css';
import {useEffect, useState} from 'react';
import { Credentials } from './Credentials';
import axios from 'axios';



function App() {

  const spotify = Credentials();  

  const CLIENT_ID = spotify.ClientId
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read"

  const [token, setToken] = useState("")

  const [tracks, setTracks] = useState([])
  const [tracksData, setData] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

}, [])

const logout = () => {
  setToken("")
  window.localStorage.removeItem("token")
}

const searchArtists = async (e) => {
  e.preventDefault()
  const {data} = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0', {
      headers: {
          Authorization: `Bearer ${token}`
      }
  })
  setTracks(data.items)
  console.log(data.items)
}



const getTopPlayList = async (e) => {
  const {data} = await axios.get("https://api.spotify.com/v1/playlists/0YCW3npyBCo8QPS7nlZJM4/tracks", {
    headers: {
      Authorization: `Bearer ${token}`
   }
  })
  setTracks(data.items)
  console.log(data.items)
}

const getTrackFeature = async (e) => {
  let temp = []
  console.log(tracks)
  for (let i = 0; i < tracks.length; i++) {
    let trackId = tracks[i].track.id
    console.log(trackId)
    let searchLink = "https://api.spotify.com/v1/audio-features/" + trackId
    const {data} = await axios.get(searchLink, {
    headers: {
      Authorization: `Bearer ${token}`
    }
    })
    temp.push(data)
  }

  setData(temp)
  console.log(temp)
}

const handleData = async (e) => {
  await getTopPlayList();
  await getTrackFeature();
  console.log(tracksData)
}

  return (
    <div className="App">
      <div classname = "header">
        <h1>SpotiVibe</h1>
      </div>
      {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
          to Spotify</a>
      : <button onClick={logout}>Logout</button>}

      {token ?
        <button onClick={getTopPlayList}>Run</button>
        : <h2></h2>
      }

      {token ?
        <button onClick={getTrackFeature}>Analyse Data</button>
        : <h2></h2>
      } 
    </div>
  );
}

export default App;
