import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { 
  Chart  as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';

import {Radar} from 'react-chartjs-2'

import logo from './SpotifyLogo.png'

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale
)



function App() {

  const CLIENT_ID = 'b9516d6124f6463990d5e88b10a523bb'
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read"

  const [token, setToken] = useState("")
  const [page, setPage] = useState(true)
  const [tracksData, setData] = useState([])
  const [displayData, setDisplayData] = useState([0.4, 0.8, 0.3, 0.5])

    
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

const getTopPlayList = async (e) => {
  const {data} = await axios.get("https://api.spotify.com/v1/playlists/0YCW3npyBCo8QPS7nlZJM4/tracks", {
    headers: {
      Authorization: `Bearer ${token}`
   }
  })

  let tracks = data.items

  let temp = []
  for (let i = 0; i < tracks.length; i++) {
    let trackId = tracks[i].track.id
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
  changePage()
  }

  const changePage = () => {
    setPage(!page);
  }

  const [chartData] = useState({
    labels: ["Happy", "Sad", "Energetic", "Calm"],
    datasets: [
      {
        label: 'Your Chart',
        backgroundColor: '#1DB954',
        borderColor: '#1DB954',
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
        data: displayData
      }
    ]
  });

  const [lightOptions] = useState({
    plugins: {
        legend: {
            labels: {
                color: '#FFFFFF',
                font: {
                  size: 24
                }
            }
        }
    },
    scales: {
        r: {
            beginAtZero: true,
            max: 1,
            pointLabels: {
                color: '#ffffff',
                font: {
                  size: 24
                }
            },
            grid: {
                color: '#828282',
                
            },
            angleLines: {
                color: '#ebedef'
            },
            ticks: {
              display : false
            }
        }
      }
    });

  return (
    <div className="App">
      


      {page ?
        <div className = "spotify">
          <div className = "header">
            <h1>SpotiVibe</h1>
          </div>
           <div className = "box">
             {token ?
             <button onClick={getTopPlayList}>Get Alignment</button>
             : <img src={logo} alt="Logo" height={100} width={350} />
             }
            </div>
            <div className = "box">
             {!token ?
             <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
               to Spotify</a>
           : <button onClick={logout}>Logout</button>}
            </div>
         </div>
          : 
          <div className = "chart">
            <div className="radar-chart">
              <Radar
                data = {chartData}
                options = {lightOptions}
              ></Radar>
            </div>
            {/* <button onClick={changePage}>Back</button> */}
          </div>
          
      }

      

        

    </div>
  );
}

export default App;

