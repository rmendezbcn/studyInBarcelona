import express from 'express';
import cors from 'cors';
import { sendEmail } from '../src/nodemailer.js';
import path from 'path';


import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;

const app = express();
const port = 3000; // Change this to your desired port number

console.log('I have reached the server');

// Enable CORS
let corsOptions = {
  origin: 'http://127.0.0.1:5173',
  preflightContinue: true,
  methods: 'post',
  optionsSuccessStatus: 200,
}

//app.options('/sendEmail', cors())
app.use(
  cors({ corsOptions })
);

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));
// Parse application/json
app.use(json());

// Serve static files from the "dist" directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, '../dist')));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle the sendEmail route
app.post('/sendEmail', function (req, res) {
  // Call your email sending function here
  sendEmail(req.body)
    .then(function () {
      res.sendStatus(200); // Send a success response
    })
    .catch(function (error) {
      console.error("EEEEEEE " + error);
      res.sendStatus(500); // Send an error response
    });
});