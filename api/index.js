const express = require('express')
const { createServer } = require("node:http")
const { Server } = require('socket.io')
const cors = require("cors")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const {saveMessage} = require('./sockets/messages.utils')
//routers
const { authRouter } = require('./routers/auth.router')
const { userRouter } = require('./routers/user.router')
const { inviteRouter } = require('./routers/invite.router')
const { chatRouter } = require('./routers/chat.route')
const { messageRouter } = require('./routers/message.router')
const { uploadRouter } = require('./routers/upload.router')
const { friendsRouter } = require('./routers/friends.router')
const { getUserFriends } = require('./sockets/getFriendsList')

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


const __location = path.resolve();
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) return next(new Error('Unauthorized'));
      const friends = await getUserFriends(user.id)

      socket.user = {
        id: user.id,
        username: user.username,
        friends
      }
      next();
    });
  });
  
const chatRooms = []

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
      socket.on('chat room', ({ chatRoom }) => {
        socket.join(chatRoom);
        console.log(`User ${socket.id} joined room: ${chatRoom}`);
    });

    socket.on('chat message', async (data) => {
        const { chatRoom, content } = data;
        console.log(`Message received in ${chatRoom}:`, content);
        await saveMessage(chatRoom, content);
        socket.to(chatRoom).emit('chat message', content);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

app.use( (req, res, next) => {
  const currentTime = new Date().toISOString();

  console.log(`[${currentTime}] ${req.method} request to ${req.originalUrl}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);

  next();
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/invites', inviteRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)
app.use('/api/uploads', uploadRouter)
app.use('/api/friends', friendsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__location,'client','dist','index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

server.listen(3000,() => {
    console.log("listening to this server")
})




