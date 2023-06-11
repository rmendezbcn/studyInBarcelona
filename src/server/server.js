import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';
import bodyParser from 'body-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const port = 3000;

// Enable CORS
const corsOptions = (req, callback) => {
    // Replace this logic with your own to determine the allowed origin
    const allowedOrigins = ['https://studyinbarcelona.onrender.com', 'localHost'];
    const origin = req.get('Origin');
    console.log(origin)

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};
const corsMiddleware = cors({
  preflightContinue: true,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
  allowedHeaders: 'Content-Type',
  exposedHeaders: 'Content-Type',
});

app.use(corsMiddleware(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  // Add more file extensions and corresponding MIME types as needed
};

// Serve the bundled JavaScript file
app.use(express.static(path.resolve(__dirname, '../../dist')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

// Serve static assets with appropriate headers
app.use(express.static(path.resolve(__dirname, '../../dist'), {
  setHeaders: (res, filePath) => {
    const fileExtension = path.extname(filePath);
    const mimeType = mimeTypes[fileExtension];
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
  },
}));

// Handle the sendEmail route
app.post('/sendEmail', function (req, res) {
  sendEmail(req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (error) {
      console.error("EEEEEEE " + error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
