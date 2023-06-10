import express from 'express';
import cors from 'cors';
import { sendEmail } from '../nodemailer.js';
import path from 'path';
import bodyParser from 'body-parser';

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
app.use(express.static(path.resolve(__dirname, '../../public'), {
  setHeaders: (res, filePath) => {
    console.log('file path: '+ filePath)
    if (filePath === path.resolve(__dirname, '../../public/src/client/index.js')) {
      console.log('setting the header')
      res.setHeader('Content-Type', mime.getType(filePath));
    }
  },
}));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
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
