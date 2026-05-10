// 1. Load environment variables from a .env file into process.env.
//    This lets us use sensitive configuration (like DB passwords) without hardcoding them.
//    If we don't use this, environment variables from .env won't be accessible.
require('dotenv').config();

// 2. Automatically handles async errors inside Express routes and middleware, forwarding them to error handlers.
//    Without this, you need to use try/catch everywhere; unhandled async errors will crash the server.
require('express-async-errors');

// 3. Import express framework, the backbone of our server and routes.
//    If not used, we can't set up our REST API server.
const express = require('express');

// 4. Import CORS middleware to allow cross-origin requests (frontend communicating with backend).
//    Without this, frontend apps at different origins can't access the server (browser blocks them).
const cors = require('cors');

// 5. Import helmet, which sets various HTTP headers for security (prevents some common attacks).
//    Not using this leaves API exposed to some attacks like clickjacking, MIME sniffing, etc.
const helmet = require('helmet');

// 6. Import morgan, HTTP logging middleware for development/debugging.
//    Not using this means loss of request/response logs in terminal.
const morgan = require('morgan');

// 7. Import path utility for working with file and directory paths.
//    Not using this can cause issues with OS-specific path handling.
const path = require('path');

// 8. Import file/function that connects to MongoDB database.
//    If not used, our backend can't store or retrieve data.
const connectDB = require('./config/db');

// 9. Import authentication API routes (register, login, get profile).
//    Without this, the server won't handle auth requests.
const authRoutes = require('./routes/authRoutes');

// 10. Import the error-handling middleware for standardizing error responses.
//     Without this, Express won't catch and format errors, leading to ugly or unhandled server errors.
const errorHandler = require('./middleware/errorHandler');
const chatRoutes = require('./routes/chatRoutes');
// 11. Create the main Express application object.
//     If not used, no app instance to attach routes and middleware.
const app = express();

// 12. Run DB connection code to connect to MongoDB.
//     If not called, the server can't access DB, causing all DB operations to fail.
connectDB();

// 13. Add helmet middleware to set secure headers.
//     Skipping this would decrease security (see #5 above).
app.use(helmet());

// 14. Enable CORS for specified origins, permit credentials (cookies/headers).
//     Without this config, frontend from different ports can't authenticate or use protected APIs.
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// 15. Add request logging middleware only during development.
//     If omitted, you'd lose request logs, making debugging harder in development.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 16. Parse incoming JSON requests, with body size limit to prevent large payload attacks.
//     Without this, JSON request bodies aren't parsed and can crash or overwhelm the backend.
app.use(express.json({ limit: '10mb' }));

// 17. Parse URL-encoded (form) data, with body size limit.
//     Without this, form submissions (like via <form>) are not readable.
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 18. Serve static files in the /uploads directory at the /uploads route.
//     If not used, files (e.g., profile photos) that are uploaded can't be publicly accessed by browser/clients.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 19. Health check endpoint to verify that API is running.
//     If omitted, you can't easily test if the server is up via a browser/curl.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Doubt Solver API is running' });
});

// 20. Route all /api/auth requests to authentication routes (register/login/me).
//     Without this, authentication endpoints are inaccessible.
app.use('/api/auth', authRoutes);

// 21. Attach centralized error handler at the end—catches all thrown errors and formats them for the client.
//     If omitted, errors would cause unhandled server crashes or generic error responses.
app.use(errorHandler);
app.use('/api/chats', chatRoutes);

// 22. Set up server port from env variable or default to 5000.
const PORT = process.env.PORT || 5000;


// 23. Start server listening on given port, log to console that the server started.
//     Without this, server never accepts requests.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));