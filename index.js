const http = require('http');
require('dotenv').config();
const logger = require('./logger');


// Get port from environment variable or use default
const PORT = process.env.PORT || 8080;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy' }));
    logger.info('Health check request received');
    return;
  }
  res.writeHead(404);
  res.end();
});

// Start the WebSocket client
require('./ws');

// Start the HTTP server
server.listen(PORT, () => {
  logger.info(`HTTP server listening on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  logger.error(`HTTP server error: ${error}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  
  // Close HTTP server
  server.close(() => {
    logger.info('HTTP server closed.');
  });
  
  // Give time for cleanup before exiting
  setTimeout(() => {
    logger.info('Graceful shutdown completed.');
    process.exit(0);
  }, 1000);
});