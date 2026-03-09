import { Snippet } from '../models/mongodb.js'

/**
 * Creates a snippet in the mongo database
 * @param {JSON} body is the body of the snippet to be created
 * @returns {boolean} true || false
 */
export const createSnippet = async (body) => {
  try {
    // Create snippet
    const snippet = await Snippet.create(body)
    if (snippet) {
      return true
    }
    return false
  } catch (error) {
    return error
  }
}

/**
 * Gets all the snippets from the database
 * @returns {[Snippet]} All snippets
 */
export const getAllSnippets = async () => {
  try {
    const allSnippets = await Snippet.find()
    return allSnippets
  } catch (error) {
    return error
  }
}

/**
 * Gets one snippet from the database
 * @param {string} id is the id of the snippet to be fetched.
 * @returns {Snippet} returns the fetched snippet
 */
export const getOneSnippet = async (id) => {
  try {
    const snippet = await Snippet.findById(id)
    return snippet
  } catch (error) {
    return error
  }
}

/**
 * Updates a snippet in the database
 * @param {string} id of the snippet to be updated
 * @param {JSON} newBody is the new updated body of the snippet
 * @returns {Error} if an internal error happens
 */
export const updateSnippet = async (id, newBody) => {
  try {
    await Snippet.findByIdAndUpdate(id, newBody)
  } catch (error) {
    return error
  }
}

/**
 * Deletes a snippet from the database
 * @param {string} id the id of the snippet
 * @returns {Error} if an internal error happens
 */
export const deleteSnippet = async (id) => {
  try {
    await Snippet.findByIdAndDelete(id)
  } catch (error) {
    return error
  }
}

/**
 * Gets all snippets that was created from a user
 * @param {string} user the username of the user
 * @returns {[Snippet]} all snippets for the user
 */
export const getUserSnippets = async (user) => {
  try {
    const snippets = await Snippet.find({ author: user })
    return snippets
  } catch (error) {
    return error
  }
}

/**
 * Gets all snippets from a search (tag or title)
 * @param {JSON} query is a JSON with queries
 * @returns {[JSON]} Snippets that was fetched from the database
 */
export const getSnippetsBySearch = async (query) => {
  try {
    let snippets = null
    // If search is a tag and title
    if (query.tag && query.title) {
      snippets = await Snippet.where('tags').in([query.tag]).where('title').equals(query.title)
    } else if (query.tag) { // If search is a tag
      snippets = await Snippet.where('tags').in([query.tag])
    } else if (query.title) { // If search is a title
      snippets = await Snippet.where('title').equals(query.title)
    }
    return snippets
  } catch (error) {
    return error
  }
}
