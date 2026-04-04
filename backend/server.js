const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const policyRoutes = require('./routes/policyRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Use Socket.io to push real-time events to the frontend
const io = new Server(server, {
  cors: {
    origin: '*', // For demo purposes, we allow all origins
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Pass io to routes via req so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Real-time Socket Connection (just logging for demo)
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic Setup Check
app.get('/', (req, res) => res.send('GigShield-AI Phase 2 Backend is running.'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || 'mongodb+srv://suyashsahu0405:shubh%402005@cluster.ig2sa.mongodb.net/gigshield_db';

mongoose.connect(DB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
