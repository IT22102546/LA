import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

const app = express();


// const uploadsPath = path.resolve(__dirname, '../Frontend/uploads');

// Use the SAME upload path everywhere
const uploadsPath = path.resolve('D:/LearnUp-Web/LearnUp-AdminPannel/api/Frontend/uploads');


// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsPath}`);
}

// Middleware configuration
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Adjust based on your frontend URL
  credentials: true // This is important for cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the SAME uploads directory
app.use('/uploads', express.static(uploadsPath));

console.log(`Serving static files from: ${uploadsPath}`);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);


// Debug endpoint to check files
app.get('/verify-file/:filename', (req, res) => {
  const filePath = path.join(uploadsPath, req.params.filename);
  
  const exists = fs.existsSync(filePath);
  console.log(`Verifying: ${filePath}`);
  console.log(`Exists: ${exists}`);

  res.json({
    requested: req.params.filename,
    absolutePath: filePath,
    exists: exists,
    filesInDirectory: fs.readdirSync(uploadsPath)
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`Error: ${statusCode} - ${message}`);
    console.error(err.stack);
    
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsPath}`);
});