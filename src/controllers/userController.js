import { User } from '../models/mongodb.js'
import bcrypt from 'bcrypt'
const salt = 10

/**
 * Creates a user in the database
 * @param {JSON} body is the body submitted from the user form
 * @returns {boolean} true || false
 */
export const createUser = async (body) => {
  try {
    // Hash the password of the user
    body.password = await bcrypt.hash(body.password, salt)
    // Check if username or email already exists
    const username = await User.exists({ username: body.username })
    const email = await User.exists({ email: body.email })
    if (!(username === null || email === null)) {
      return false
    } else {
      await User.create(body)
      return true
    }
  } catch (error) {
    return error
  }
}

/**
 * Logins the user to the app
 * @param {string} username of the user
 * @param {string} password of the user
 * @returns {boolean} true || false
 */
export const loginUser = async (username, password) => {
  try {
    // Fetch user
    const user = await User.findOne({
      username
    })
    if (user) {
      // Check if password is correct
      const comparePassword = await bcrypt.compare(password, user.password)
      if (comparePassword) {
        return true
      }
    }
    return false
  } catch (error) {
    return error
  }
}
