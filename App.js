import express from 'express'
import { snippetRouter } from './src/routes/snippets.js'
import { userRouter } from './src/routes/user.js'
import { loginRouter } from './src/routes/login.js'
import { logoutRouter } from './src/routes/logout.js'
import { connectDB, mongoStore } from './src/models/mongodb.js'
import session from 'express-session'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import methodOverride from 'method-override'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

connectDB() // Connect to database
app.set('view engine', 'ejs') // Use ejs engine
app.use(express.static('public')) // Use public directory for static pages
app.use(express.json()) // Send json
app.use(express.urlencoded({ extended: true })) // for middleware
app.use(methodOverride('_method')) // Override method for delete and put
// Use sessions and save them in the mongostore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 60 * 1000 },
  saveUninitialized: true,
  store: mongoStore
}))
app.use(flash()) // For flash messages

// Redirect to main page.
app.get('/', (req, res) => {
  res.status(200).redirect('/snippets')
})

app.use('/snippets', snippetRouter) // Snippets route
app.use('/user', userRouter) // User route
app.use('/login', loginRouter) // Login route
app.use('/logout', logoutRouter) // Logout route

// For the flash messages, view the flash message and move on to next call
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success')
  res.locals.errorMessage = req.flash('error')
  next()
})

// If the page is not found, render a 404 page
app.use((req, res) => {
  res.status(404).render('errorPage', {
    title: 'Page Not Found',
    status: '404 - Page not found',
    errorMessage: 'The page was not found.'

  })
})

// Start connection to mongoose and then listen for requests.
mongoose.connection.once('open', () => {
  console.log('Connect at: http://localhost:5500')
  app.listen(5500)
})
