import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';
import bodyParser from 'body-parser';
//import mime from 'mime';

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

// Serve the static assets (CSS, images, JS)
app.use(express.static(path.resolve(__dirname, 'dist')));

// Define the MIME types for different file extensions
const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  // Add more file extensions and corresponding MIME types as needed
};

// Set headers based on file extension
app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path);
  const mimeType = mimeTypes[path.extname(filePath)];
  if (mimeType) {
    res.setHeader('Content-Type', mimeType);
  }
  next();
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

// Serve the bundled JavaScript file
app.get('/assets/main.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/assets/main.js'));
});

// Handle the sendEmail route
app.post('/sendEmail', (req, res) => {
  sendEmail(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("EEEEEEE " + error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
