import express from 'express'
export const logoutRouter = express.Router()

/**
 * Listens for get requests for the logout page.
 * Destroys the session and logs out
 */
logoutRouter.get('/', (req, res) => {
  try {
    if (req.session.authenticated) {
      req.session.destroy()
      return res.redirect('/login')
    }
    return res.redirect('login')
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})
