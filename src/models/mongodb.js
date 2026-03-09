import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'

const dbURI = process.env.DB_URI

// Mongostore to save sessions
export const mongoStore = MongoStore.create({
  mongoUrl: dbURI,
  collectionName: 'sessions'
})

/**
 * Creates a connection to the database
 * @returns {Error} if an internal error happens
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI)
  } catch (error) {
    return error
  }
}

// Creates a schema for a Snippet
const snippetSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  language: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: () => Date.now() },
  tags: [String]
})

// Creates a schema for a User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }

})

export const Snippet = mongoose.model('Snippet', snippetSchema)
export const User = mongoose.model('User', userSchema)
