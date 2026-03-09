import express from 'express'
import { createUser } from '../controllers/userController.js'

export const userRouter = express.Router()

/**
 * Listens for get requests for the user page
 */
userRouter.get('/', (req, res) => {
  // If not authenticated send to login page
  if (!req.session.authenticated) {
    return res.status(403).redirect('/login')
  }
  // If authenticated then send to profile page
  return res.status(200).redirect(`/snippets/profile/${req.session.user}`)
})

/**
 * Listens for get requests for new users
 */
userRouter.get('/new', (req, res) => {
  if (req.session.authenticated) {
    req.flash('error', 'You need to logout to create an account.')
    return res.status(403).redirect('/')
  }
  // Render the new user form
  res.render('user/new', {
    username: '',
    email: '',
    success: req.flash('success'),
    error: req.flash('error'),
    logout: req.session.authenticated
  })
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const userRegex = /^[a-zA-Z0-9]+$/
/**
 * Listens for post requests from the new user page
 */
userRouter.post('/new', async (req, res) => {
  try {
    // Check if passwords match
    if (!req.body.password === req.body.repeatPassword) {
      req.flash('error', 'Passwords do not match!')
      res.status(400).redirect('/user/new')
    } else if (!emailRegex.test(req.body.email)) { // Check if email is valid
      req.flash('error', "You've entered an invalid email!")
      res.status(400).redirect('/user/new')
    } else if (!userRegex.test(req.body.username)) {
      req.flash('error', "You've entered an invalid username!")
      res.status(400).redirect('/user/new')
    } else {
      // Create user and send message
      const userCreated = await createUser(req.body)
      if (userCreated) {
        req.flash('success', 'User created successfully!')
        res.status(200).redirect('/')
      } else {
        req.flash('error', 'Username or email already exists!')
        res.status(400).redirect('/user/new')
      }
    }
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: `There has been an error in our internal server
      Please wait a few minutes and retry, if the issue persists, contact our support team`
    })
  }
})
