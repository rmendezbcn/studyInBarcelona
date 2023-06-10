import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';
import bodyParser from 'body-parser';
import mime from 'mime';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const port = 3000;

// Enable CORS
const corsOptions = {
  origin: 'http://127.0.0.1:5173',
  preflightContinue: true,
  methods: 'post',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the MIME types for different file extensions
const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  // Add more file extensions and corresponding MIME types as needed
};

// Serve the bundled JavaScript file
app.use(express.static(path.resolve(__dirname, 'dist')));

// Serve the static assets (CSS, images, JS)
app.use(express.static(path.resolve(__dirname, './dist')));

app.use((req, res, next) => {
  const filePath = path.join(__dirname, './dist', req.path);
  const mimeType = mimeTypes[path.extname(filePath)];
  if (mimeType) {
    res.setHeader('Content-Type', mimeType);
  }
  next();
});


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
