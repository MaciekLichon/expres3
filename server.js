const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const helmet = require('helmet');

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const mongoose = require('mongoose');

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') {
  dbUri = 'mongodb+srv://MaciekL:maciek@cluster0.1847h.mongodb.net/NewWaveDB?retryWrites=true&w=majority';
} else if (NODE_ENV === 'test') {
  dbUri = 'mongodb://localhost:27017/NewWaveDBtest';
} else {
  dbUri = 'mongodb://localhost:27017/NewWaveDB';
}

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));


const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('new user' + socket.id);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

module.exports = server;
