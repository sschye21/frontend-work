import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material'

const Question = (props) => {
  const { quizId, questionId, question, image, timeLimit, answerList, correctAnswer, points, questionType } = props
  const [gameName, setGameName] = React.useState('')
  const [thumbnail, setThumbnail] = React.useState('')

  const useStyles = makeStyles({
    root: {
      margin: 'auto',
      paddingBottom: 10,
      maxWidth: 500,
      boxShadow: '0px 5px 10px 2px black',
      borderRadius: '10px'
    },
    image: {
      alignItems: 'center'
    },
    options: {
      margin: 10
    },
    modal: {
      mx: 2
    }
  })

  const newClass = useStyles()
  // const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  const closeModalDone = () => {
    setOpen(false)
    acceptChanges()
  }

  // Modal style
  const style = {
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

  // Delete a question
  const deleteQuestion = async () => {
    const path = `admin/quiz/${quizId}`
    let response = await axios.get(`http://localhost:5005/${path}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      console.log('got all questions')
      setGameName(response.data.name)
      setThumbnail(response.data.thumbnail)
      const questions = response.data.questions
      const updatedQuestions = []

      questions.forEach((element) => {
        if (element.questionId !== questionId) {
          if (element.questionId > questionId) {
            element.questionId -= 1
          }
          updatedQuestions.push(element)
        }
      })
      console.log(updatedQuestions)
      response = await axios.put(`http://localhost:5005/${path}`,
        {
          questions: updatedQuestions,
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
        console.log('deleting ur question by updating the database without the q')
      }
    }
  }

  const [changedQuestion, setChangedQuestion] = React.useState('')
  const [changeAnswerOptions, setChangeAnswerOptions] = React.useState([])
  const [changeTimeLimit, setChangeTimeLimit] = React.useState('')
  const [changeCorrectAnswer, setChangeCorrectAnswer] = React.useState([])
  const [changePoints, setChangePoints] = React.useState('');
  const [newQuestionType, setNewQuestionType] = React.useState('');
  const [newImageURL, setNewImageURL] = React.useState('');

  // Accept new edit changes to the question
  const acceptChanges = async () => {
    const path = `admin/quiz/${quizId}`
    let response = await axios.get(`http://localhost:5005/${path}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    ).catch(e => alert(e.response.data.error))

    if (response !== undefined && response.status === 200) {
      const questions = response.data.questions

      questions.forEach(element => {
        // if found question, update all the values if changed from edit
        if (element.questionId === questionId) {
          element.question = (changedQuestion.length !== 0 ? changedQuestion : element.question)
          // helps remove empty commas and changes string list into an array
          if (changeAnswerOptions.length !== 0) {
            let splitAnswers = changeAnswerOptions.split(',')
            if (splitAnswers[splitAnswers.length - 1] === '') {
              splitAnswers.pop()
            }
            splitAnswers = splitAnswers.filter(e => e !== '')
            element.answerList = splitAnswers
            console.log(splitAnswers)
          }

          // helps remove empty commas and changes string list correct answer into an array
          if (changeCorrectAnswer.length !== 0) {
            let splitCorrect = changeCorrectAnswer.split(',')
            if (splitCorrect[splitCorrect.length - 1] === '') {
              splitCorrect.pop()
            }
            splitCorrect = splitCorrect.filter(e => e !== '')
            element.correctAnswer = splitCorrect
          }

          if (changeTimeLimit.length !== 0) {
            element.timeLimit = Number(changeTimeLimit)
          }

          if (changePoints.length !== 0) {
            element.points = Number(changePoints)
          }

          if (newImageURL.length !== 0) {
            element.image = newImageURL
          }

          if (newQuestionType.length !== 0) {
            element.questionType = newQuestionType
          }
        }
      })
      // updates the database with updated question values
      response = await axios.put(`http://localhost:5005/${path}`,
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
        console.log('updated ur question')
      }
    }
  }

  // Checks if image link input is an image or a video
  const isImage = image.split('.').pop() === 'jpg'

  const handleChange = (event) => {
    setNewQuestionType(event.target.value);
    console.log(event.target.value)
  };

  return (
    <>
      <Card variant="outlined" className={newClass.root}>
      {isImage ? <img src={image} /> : <iframe src={image} />}

      {/* Question list content on cards */}
      <CardContent>
        <Typography variant="h3" align="center">
          Question {questionId}
        </Typography><br />
        <Typography align="center" variant="h6">
          Q: {question}
        </Typography><br />
        <Typography align="center">
          {answerList.map((a, index) => {
            return (
              <Button key={index} variant="contained" className={newClass.options}>
                {a}
              </Button>
            )
          })}
        </Typography><br />
        <Typography align="center">
          Time Limit: {timeLimit}
        </Typography><br />
        <Typography align="center">
          <Button variant="contained" color="success" onClick={openModal}>
            Edit Question
          </Button>
        </Typography><br />
        <Typography align="center">
          <Button variant="contained" color="error" onClick={deleteQuestion}>
            Delete Question
          </Button>
        </Typography>
      </CardContent>
      </Card>

      {/* Edit Question Modal */}
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
            Edit Question {questionId}
          </Typography><br />
          <Typography id="modal-quiz-question" className={newClass.modal}>
            Question:
            <TextField
              defaultValue={question}
              variant="outlined"
              onChange={(e) => { setChangedQuestion(e.target.value) }}/>
          </Typography><br />
          <Typography id="modal-quiz-answers" className={newClass.modal}>
            Answer Options:
            <TextField
              defaultValue={answerList}
              label="Split with commas"
              variant="outlined"
              onChange={(e) => { setChangeAnswerOptions(e.target.value) }}
            />
          </Typography><br />
          <FormControl>
            <FormLabel>If left empty, will default to selection it already is: {questionType}</FormLabel>
            <RadioGroup
              name="single-or-multi"
              value={newQuestionType}
              onChange={handleChange}
            >
              <FormControlLabel value="Multiple Choice" control={<Radio />} label="Multiple Choice" />
              <FormControlLabel value="Single Choice" control={<Radio />} label="Single Choice" />
            </RadioGroup>
          </FormControl><br /><br />
          <Typography id="modal-quiz-timelimit" className={newClass.modal}>
            Time Limit:
            <TextField
              defaultValue={timeLimit}
              variant="outlined"
              onChange={(e) => { setChangeTimeLimit(e.target.value) }}
            ></TextField>
          </Typography><br />
          <Typography id="modal-quiz-correct" className={newClass.modal}>
            Correct Answer:
            <TextField
              defaultValue={correctAnswer}
              variant="outlined"
              onChange={(e) => { setChangeCorrectAnswer(e.target.value) }}
            />
          </Typography><br />
          <Typography id="modal-quiz-points" className={newClass.modal}>
            Points:
            <TextField
              defaultValue={points}
              variant="outlined"
              onChange={(e) => { setChangePoints(e.target.value) }}
            />
          </Typography>
          <Typography id="modal-quiz-image" className={newClass.modal}>
            Image/Video URL:
            <TextField
              defaultValue={image}
              label="Image URL"
              variant="outlined"
              onChange={(e) => { setNewImageURL(e.target.value) }}
            />
          </Typography>
          <br /><br />
          <Button variant="contained" color="error" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={closeModalDone}>
            Done
          </Button>
        </Box>
      </Modal>
    </>
  )
}

Question.propTypes = {
  quizId: PropTypes.string,
  questionId: PropTypes.number,
  question: PropTypes.string,
  image: PropTypes.string,
  timeLimit: PropTypes.number,
  answerList: PropTypes.array,
  correctAnswer: PropTypes.array,
  points: PropTypes.number,
  questionType: PropTypes.string
}

export default Question;
