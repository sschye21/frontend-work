import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutButton from '../components/LogoutButton'

function Home () {
  const navigate = useNavigate()

  const goToDashBoard = () => {
    navigate('/dashboard')
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button variant="contained" color="secondary" onClick={goToDashBoard}>HOME</Button>
            </Typography>
            <LogoutButton />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Home;
