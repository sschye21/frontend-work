import React from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';

// Logs user out by removing their userToken from localstorage
const LogoutButton = () => {
  const [loggedOut, setLoggedOut] = React.useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    const path = 'admin/auth/logout'
    const response = await axios.post(
      `http://localhost:5005/${path}`,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      console.log('logged out!')
      localStorage.removeItem('userToken')
      setLoggedOut(true)
    } else {
      console.log('Could not log out')
    }
  }

  React.useEffect(() => {
    if (loggedOut) {
      navigate('/login')
    }
  })

  return (
    <>
      <Typography align="right">
        <Button variant="contained" onClick={logout}>LOGOUT</Button>
      </Typography>
    </>
  );
}

export default LogoutButton;
