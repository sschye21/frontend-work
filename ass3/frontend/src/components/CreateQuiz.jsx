import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const CreateQuiz = () => {
  // name of new quiz
  const [name, setName] = React.useState('');
  // fetch games
  const path = 'http://localhost:5005/admin/quiz/new';
  const createQuiz = async () => {
    if (name === '') {
      alert('Name of quiz cannot be empty');
    } else {
      console.log(name)
      const response = await axios.post(`${path}`,
        {
          name
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          },
        }).catch(e => console.log(e.response.data.error));
      if (response !== undefined && response.status === 200) {
        console.log('Created game: ', name)
        localStorage.setItem('quizid', response.data.quizId)
      }
      console.log(response.data.quizId)
    }
  }

  return (
    <div style = { { border: '1px solid red' } } >
      Name of new quiz:
      <input
        type="text"
        onChange={e => setName(e.target.value.toLowerCase())}
        placeholder="Quiz Name"
      /><br/><br/>
      <Button variant="contained" onClick={createQuiz} data-testid="create-new-quiz">Create Quiz</Button>
    </div>
  )
}

export default CreateQuiz;
