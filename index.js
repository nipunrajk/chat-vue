const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
// init socket server
const http = require('http').createServer(app)

const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:5173'],
  },
})

// middleware sending data to the backend in json format
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app homepage
app.get('/', (req, res) => {
  res.send('THis is my home page ')
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const { v4: uuidv4 } = require('uuid')
// session post page
app.post('/session', (req, res) => {
  let data = {
    username: req.body.username,
    userID: uuidv4(),
  }
  res.send(data)
})

// socket.io middleware (for uuid)
io.use((socket, next) => {
  const username = socket.handshake.auth.username
  const userID = socket.handshake.auth.userID
  if (!username) {
    return next(new Error('invalid username'))
  }
  // create new session
  socket.username = username
  socket.userID = userID
  next()
})

// socket events
let users = []
io.on('connection', async (socket) => {
  // get all users
  let userData = {
    username: socket.username,
    userID: socket.id,
  }
  users.push(userData)

  io.emit('users', { users })

  socket.on('disconnect', () => {
    users = users.filter((user) => user.userID !== socket.id)
    io.emit('users', { users })
  })

  // get message from client`
  socket.on('message-to-server', (payload) => {
    io.to(payload.to).emit('message-to-user', payload)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
