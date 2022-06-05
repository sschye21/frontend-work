import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@mui/styles';
import { flexbox } from '@mui/system';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Box from '@mui/material/Box';

const QuizTile = (quizData) => {
  const { quizId, createdAt, name, thumbnail, owner } = quizData;
  console.log('QuizTile', quizId, createdAt, name, thumbnail, owner)
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')
  const [sessionInProgress, setSessionInProgress] = useState(false)
  const [pastQuizzes, setPastQuizzes] = useState([])

  // Start Quiz Modal state
  const [open, setOpen] = useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  // Start Quiz Modal state
  const [openPastQuizzes, setOpenPastQuizzes] = useState(false)
  const openPastQuizzesModal = () => setOpenPastQuizzes(true)
  const closePastQuizzesModal = () => setOpenPastQuizzes(false)
  // Modal Box style
  const boxStyle = {
    position: 'absolute',
    width: '80%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 30,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 4,
  };

  const useStyles = makeStyles({
    root: {
      container: flexbox,
      border: '1px solid black',
      padding: '20px',
      marginLeft: '20%',
      marginRight: '20%',
      marginTop: '5px',
      marginBottom: '5px',
      backgroundColor: 'pink'
    }
  })
  const cardStyle = useStyles();

  // Edit a quiz
  const editQuiz = () => {
    navigate(`/edit/${quizId}`)
  }

  // Get results of game
  const quizResults = (session) => {
    navigate(`/results/${session}`)
  }

  // Start a quiz
  const startQuiz = async () => {
    const path = `admin/quiz/${quizId}/start`
    const response = await axios.post(
      `http://localhost:5005/${path}`,
      '',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
      }
    ).catch(e => alert(e.response.data.error));

    if (response !== undefined && response.status === 200) {
      setQuizStart(!quizStart);
      console.log('Started quiz response:', quizId, response.data, quizStart);
      getQuizSession();
    } else if (response !== undefined && response.status === 400) {
      setSessionInProgress(true)
    } else {
      console.log('Could not start quiz', response)
    }
  }

  // Advance quiz
  const advanceQuiz = async () => {
    const path = `admin/quiz/${quizId}/advance`
    const response = axios.post(
      `http://localhost:5005/${path}`,
      '',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error));
    if (response !== undefined && response.status === 200) {
      console.log('Advanced quiz: ', sessionId)
    }
  }

  // Edit quiz
  const endQuiz = async () => {
    const path = `admin/quiz/${quizId}/end`
    const response = await axios.post(
      `http://localhost:5005/${path}`,
      '',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
      }
    ).catch(e => alert(e.response.data.error));

    if (response !== undefined && response.status === 200) {
      setQuizStart(!quizStart);
      setSessionId('');
      console.log('Started quiz response:', response.data, quizStart);
    } else {
      console.log('Could not start quiz', response)
    }
  }

  // Get session of quiz
  const getQuizSession = async () => {
    const path = `admin/quiz/${quizId}`
    const response = await axios.get(`http://localhost:5005/${path}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))
    if (response !== undefined && response.status === 200) {
      setSessionId(response.data.active)
      setPastQuizzes(response.data.oldSessions)
    }
  }

  // TODO fix state
  const [quizStart, setQuizStart] = useState(true)

  return (
    <Card id={`quiz${quizId}`} key={quizId} className={cardStyle.root} >
      <CardContent>
        <div>
          Quiz Title: {name}
        </div>
        <div>
          Questions:
        </div>
        <div>
          Thumbnail:
        </div>
        <div>
          Total Time:
        </div>
        <div>
          <Typography variant="body2" component="h2">
            <Button variant="contained" onClick={ () => { startQuiz(); openModal(); } } >Start Quiz</Button>
            <Button variant="contained" onClick={ () => { endQuiz(); } }>End Quiz</Button>
            <Button variant="contained" onClick={editQuiz}>Edit Quiz</Button>
            <Button variant="contained" onClick={ () => { getQuizSession(); openPastQuizzesModal(); } }>Past Quiz</Button>
            <Button variant="contained">Delete Quiz</Button>
            <br></br>
            Live Sessions: {sessionId}
            <Modal
              open={open}
            >
              <Box sx={boxStyle}>
              { sessionInProgress ? <h2>Quiz already started, details below</h2> : <h2>Active Quiz Details</h2> }
              <div>
                <Button variant="contained" color="secondary" onClick={() => { navigator.clipboard.writeText(sessionId) }}>Copy Session PIN: {sessionId}</Button>
              </div>
              <div>
                <Button variant="contained" color="secondary" onClick={() => window.open('http://localhost:3000/playerjoin/', '_blank')}>Join in a new tab here.</Button>
              </div>
              <div>
                <Button variant="contained" color="success" onClick={advanceQuiz}>Advance Quiz</Button>
              </div>
              <div>
                <Button variant="contained" color="warning" onClick={() => { endQuiz(); closeModal() }}>END SESSION</Button>
              </div>
              <div>
                <Button variant="contained" color="error" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              </Box>
            </Modal>
            {/* Past quizzes modal */}
            <Modal
              open={openPastQuizzes}
            >
              <Box sx={boxStyle}>
              <div>
                {
                  pastQuizzes.map((quizId) => {
                    return (
                        <Button
                          onClick={ () => { quizResults(quizId) } }
                          variant="contained"
                          color="success"
                          key={quizId}
                        >{quizId}
                        </Button>
                    )
                  })
                }
              </div>
              <div>
                <Button variant="contained" color="error" onClick={closePastQuizzesModal}>
                  Cancel
                </Button>
              </div>
              </Box>
            </Modal>
          </Typography>
        </div>
        {/* Add question count */}
      </CardContent>
    </Card>
  )
}

export default QuizTile;
