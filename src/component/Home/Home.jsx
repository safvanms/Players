import React, { useEffect, useState } from 'react'
import './Home.css'
import axios from 'axios'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
  })
  const [players, setPlayers] = useState([])
  const [playerName, SetPlayerName] = useState('')
  const [cricketer, setCricketer] = useState('')

  const getPlayers = async () => {
    try {
      const res = await axios.get(
        `https://api.cricapi.com/v1/players?apikey=3be024bd-df17-4315-8016-3b0376a6feea&offset=0&search=${playerName}`,
      )
      if (res.data.status === 'failure') {
        setPlayers(null)
      } else {
        setPlayers(res.data.data)
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
    console.log(id)
    try {
      const res = await axios.get(
        `https://api.cricapi.com/v1/players_info?apikey=3be024bd-df17-4315-8016-3b0376a6feea&id=${id}`,
      )
      setCricketer([res.data.data])
      setFormData({ name: '' })
      setPlayers([])
    } catch (error) {
      console.error(error)
    }
  }

  console.log('formData', formData)
  console.log('playerName', playerName)
  console.log('playerInfo', cricketer)

  return (
    <div>
      <div className="info-container">
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Enter Player name"
            value={formData.name}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="initial-palyers">
        {players ? (
          players.map((player) => (
            <div className="player" key={player.id}>
              <h3>{player.name}</h3>
              <h4>{player.country}</h4>
              <button onClick={() => findPlayer(player.id)}> View </button>
            </div>
          ))
        ) : (
          <div className="err-msg">
            {players === null ? (
              <p>API limit reached. Please try again tomorrow.</p>
            ) : (
              <p>Sorry! No player found.</p>
            )}
          </div>
        )}
      </div>

      {cricketer
        ? cricketer.map((player) => (
            <div className="player-details">
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
                <h5>Bat :{player.battingStyle}</h5>
                <h5>Bowl :{player.bowlingStyle}</h5>
                <h5>Place of Birth : {player.placeOfBirth}</h5>
                <h5>DOB :{player.dateOfBirth}</h5>
              </div>
            </div>
          ))
        : null}
    </div>
  )
}

// https://api.cricapi.com/v1/players_info?apikey=3be024bd-df17-4315-8016-3b0376a6feea&id=b6e7aa41-b0bb-4b0f-8f59-59f729283be5
// const YOUR_API_KEY = '3be024bd-df17-4315-8016-3b0376a6feea'
