import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Підключаємо роути
import('./routes/notesRoutes.js')
  .then((module) => {
    app.use('/notes', module.default);
    console.log('✅ Notes routes loaded successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to load notesRoutes:', error.message);
  });

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
