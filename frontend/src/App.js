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

  const [token, setToken] = useState("")

  const [artists, setArtists] = useState([])

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
  const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
          Authorization: `Bearer ${token}`
      },
      params: {
          q: "Taylor Swift",
          type: "artist"
      }
  })

  setArtists(data.artists.items)
  console.log(data.artists.items)
}

  return (
    <div className="App">
      <div classname = "header">
        <h1>SpotiVibe</h1>
      </div>
      {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
          to Spotify</a>
      : <button onClick={logout}>Logout</button>}

      {token ?
        <button onClick={searchArtists}>Run</button>
        : <h2>Please login</h2>
      } 
    </div>
  );
}

export default App;
