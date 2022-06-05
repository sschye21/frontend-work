import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router';
import Confetti from 'react-confetti';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const PlayerSession = () => {
  const params = useParams()

  // If quiz is in lobby, quiz, answer, complete state
  const [quizState, setQuizState] = useState('lobby')
  const [currentQuestion, setCurrentQuestion] = useState('')
  // player selected hoices for multiple or single choice
  const [highlightChoices, setHighlightChoices] = useState([])
  // list of correct answers to show user when question finishes
  const [questionAnswers, setQuestionAnswers] = useState([])
  // timer for question
  const [timer, setTimer] = useState(-10)
  // Set player results
  const [playerResults, setPlayerResults] = useState([]);

  console.log('State: ', quizState)

  // Poll quizState if host starts game from lobby -> quiz
  useEffect(() => {
    let interval = 0;
    if (quizState === 'lobby') {
      interval = setInterval(() => {
        startedQuiz(params.playerId)
      }, 1000)
    }
    return () => clearInterval(interval)
  })

  // Constant poll if quiz is up-to-date, if current question has advanced to next
  useEffect(() => {
    const interval = setInterval(() => {
      if ((quizState === 'answer') || quizState === 'quiz') {
        getQuestion(params.playerId);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  // countdown given current time deduct 1 every second to show player
  // keep track of timer, transition to show answer once timer hits 0
  useEffect(() => {
    if (quizState === 'quiz') {
      if (timer > 0) {
        setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
      } else if (timer === 0) {
        // if timer hits 0, transition to answer
        setQuizState('answer')
      }
    }
  })

  // Quiz commence, get questions
  useEffect(() => {
    if (quizState === 'quiz') {
      getQuestion(params.playerId)
    }
  }, [quizState])

  // reveal answer after timer runs out
  useEffect(() => {
    if (quizState === 'answer') {
      // reset highlighted answers for next question
      setHighlightChoices([]);
      console.log('Getting answers')
      getAnswers(params.playerId)
    }
  }, [quizState])

  // when quizState is complete, get results for player in the game
  useEffect(() => {
    if (quizState === 'complete') {
      getQuizSessionResults(params.playerId);
    }
  }, [quizState])

  // Check if quiz has commenced, otherwise keep polling in lobby
  const startedQuiz = async () => {
    const path = `play/${params.playerId}/status`
    const response = await axios.get(
      `http://localhost:5005/${path}`
    ).catch(e => alert(e.response.data.error))
    // set quiz state to
    if (response !== undefined && response.status === 200 && response.data.started) {
      setQuizState('quiz')
    }
  }

  // Get next question for quiz
  const getQuestion = async () => {
    const path = `play/${params.playerId}/question`
    const response = await axios.get(
      `http://localhost:5005/${path}`,
    ).catch(e => alert(e.response.data.error))
    if (response !== undefined && response.status === 200) {
      const question = response.data.question
      // debugged, if different question, reset answer and highlight state
      if (question.questionId !== currentQuestion.questionId) {
        // reset highlighted choices
        setHighlightChoices(new Array(question.answerList.length).fill(false));
        setQuizState('quiz')
        setTimer(question.timeLimit);
      }
      // hold the current question to track state of quiz (which question)
      setCurrentQuestion(question)
    } else {
      // Quiz is complete change state
      setQuizState('complete')
    }
  }

  // Get solutions to question
  const getAnswers = async (playerId) => {
    const path = `play/${playerId}/answer`;
    const response = await axios.get(
      `http://localhost:5005/${path}`
    ).catch(e => console.log(e.message));
    // check answer
    if (response !== undefined && response.status === 200) {
      const correctAnswerAndId = response.data.answerIds
      setQuestionAnswers([...correctAnswerAndId])
      console.log('CORRECTION->', correctAnswerAndId)
      console.log('CORRECTION2->', questionAnswers)
    }
  }

  // store and highlight player selection
  const selectAnswer = async (playerId, answerValue, answerId) => {
    console.log(playerId, answerValue, answerId);
    // Multiple choice or single choice
    if (currentQuestion.questionType === 'Multiple Choice') {
      // Add selected answer into highlighted selection or unselect already selected answer
      const selectedAnswers = highlightChoices.map((answer, selectedAnswerId) => {
        // get the index
        if (answerId === selectedAnswerId) {
          // select/unselect answerId
          return (!answer)
        } else {
          return answer
        }
      });
      console.log('Selected Answers:', selectedAnswers)
      setHighlightChoices(selectedAnswers)
    } else {
      const singleChoice = new Array(highlightChoices.length).fill(false)
      singleChoice[answerId] = true
      console.log(singleChoice)
      setHighlightChoices(singleChoice)
    }
  }

  const submitMyAnswer = async () => {
    const myAnswer = []
    highlightChoices.forEach((choice, index) => {
      if (choice) {
        myAnswer.push(currentQuestion.answerList[index])
      }
    });
    console.log('My submitted answers', myAnswer)
    const response = await axios.put(`http://localhost:5005/play/${params.playerId}/answer`, {
      answerIds: myAnswer
    }).catch(e => console.log(e.message));
    if (response !== undefined && response.status === 200) {
      console.log(response);
    } else {
      console.log('Error: ', response)
    }
  }

  // get game results
  const getQuizSessionResults = async (playerId) => {
    const path = `play/${playerId}/results`
    const response = await axios.get(
      `http://localhost:5005/${path}`
    ).catch(e => console.log(e.message));
    if (response !== undefined && response.status === 200) {
      const results = [];
      response.data.forEach(questionResult => {
        if (questionResult.correct !== true) {
          results.push('Incorrect Answer');
        } else {
          results.push('Correct Answer');
        }
      });
      setPlayerResults(results);
    }
  }

  return (
    <>
      {/* hghf */}
      {(quizState === 'lobby') &&
        <div>
          <h3>Awaiting host to advance game. Quiz will commence soon...</h3>
          <Confetti />
        </div>
      }

      {/* Quiz mode commenced */}
      {(quizState === 'quiz' && currentQuestion !== '')
        ? <Card>
            <CardContent>
              <CardHeader
                title={`Question: ${currentQuestion.question}`}
                subheader={`Question Type: ${currentQuestion.questionType}`}
              ></CardHeader>
              <p>Timer [Seconds]: {timer}</p>
              <p>{<iframe src={currentQuestion.image} />} </p>
              {/* <ReactPlayer url={currentQuestionObject.videoURL} /> */}
            </CardContent>
            <CardActions>
              {/* Highlight selected answers to show player what is selected */}
              {currentQuestion.answerList.map((answerOption, answerId) => (
                <Button key={answerOption.questionId}
                size="small"
                color={highlightChoices[answerId] ? 'primary' : 'secondary'}
                variant="contained"
                onClick={() => selectAnswer(params.playerId, answerOption, answerId)}
                >
                  {answerOption}
                </Button>
              ))}
            <Button variant='contained' onClick={submitMyAnswer}>
              Submit My Answer
            </Button>
            </CardActions>
          </Card>
        : <div></div>
      }

      {/* Show answer after time limit runs out */}
      {(quizState === 'answer')
        ? <Card>
            <CardContent>
              <p>{<iframe src={currentQuestion.image} />} </p>
              <CardHeader
                title={`Correct Answers are ${questionAnswers}`}
              ></CardHeader>
              <ReactPlayer url={currentQuestion.videoURL} />
            </CardContent>
          </Card>
        : <div></div>
      }

      {(quizState === 'complete')
        ? <Card>
            <CardContent>
              <CardHeader
                title={'Quiz has closed! Results are below'}
              ></CardHeader>
              {playerResults.map((questionResult, index) => (
                <div key={index}>
                  <p>Question {index} - Outcome: {questionResult}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        : <div></div>
      }
    </>
  )
}

export default PlayerSession;
