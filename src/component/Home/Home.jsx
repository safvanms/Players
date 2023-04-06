import React, { useEffect, useState } from 'react'
import './Home.css'
import axios from 'axios'

const API_KEYS = [
  '053439c1-bfd9-4a00-9339-28cd3ee35317',
  '14e84e6a-4de2-430e-81a0-1937b8f383b1',
  '3be024bd-df17-4315-8016-3b0376a6feea',
  '992e9e9e-41ff-43e0-88f5-c08cd6dd4548',
  '53523187-bc9e-4163-8eac-fe245a0cde31',
]

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
  })
  const [players, setPlayers] = useState([])
  const [playerName, SetPlayerName] = useState('')
  const [cricketer, setCricketer] = useState('')
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [noInfo, setNoInfo] = useState(false)
  const [noData, setNoData] = useState(false)
  const [apiLimit, setApiLimit] = useState(false)
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0)

  const getCurrentApiKey = () => {
    return API_KEYS[currentApiKeyIndex]
  }

  const getPlayers = async () => {
    setLoading(true)
    try {
      let res
      for (let i = 0; i < API_KEYS.length; i++) {
        res = await axios.get(
          `https://api.cricapi.com/v1/players?apikey=${API_KEYS[i]}&offset=0&search=${playerName}`,
        )
        if (!res.data || !res.data.data || res.data.data.length === 0) {
          setNoData(true)
          setFormData({ name: '' })
        } else {
          setNoData(false)
        }
        if (res.data.status === 'success') {
          setLoading(false)
          setPlayers(res.data.data)
          setFormData({ name: '' })
          setCurrentApiKeyIndex(i)
          return
        }
      }

      if (res.data && res.data.status === 'failure') {
        setLoading(true)
        setApiLimit(true)
        setNoData(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPlayers()
  }, [playerName])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    SetPlayerName(formData.name)
  }

  const findPlayer = async (id) => {
    setLoading(true)
    try {
      const res = await axios.get(
        `https://api.cricapi.com/v1/players_info?apikey=${getCurrentApiKey()}&id=${id}`,
      )
      if (!res.data || !res.data.data || res.data.data.length === 0) {
        setNoInfo(true)
        setFormData({ name: '' })
      } else {
        setNoInfo(false)
      }
      setCricketer([res.data.data])
      setStats([res.data.data.stats])
      setFormData({ name: '' })
      setPlayers([])
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="info-container">
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Enter Player name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      {loading && (
        <div className="spinner">
          <span class="cricket-emoji" role="img" aria-label="cricket">
            &#127951;
          </span>
        </div>
      )}

      <div className="initial-palyers">
        {noData && (
          <p style={{ color: 'red' }}>Sorry ! No such player found .</p>
        )}

        {players
          ? players.map((player) => (
              <div className="player" key={player.id}>
                <h3>{player.name}</h3>
                <h4>{player.country}</h4>
                <button
                  style={{ fontSize: '15px' }}
                  onClick={() => findPlayer(player.id)}
                >
                  View
                </button>
              </div>
            ))
          : null}

        {apiLimit && (
          <div className="err-msg">
            <p>API daily limit has been reached.</p>
            <p>Please try again tomorrow.</p>
          </div>
        )}
        {noInfo ? (
          <div className="err-msg">
            <p>Oops ! Player's details are</p>
            <p> currently unavailable at this time</p>
          </div>
        ) : null}
      </div>

      <div className="player-card">
        {cricketer &&
          cricketer.map((player) => (
            <>
              <div className="player-details" key={player.id}>
                <img
                  src={player.playerImg}
                  alt="playerImg"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '7px',
                  }}
                />
                <h2>{player.name}</h2>
                <h3>{player.country}</h3>
                <div className="other-det">
                  <h5>Role : {player.role}</h5>
                  <h5>Batting : {player.battingStyle}</h5>
                  <h5>Bowling : {player.bowlingStyle}</h5>
                  <h5>Place of Birth : {player.placeOfBirth}</h5>
                  <h5>DOB : {player.dateOfBirth}</h5>
                </div>
                <div className="stats">
                  {stats.some((player) => player.length < 100) ? (
                    <div className="nodetails">
                      <p>Oops ! Player's details are</p>
                      <p> yet to be Added . try again later</p>
                    </div>
                  ) : (
                    stats.map((player) => (
                      <>
                        <h3 style={{ fontWeight: '900' }}>BATTING STATS</h3>
                        <h5 style={{ fontWeight: '600' }}>TEST CRICKET</h5>
                        <hr />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[0].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[1].value}</span>
                          </p>
                          <p>
                            Not Out : <span>{player[2].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[3].value}</span>
                          </p>
                          <p>
                            HS : <span>{player[4].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[5].value}</span>
                          </p>
                          <p>
                            BF : <span>{player[6].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[7].value}</span>
                          </p>
                          <p>
                            100s : <span>{player[8].value}</span>
                          </p>
                          <p>
                            200s : <span>{player[9].value}</span>
                          </p>
                          <p>
                            50s : <span>{player[10].value}</span>
                          </p>
                          <p>
                            4s : <span>{player[11].value}</span>
                          </p>
                          <p>
                            6s : <span>{player[12].value}</span>
                          </p>
                        </div>
                        <hr />
                        <h5 style={{ fontWeight: '600' }}>ODI CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[13].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[14].value}</span>
                          </p>
                          <p>
                            Not Out : <span>{player[15].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[16].value}</span>
                          </p>
                          <p>
                            HS : <span>{player[17].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[18].value}</span>
                          </p>
                          <p>
                            BF : <span>{player[19].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[20].value}</span>
                          </p>
                          <p>
                            100s : <span>{player[21].value}</span>
                          </p>
                          <p>
                            200s : <span>{player[22].value}</span>
                          </p>
                          <p>
                            50s : <span>{player[23].value}</span>
                          </p>
                          <p>
                            4s : <span>{player[24].value}</span>
                          </p>
                          <p>
                            6s : <span>{player[25].value}</span>
                          </p>
                        </div>

                        <hr />
                        <h5 style={{ fontWeight: '600' }}>T20 CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[26].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[27].value}</span>
                          </p>
                          <p>
                            Not Out : <span>{player[28].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[29].value}</span>
                          </p>
                          <p>
                            HS : <span>{player[30].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[31].value}</span>
                          </p>
                          <p>
                            BF : <span>{player[32].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[33].value}</span>
                          </p>
                          <p>
                            100s : <span>{player[34].value}</span>
                          </p>
                          <p>
                            200s : <span>{player[35].value}</span>
                          </p>
                          <p>
                            50s : <span>{player[36].value}</span>
                          </p>
                          <p>
                            4s : <span>{player[37].value}</span>
                          </p>
                          <p>
                            6s : <span>{player[38].value}</span>
                          </p>
                        </div>

                        <hr />
                        <h5 style={{ fontWeight: '600' }}>IPL CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[39].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[40].value}</span>
                          </p>
                          <p>
                            Not Out : <span>{player[41].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[42].value}</span>
                          </p>
                          <p>
                            HS : <span>{player[43].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[44].value}</span>
                          </p>
                          <p>
                            BF : <span>{player[45].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[46].value}</span>
                          </p>
                          <p>
                            100s : <span>{player[47].value}</span>
                          </p>
                          <p>
                            200s : <span>{player[48].value}</span>
                          </p>
                          <p>
                            50s : <span>{player[49].value}</span>
                          </p>
                          <p>
                            4s : <span>{player[50].value}</span>
                          </p>
                          <p>
                            6s : <span>{player[51].value}</span>
                          </p>
                        </div>
                        <hr />

                        <h3 style={{ fontWeight: '900' }}>BOWLING STATS</h3>
                        <h5 style={{ fontWeight: '600' }}>TEST CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[52].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[53].value}</span>
                          </p>
                          <p>
                            B : <span>{player[54].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[55].value}</span>
                          </p>
                          <p>
                            Wickets : <span>{player[56].value}</span>
                          </p>
                          <p>
                            BBI : <span>{player[57].value}</span>
                          </p>
                          <p>
                            BBM : <span>{player[58].value}</span>
                          </p>
                          <p>
                            Economy : <span>{player[59].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[60].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[61].value}</span>
                          </p>
                          <p>
                            5wkt : <span>{player[62].value}</span>
                          </p>
                          <p>
                            10wkt : <span>{player[63].value}</span>
                          </p>
                        </div>
                        <hr />

                        <h5 style={{ fontWeight: '600' }}>ODI CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[64].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[65].value}</span>
                          </p>
                          <p>
                            B : <span>{player[66].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[67].value}</span>
                          </p>
                          <p>
                            Wickets : <span>{player[68].value}</span>
                          </p>
                          <p>
                            BBI : <span>{player[69].value}</span>
                          </p>
                          <p>
                            BBM : <span>{player[70].value}</span>
                          </p>
                          <p>
                            Economy : <span>{player[71].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[72].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[73].value}</span>
                          </p>
                          <p>
                            5wkt : <span>{player[74].value}</span>
                          </p>
                          <p>
                            10wkt : <span>{player[75].value}</span>
                          </p>
                        </div>
                        <hr />
                        <h5 style={{ fontWeight: '600' }}>T20 CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[76].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[77].value}</span>
                          </p>
                          <p>
                            B : <span>{player[78].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[79].value}</span>
                          </p>
                          <p>
                            Wickets : <span>{player[80].value}</span>
                          </p>
                          <p>
                            BBI : <span>{player[81].value}</span>
                          </p>
                          <p>
                            BBM : <span>{player[82].value}</span>
                          </p>
                          <p>
                            Economy : <span>{player[83].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[84].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[85].value}</span>
                          </p>
                          <p>
                            5wkt : <span>{player[86].value}</span>
                          </p>
                          <p>
                            10wkt : <span>{player[87].value}</span>
                          </p>
                        </div>
                        <hr />
                        <h5 style={{ fontWeight: '600' }}>IPL CRICKET</h5>
                        <br />
                        <div className="odi-det">
                          <p>
                            Matches : <span>{player[88].value}</span>
                          </p>
                          <p>
                            Innings : <span>{player[89].value}</span>
                          </p>
                          <p>
                            B : <span>{player[90].value}</span>
                          </p>
                          <p>
                            Runs : <span>{player[91].value}</span>
                          </p>
                          <p>
                            Wickets : <span>{player[92].value}</span>
                          </p>
                          <p>
                            BBI : <span>{player[93].value}</span>
                          </p>
                          <p>
                            BBM : <span>{player[94].value}</span>
                          </p>
                          <p>
                            Economy : <span>{player[95].value}</span>
                          </p>
                          <p>
                            Avg : <span>{player[96].value}</span>
                          </p>
                          <p>
                            SR : <span>{player[97].value}</span>
                          </p>
                          <p>
                            5wkt : <span>{player[98].value}</span>
                          </p>
                          <p>
                            10wkt : <span>{player[99].value}</span>
                          </p>
                        </div>
                        <hr />
                      </>
                    ))
                  )}
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  )
}
