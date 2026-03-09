# Code Snippet Manager

A web application for creating, sharing, and managing code snippets.  
Users can register accounts, create snippets, search for code by tags or title, and manage their own snippets.

The application is built using **Node.js, Express, MongoDB, and EJS**, following an MVC-style architecture.

---

## Features

- User registration and authentication
- Password hashing with **bcrypt**
- Session-based authentication
- Create, read, update, and delete code snippets
- Search snippets by **tag** or **title**
- User profile pages showing personal snippets
- Flash messages for feedback
- Rate limiting on login to mitigate brute-force attacks
- Snippet tags for better organization

---

## Technologies Used

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication & Security**
- bcrypt (password hashing)
- express-session
- connect-mongo (session storage)
- express-rate-limit

**Frontend**
- EJS
- Custom Web Components
- CSS

---

## Project Structure
project-root<br>
│<br>
├── src<br>
│ ├── controllers<br>
│ │ ├── snippetController.js<br>
│ │ └── userController.js<br>
│ │<br>
│ ├── models<br>
│ │ └── mongodb.js<br>
│ │<br>
│ ├── routes<br>
│ │ ├── login.js<br>
│ │ ├── logout.js<br>
│ │ ├── snippets.js<br>
│ │ └── user.js<br>
│<br>
├── public<br>
├── views<br>
│ ├── snippets<br>
│ └── user<br>
│<br>
├── app.js<br>
├── package.json<br>
└── README.md

---

## Installation

### 1. Clone the repository
`git clone https://github.com/yourusername/code-snippet-manager.git`
`cd code-snippet-manager`

### 2. Install dependencies
`npm install`

---

## Environment Variables

Create a `.env` file in the root directory.

Example:
DB_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

---

## Running the Application
Start the server:
node app.js

The application will run on:
http://localhost:5500

---

## Usage

1. Register a new user account
2. Log in to your account
3. Create and manage code snippets
4. Add tags to organize snippets
5. Search snippets by tag or title
6. View snippets created by other users

Users can edit or delete **only their own snippets**.

---

## Security Features

- Passwords are hashed using **bcrypt**
- Sessions are stored in **MongoDB**
- Login attempts are limited with **express-rate-limit**
- Input validation for usernames and emails

---

## Future Improvements

Possible improvements for the project:

- Syntax highlighting for code snippets
- Pagination for large snippet lists
- Markdown support
- Public/private snippets
- REST API support
- Docker containerization

---

## Author

Mohammed Alaa  
