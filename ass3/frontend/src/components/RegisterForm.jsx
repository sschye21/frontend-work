import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';

function RegisterForm () {
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPwd, setConfirmPwd] = React.useState('')
  const [registered, setRegistered] = React.useState(false)
  const navigate = useNavigate()

  const register = async () => {
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/ig
    const emailRegexResult = emailRegex.test(email)

    // modal for the errors
    if (password !== confirmPwd || password === '' || confirmPwd === '') {
      alert('Passwords do not match')
      return
    }

    // need modal for the errors
    if (!emailRegexResult) {
      alert('Please enter a valid email')
      return
    }

    if (email === '') {
      alert('Please enter an email')
      return
    }

    if (name === '') {
      alert('Please enter a name')
      return
    }

    if (password.length < 8) {
      alert('Please enter a strong password that is greater than 8 characters')
      return
    }

    const path = 'admin/auth/register'
    const response = await axios.post(
      `http://localhost:5005/${path}`,
      {
        email,
        password,
        name
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => alert(e.response.data.error));

    if (response !== undefined && response.status === 200) {
      // store token into local storage
      localStorage.setItem('userToken', response.data.token)
      localStorage.setItem('userName', email)
      setRegistered(true)
    } else {
      console.log('Could not register user', response)
    }
  }

  React.useEffect(() => {
    if (registered) {
      navigate('/dashboard')
    }
  })

  const login = () => {
    navigate('/login')
  }

  return (
    <>
      Name:
      <TextField
        type="text"
        onChange={e => setName(e.target.value)}
        data-testid="register-name"
      /><br />
      Email:
      <TextField
        type="text"
        onChange={e => setEmail(e.target.value.toLowerCase())}
        data-testid="register-email"
      /><br />
      Password:
      <TextField
        type="password"
        onChange={e => setPassword(e.target.value)}
        data-testid="register-pwd"
      /><br />
      Confirm Password:
      <TextField
        type="password"
        onChange={e => setConfirmPwd(e.target.value)}
        data-testid="register-confirm-pwd"
      /><br />

      <Button variant="contained" color="primary" onClick={register} data-testid="register-confirm" >Register</Button><br /><br />
      <Button variant="contained" color="secondary" onClick={login} data-testid="login-instead" >Login?</Button>
    </>
  );
}

export default RegisterForm;
