import { TextField, Typography } from '@material-ui/core';
import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

// Joining a game by inputting name and session id
function PlayerJoin () {
  const [username, setUsername] = React.useState('')
  const [sessionID, setSessionID] = React.useState('')

  const navigate = useNavigate()

  const enterGame = async () => {
    const path = `play/join/${sessionID}`
    const response = await axios.post(`http://localhost:5005/${path}`,
      {
        name: username
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      console.log('good job!', response.data)
      const playerId = response.data.playerId
      navigate(`/playerjoin/${playerId}/${sessionID}`)
    }
  }

  return (
    <><br />
      <Typography>
        Username:
        <TextField
          variant="outlined"
          onChange={(e) => { setUsername(e.target.value) }}
        />
      </Typography>
      <Typography>
        Session ID:
        <TextField
          variant="outlined"
          onChange={(e) => { setSessionID(e.target.value) }}
        />
      </Typography>
      <Button variant="contained" color="success" onClick={enterGame}>
        ENTER GAME!
      </Button>
    </>
  )
}

export default PlayerJoin;
