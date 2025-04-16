const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Determine the log directory
const logDir = path.join(__dirname, 'logs');

// Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Create a rotating file transport
const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // zip logs
  maxSize: '10m',     // max size 10MB
  maxFiles: '14d',    // keep logs for 14 days
  level: 'info',      // Log level for the file
  format: logFormat
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  transports: [
    fileTransport
    // Console transport will be added conditionally below
  ]
});

// Add console logging if environment variable is set
// Example: export LOG_TO_CONSOLE=true
if (process.env.LOG_TO_CONSOLE === 'true') {
  logger.add(new winston.transports.Console({
    level: 'info', // Log level for the console
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  }));
  logger.info('Console logging enabled.');
} else {
    logger.info('Console logging is disabled. Set LOG_TO_CONSOLE=true to enable it.');
}


logger.info(`Logging initialized. Logs will be stored in: ${logDir}`);

module.exports = logger; 