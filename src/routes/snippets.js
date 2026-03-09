import express from 'express'
import {
  createSnippet, getAllSnippets, getOneSnippet,
  updateSnippet, deleteSnippet, getUserSnippets, getSnippetsBySearch
} from '../controllers/snippetController.js'
export const snippetRouter = express.Router()

/**
 * Listens for get requests for the index page.
 */
snippetRouter.get('/', async (req, res) => {
  try {
    // Get user and all snippets
    const user = req.session.user
    const snippets = await getAllSnippets()
    // Render index page with snippets
    res.render('snippets/index', {
      title: snippets.length === 0 ? 'There are currently no code snippets' : 'Code Snippets',
      user,
      snippets,
      success: req.flash('success'),
      error: req.flash('error'),
      logout: req.session.authenticated
    })
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

/**
 * Listens for get requests for the new snippet page.
 */
snippetRouter.get('/new', (req, res) => {
  // Checks if the user is authenticated (required to create a snippet)
  if (req.session.authenticated) {
    res.status(200).render('snippets/new', {
      error: req.flash('error'),
      success: req.flash('success'),
      title: '',
      description: '',
      code: '',
      tags: [],
      language: 'Python',
      logout: req.session.authenticated
    })
  } else {
    // Sends a flash message and 403 status code if not logged in
    req.flash('error', 'You need to log in to be able to create a snippet!')
    res.status(403).redirect('/login')
  }
})

/**
 * Listens for get requests for the profile page of a user.
 */
snippetRouter.get('/profile/:user?', async (req, res) => {
  const user = req.session.user
  try {
    // If the user parameter is empty then the profile button was clicked
    // View the current users profile
    let profile = req.params.user
    if (profile === undefined) {
      // If a logged out user clicks on the profile button.
      if (req.session.authenticated) {
        profile = req.session.user
      } else {
        req.flash('error', 'You need to be logged in to view your profile!')
        return res.status(403).redirect('/login')
      }
    }

    // Gets all snippets for the user and renders the page with the snippets
    const snippets = await getUserSnippets(profile)
    res.render('snippets/profile', {
      title: snippets.length === 0 ? 'This user has currently no code snippets' : `Snippets owned by ${profile}`,
      user,
      snippets,
      success: req.flash('success'),
      error: req.flash('error'),
      logout: req.session.authenticated
    })
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

/**
 * Listens for get requests for the search page
 */
snippetRouter.get('/search', async (req, res) => {
  const user = req.session.user
  try {
    // Get tag and title query from the search
    const tag = req.query.tag
    const title = req.query.title

    // If query is empty
    if (!tag && !title) {
      req.flash('error', 'You need to specify a search term!')
      return res.status(400).redirect('/')
    }
    const query = {}

    if (tag) {
      query.tag = tag // Tag query
    }
    if (title) {
      query.title = title // Title query
    }

    // Gets all snippets that match the query
    const snippets = await getSnippetsBySearch(query)
    res.render('snippets/index', {
      title: snippets.length === 0 ? 'There are currently no code snippets matching the search' : 'Code Snippets matching search',
      user,
      snippets,
      success: req.flash('success'),
      error: req.flash('error'),
      logout: req.session.authenticated
    })
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

/**
 * Listens for get requests for the edit page with an id
 */
snippetRouter.get('/edit/:id', async (req, res) => {
  try {
    // Check if authenticated
    if (req.session.authenticated) {
      const snippet = await getOneSnippet(req.params.id)
      if (snippet) {
        // Check if the user owns the snippet that they are trying to edit.
        if (req.session.user === snippet.author) {
          res.status(200).render('snippets/edit', {
            snippet,
            error: req.flash('error'),
            success: req.flash('success'),
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            tags: snippet.tags.toString().replaceAll(',', ';'),
            language: snippet.language,
            logout: req.session.authenticated
          })
        } else {
          // If user does not own the snippet
          req.flash('error', "You don't own this snippet!")
          res.status(403).redirect('/')
        }
      } else {
        // If the snippet was not found, send a bad request code
        req.flash('error', 'Snippet was not found!')
        res.status(400).redirect('/')
      }
    } else {
      // If the user is not logged in and tries to edit a snippet
      req.flash('error', 'You are not logged in!')
      res.status(403).redirect('/login')
    }
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

// Listens for put requests from the edit page
snippetRouter.put('/edit/:id', async (req, res) => {
  try {
    // Check if authenticated
    if (req.session.authenticated) {
      const snippet = await getOneSnippet(req.params.id)
      req.body.tags = req.body.tags.split(';')
      const user = snippet.author
      // Check if the user logged in is the actual owner of the snippet
      if (user === req.session.user) {
        // Update the snippet with the new body
        await updateSnippet(req.params.id, req.body)
        req.flash('success', 'Snippet updated successfully!') // Send successful message
        return res.status(200).redirect('/')
      } else {
        req.flash('error', "You don't own this snippet!") // Send error message
        return res.status(403).redirect('/')
      }
    } else {
      // If user is not logged in
      req.flash('error', 'You are not logged in!')
      return res.status(403).redirect('/login')
    }
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

// Listens for delete requests for the snippet
snippetRouter.delete('/delete/:id', async (req, res) => {
  try {
    let message = ''
    // Check authentication
    if (req.session.authenticated) {
      const snippet = await getOneSnippet(req.params.id)
      if (snippet) {
        // Check if the user owns the snippet
        // Delete snippet and send successful message
        if (req.session.user === snippet.author) {
          await deleteSnippet(req.params.id)
          req.flash('success', `Snippet ${snippet.title} deleted successfully!`)
          return res.status(200).json({ success: true })
        } else {
          message = 'You are not the author of this snippet!'
        }
      } else {
        message = "The snippet doesn't exist!"
      }
    } else {
      message = 'You need to be logged in to delete a snippet!'
    }
    // Send error message
    req.flash('error', message)
    return res.status(403).json({ success: false })
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})

// Listens for post requests for new snippets
snippetRouter.post('/new', async (req, res) => {
  try {
    // Check authentication
    if (!req.session.authenticated) {
      req.flash('error', 'You are not logged in!')
      return res.status(403).redirect('/')
    }
    req.body.tags = req.body.tags.split(';')
    req.body.author = req.session.user // Set the author of the snippet
    const snippet = await createSnippet(req.body) // Create snippet
    // Error handling
    if (!snippet) {
      req.flash('error', 'Error when creating snippet!')
      return res.status(400).redirect('/snippets/new')
    }
    // Send successful message
    req.flash('success', 'Snippet created successfully!')
    return res.status(200).redirect('/snippets/new')
  } catch (error) {
    return res.status(500).render('errorPage', {
      title: 'Internal Server Error',
      status: '500 - Internal server error',
      errorMessage: 'There has been an error in our internal server\nPlease wait a few minutes and retry, if the issue persists, contact our support team'
    })
  }
})
