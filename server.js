import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import employeeRoutes from './employeeRoutes.js'; 
import errorMiddleware from './errorMiddleware.js';

dotenv.config(); // Load environment variables (if any)

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); 
// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Mount employee routes 
app.use('/employees', employeeRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
