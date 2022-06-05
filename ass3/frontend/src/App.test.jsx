import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import QuizDisplay from './components/QuizDisplay'
import CreateQuiz from './components/CreateQuiz'
import { BrowserRouter } from 'react-router-dom';

// Test for registration components and if they exist
describe('Registration form testing', () => {
  test('Test for name input value', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('register-name')).toBeTruthy()
  })

  test('Test for email input value', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('register-email')).toBeTruthy()
  })

  test('Test for password input value', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('register-pwd')).toBeTruthy()
  })

  test('Test for confirm password input value', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('register-confirm-pwd')).toBeTruthy()
  })

  test('Test for button confirm input', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('register-confirm')).toBeTruthy()
  })

  test('Test for logging in if user already is registered', () => {
    const { queryByTestId } = render(<BrowserRouter><RegisterForm/></BrowserRouter>)
    expect(queryByTestId('login-instead')).toBeTruthy()
  })
})

// Test for login components and if they exist
describe('Login form testing', () => {
  test('Test for email input value', () => {
    const { queryByTestId } = render(<BrowserRouter><LoginForm/></BrowserRouter>)
    expect(queryByTestId('login-email')).toBeTruthy()
  })

  test('Test for password input value', () => {
    const { queryByTestId } = render(<BrowserRouter><LoginForm/></BrowserRouter>)
    expect(queryByTestId('login-pwd')).toBeTruthy()
  })

  test('Test for button confirm input', () => {
    const { queryByTestId } = render(<BrowserRouter><LoginForm/></BrowserRouter>)
    expect(queryByTestId('login-confirm')).toBeTruthy()
  })

  test('Test for registering in if user isnt registered', () => {
    const { queryByTestId } = render(<BrowserRouter><LoginForm/></BrowserRouter>)
    expect(queryByTestId('register-instead')).toBeTruthy()
  })
})

// Test for quiz display components and if they exist
describe('Quiz Display tests', () => {
  test('Test for getting quizzes', () => {
    const { queryByTestId } = render(<BrowserRouter><QuizDisplay/></BrowserRouter>)
    expect(queryByTestId('get-quizzes')).toBeTruthy()
  })
})

// Test for quiz creation of name where input is changed/onChange
describe('Quiz Display tests', () => {
  test('Test for name creation input when creating a quiz', () => {
    const { queryByPlaceholderText } = render(<BrowserRouter><CreateQuiz/></BrowserRouter>)
    const nameInput = queryByPlaceholderText('Quiz Name')
    fireEvent.change(nameInput, { target: { value: 'BRAND NEW QUIZ' } })
    expect(nameInput.value).toBe('BRAND NEW QUIZ')
  })
})

// Test for button input change
describe('Quiz creation triggering a new quiz creation', () => {
  test('Test for name creation when creating a quiz by clicking button', () => {
    const requestSearch = jest.fn()
    const { queryByTestId, queryByPlaceholderText } = render(<BrowserRouter><CreateQuiz/></BrowserRouter>)
    const nameInput = queryByPlaceholderText('Quiz Name')

    fireEvent.change(nameInput, { target: { value: 'BRAND NEW QUIZ' } })
    fireEvent.click(queryByTestId('create-new-quiz'))

    expect(requestSearch).toHaveBeenCalled()
  })
})
