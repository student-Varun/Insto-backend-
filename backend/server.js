
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const connectDb = require('./data/db');
const postRoutes = require("./routes/postRoutes");
const userRoutes = require('./routes/user.Routes');

const app = express();

// MongoDB Connection
connectDb();

// CORS Configuration
app.use(cors({
  origin: 'https://insto-frontend-gsbr.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);


app.use(morgan(':date[iso] :method :url :status :response-time ms', {
  stream: accessLogStream
}));


app.use(morgan('dev'));


app.use((req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${
    req.originalUrl
  } from ${req.ip}\n`;
  fs.appendFile(path.join(logDirectory, 'custom.log'), logEntry, (err) => {
    if (err) console.error("Error writing custom log:", err);
  });
  next();
});


app.use('/api', userRoutes);
app.use("/api/posts", postRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` Server is listening on port ${PORT}`);
});

