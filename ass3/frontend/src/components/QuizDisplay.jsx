import React from 'react';
import axios from 'axios';
import CreateQuiz from '../components/CreateQuiz'
import QuizTile from './QuizTile'
import Button from '@mui/material/Button';

const QuizDisplay = () => {
  // quizzes is an array of quizzes
  const [quizzes, setQuizzes] = React.useState([]);
  // fetch quizzes
  const getQuizzes = async () => {
    const response = await axios.get('http://localhost:5005/admin/quiz', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    }).catch(e => console.log(e.response.data.error));
    if (response !== undefined && response.status === 200) {
      const quizzes = response.data.quizzes;
      setQuizzes(quizzes);
    }
    console.log(response)
    console.log(quizzes)
  }

  // let count = 5;
  // const countQuestions = async (quizId) => {
  //   console.log(quizId)
  //   const path = `admin/quiz/${quizId}`
  //   const response = await axios.get(`http://localhost:5005/${path}`,
  //     {
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('userToken')}`
  //       }
  //     }
  //   ).catch(e => alert(e.response.data.error))

  //   if (response !== undefined && response.status === 200) {
  //     console.log('displaying all questions!')
  //     const questions = response.data.questions
  //     count = questions.length
  //     console.log(questions.length)
  //     return count
  //   }
  // }
  return (
    <div>
      <div>
        <Button variant="contained" onClick={getQuizzes} data-testid="get-quizzes">Get Quizzes</Button>
      </div>
      <div>
        <CreateQuiz />
      </div>
      <div>
        {
          quizzes.map((quiz) => {
            return (
                <QuizTile
                  key={quiz.id}
                  quizId={quiz.id}
                  createdAt={quiz.createdAt}
                  name={quiz.name}
                  thumbnail={quiz.thumbnail}
                  owner={quiz.owner}
                />
            )
          })
        }
      </div>
    </div>
  )
}

export default QuizDisplay
