import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';

function LoginForm () {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loginStatus, setLoginStatus] = React.useState(false);
  const navigate = useNavigate()

  // fetch login
  const login = async () => {
    // Input validation
    if (email === '' || password === '') {
      alert('Fields cannot be empty. Please enter valid credentials.');
    // call backend
    } else {
      const path = 'admin/auth/login'
      const response = await axios.post(
        `http://localhost:5005/${path}`,
        {
          email,
          password
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      // catch error
      ).catch(e => alert(e.response.data.error));
      // get response
      console.log(response);
      if (response !== undefined && response.status === 200) {
        setLoginStatus(true);
        // store token into local storage
        localStorage.setItem('userToken', response.data.token)
        localStorage.setItem('userName', email)
        console.log(localStorage.getItem('userToken'))
      } else {
        console.log('Could not login LoginForm()')
      }
    }
  }

  // Add navigate
  React.useEffect(() => {
    if (loginStatus) {
      navigate('/dashboard')
    }
  })

  const goToRegister = () => {
    navigate('/register')
  }

  return (
    <>
      Email:
      <TextField
        type="text"
        onChange={e => setEmail(e.target.value.toLowerCase())}
        data-testid="login-email"
      /><br/><br/>
      Password:
      <TextField
        type="password"
        onChange={e => setPassword(e.target.value)}
        data-testid="login-pwd"
      /><br /><br/>

      <Button variant="contained" onClick={login} data-testid="login-confirm">Login</Button><br /><br />
      <Typography>
        Don&apos;t Have an account?
      </Typography>
      <Button variant="contained" color="secondary" onClick={goToRegister} data-testid="register-instead">Register?</Button>
    </>
  );
}

export default LoginForm;
