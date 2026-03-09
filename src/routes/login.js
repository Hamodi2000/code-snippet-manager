import express from 'express'
import { loginUser } from '../controllers/userController.js'
import rateLimit from 'express-rate-limit'
export const loginRouter = express.Router()

/**
 * Listens for get requests for login page
 */
loginRouter.get('/', (req, res) => {
  // Checks if the user is authenticated
  if (req.session.authenticated) {
    req.flash('error', 'You are already logged in!')
    return res.status(400).redirect('/')
  }
  res.render('login', {
    error: req.flash('error'),
    success: req.flash('success'),
    logout: req.session.authenticated
  })
})

/**
 * Used to limit login attempts to prevent bruteforce
 */
const loginLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    req.flash('error', 'Too many failed login attempts. Please wait 10 seconds before trying again.')
    res.status(429).redirect('/login')
  }
})

/**
 * Listens for post requests for the login page
 */
loginRouter.post('/', loginLimiter, async (req, res) => {
  try {
    const userRegex = /^[a-zA-Z0-9]+$/
    if (userRegex.test(req.body.username)) {
      const loggedIn = await loginUser(req.body.username, req.body.password)
      if (loggedIn) {
        req.session.authenticated = true // Set authenticated attribute to true
        req.session.user = req.body.username // Set the logged in user
        req.session.save() // Save session
        return res.status(200).redirect('/')
      }
    }
    req.flash('error', 'Invalid username or password')
    return res.status(400).redirect('/login')
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})
