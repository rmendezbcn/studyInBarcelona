import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;

const app = express();
const port = 3000; // Change this to your desired port number

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

// Serve the static assets (CSS, images, JS)
app.use(express.static(path.resolve(__dirname, '../../public'), {
  setHeaders: (res, filePath) => {
    if (filePath === path.resolve(__dirname, '../../public/node_modules/bootstrap/dist/css/bootstrap.min.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filePath === path.resolve(__dirname, '../../public/src/client/index.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

app.use(express.static('public'));

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