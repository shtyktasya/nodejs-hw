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

console.log('✅ Server.js is loading...');

// Динамічний імпорт з детальним логуванням
import('./routes/notesRoutes.js')
  .then((module) => {
    const notesRoutes = module.default;
    app.use('/notes', notesRoutes);
    console.log('✅ Notes routes loaded successfully');
  })
  .catch((error) => {
    console.error('❌ CRITICAL ERROR loading notesRoutes:', error.message);
    console.error(error.stack);
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
