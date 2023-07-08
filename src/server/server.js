import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://studyinbarcelona.net', 'http://127.0.0.1'];
    const requestOrigin = origin;

    // Check if the request origin is allowed
    if (requestOrigin === null || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Define the MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  // Add more file extensions and corresponding MIME types as needed
};

// Serve the index.html file
app.get('/', (req, res) => {
  //res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use('/css', express.static(path.resolve(__dirname, '../public/css')));

// Serve static assets with appropriate headers
//app.use(express.static(path.resolve(__dirname, '../dist'), {
app.use(express.static(path.resolve(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    const fileExtension = path.extname(filePath);
    const mimeType = mimeTypes[fileExtension];
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
  },
}));

// Serve the bundled JavaScript file
app.use('/js', express.static(path.resolve(__dirname, '../public/js')));

// Handle the sendEmail route
app.post('/sendEmail', async function (req, res) {
  try {
    await sendEmail(req.body);
    console.log("this is the server.js ", req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("EEEEEEE " + error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
