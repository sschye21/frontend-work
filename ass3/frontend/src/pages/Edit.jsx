import axios from 'axios';
import React from 'react';
import Question from '../components/Question'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom'
import Home from '../components/Home'
import {
  Button,
  Modal,
  Typography,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel
} from '@mui/material'

function Edit () {
  const [gameName, setGameName] = React.useState('')
  const [questions, setQuestions] = React.useState([])
  const [thumbnail, setThumbnail] = React.useState('')
  const params = useParams()
  const navigate = useNavigate()

  // Display the questions backend call
  const displayQuestions = async () => {
    const path = `admin/quiz/${params.quizid}`
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
      console.log('displaying all questions!')
      setGameName(response.data.name)
      setThumbnail(response.data.thumbnail)
      setQuestions(response.data.questions)
    }
  }

  // Displays the questions
  React.useEffect(() => {
    displayQuestions();
  }, []);

  const [newQuestion, setNewQuestion] = React.useState('')
  const [newAnswerOptions, setNewAnswerOptions] = React.useState([])
  const [newTimeLimit, setNewTimeLimit] = React.useState('')
  const [newCorrectAnswer, setNewCorrectAnswer] = React.useState([])
  const [newPoints, setNewPoints] = React.useState('')
  const [newImage, setNewImage] = React.useState('')
  const [newQuestionType, setNewQuestionType] = React.useState('');

  // Creates a new question when called
  const createNewQuestion = async () => {
    if (newQuestion.length === 0 || newAnswerOptions.length === 0 || newTimeLimit.length === 0 ||
      newCorrectAnswer.length === 0 || newPoints.length === 0 || newImage.length === 0 || newQuestionType.length === 0) {
      console.log('cannot have an empty field')
      return
    }

    if (isNaN(newTimeLimit) || isNaN(newPoints)) {
      console.log('must have a number input for time limit and/or points')
      return
    }

    const questionNumber = questions.length + 1
    let splitAnswers = newAnswerOptions.split(',')
    if (splitAnswers[splitAnswers.length - 1] === '') {
      splitAnswers.pop()
    }
    splitAnswers = splitAnswers.filter(e => e !== '')

    let splitCorrect = newCorrectAnswer.split(',')
    if (splitCorrect[splitCorrect.length - 1] === '') {
      splitCorrect.pop()
    }
    splitCorrect = splitCorrect.filter(e => e !== '')

    const newQuestions = {
      question: newQuestion,
      quizId: params.quizid,
      questionId: questionNumber,
      image: newImage,
      timeLimit: Number(newTimeLimit),
      answerList: splitAnswers,
      correctAnswer: splitCorrect,
      points: Number(newPoints),
      questionType: newQuestionType
    }

    questions.push(newQuestions)

    const path = `admin/quiz/${params.quizid}`
    const response = await axios.put(`http://localhost:5005/${path}`,
      {
        questions: questions,
        gameName,
        thumbnail
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      setOpen(false)
    }
  }

  // Returning to dashboard and saving any changes made
  const returnToDashboard = async () => {
    const path = `admin/quiz/${params.quizid}`
    const response = await axios.put(`http://localhost:5005/${path}`,
      {
        questions,
        gameName,
        thumbnail
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      console.log('questions saved')
      navigate('/dashboard')
    }
  }

  const [open, setOpen] = React.useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const style = {
    position: 'absolute',
    bgcolor: 'background.paper',
    width: '80%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 30,
    border: '1px solid black',
    p: 4,
  };

  const handleChange = (event) => {
    setNewQuestionType(event.target.value);
    console.log(event.target.value)
  };

  return (
    <>
      <Home />
      <h1 align="center">EDIT QUIZ: {gameName} </h1>
      <Button variant="contained" color="secondary" onClick={openModal}>
        Add New Question
      </Button>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-quiz-name"
      >
        <Box sx={style}>
          <Typography align="right">
            <Button onClick={closeModal}>
              X
            </Button>
          </Typography>
          <Typography id="modal-title" variant="h5" component="h5">
            Add a new Question:
          </Typography>
          <Typography id="modal-quiz-question" sx={{ mt: 2 }}>
            Question:
            <TextField
              id="outlined-basic"
              placeholder="Question"
              variant="outlined"
              onChange={(e) => { setNewQuestion(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-answers" sx={{ mt: 2 }}>
            Answer Options (split with commas):
            <TextField
              id="outlined-basic"
              placeholder="Answers"
              variant="outlined"
              onChange={(e) => { setNewAnswerOptions(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-answers" sx={{ mt: 2 }}>
            Question Type:
          </Typography>
          <FormControl>
            <RadioGroup
              name="single-or-multi"
              value={newQuestionType}
              onChange={handleChange}
            >
              <FormControlLabel value="Multiple Choice" control={<Radio />} label="Multiple Choice" />
              <FormControlLabel value="Single Choice" control={<Radio />} label="Single Choice" />
            </RadioGroup>
          </FormControl>
          <Typography id="modal-quiz-timelimit" sx={{ mt: 2 }}>
            Time Limit:
            <TextField
              id="outlined-basic"
              placeholder="Time Limit"
              variant="outlined"
              onChange={(e) => { setNewTimeLimit(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-correct" sx={{ mt: 2 }}>
            Correct Answer:
            <TextField
              id="outlined-basic"
              placeholder="Correct Answer"
              variant="outlined"
              onChange={(e) => { setNewCorrectAnswer(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-points" sx={{ mt: 2 }}>
            Points:
            <TextField
              id="outlined-basic"
              placeholder="Points"
              variant="outlined"
              onChange={(e) => { setNewPoints(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-image" sx={{ mt: 2 }}>
            Image/Video URL:
            <TextField
              id="outlined-basic"
              placeholder="Image URL"
              variant="outlined"
              onChange={(e) => { setNewImage(e.target.value) }}
            />
          </Typography>
          <br /><br />
          <Button variant="contained" color="error" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={createNewQuestion}>
            Add Question
          </Button>
        </Box>
      </Modal>
      <br /><br />
      <Button variant="contained" color="success" onClick={returnToDashboard}>
        Save Changes
      </Button>
      <div>
        {questions.map((q) => {
          return (
            <>
              <Question
                key={q.questionId}
                quizId={q.quizId}
                questionId={q.questionId}
                question={q.question}
                image={q.image}
                timeLimit={q.timeLimit}
                answerList={q.answerList}
                correctAnswer={q.correctAnswer}
                points={q.points}
                questionType={q.questionType}
              /><br />
            </>
          );
        })}
      </div>
    </>
  )
}

export default Edit;
