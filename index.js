const WebSocket = require('ws');
require('dotenv').config();
const logger = require('./logger');

// WebSocket connection details
const WS_URL = process.env.WS_URL;
const TOKEN = process.env.TOKEN;

// Initialize WebSocket
const ws = new WebSocket(WS_URL);
let counter = 0;
let keepAliveInstance;
let keepAliveTimeout = 30000;
const symbol = 'AAPL250420P00150000';

const startKeepAlive = () => {
  const keepAliveMessage = {
    type: 'KEEPALIVE',
    channel: 0
  };

  keepAliveInstance = setInterval(() => {
    ws.send(JSON.stringify(keepAliveMessage));
    logger.info('Keepalive message sent.');
  }, keepAliveTimeout);
};

ws.on('open', () => {
  logger.info('WebSocket connection opened.');

  // Send SETUP message
  const setupMessage = {
    type: 'SETUP',
    channel: 0,
    keepaliveInterval: 86400,
    acceptKeepaliveTimeout: 86400,
    version: "0.1-js/1.0.0"
  };
  ws.send(JSON.stringify(setupMessage));
  logger.info('SETUP message sent.');

  // Send AUTH message with token
  const authMessage = {
    type: 'AUTH',
    channel: 0,
    token: TOKEN
  };
  ws.send(JSON.stringify(authMessage));
  logger.info('AUTH message sent.');

  // Open a new channel for FEED service
  const openMessage = {
    type: 'CHANNEL_REQUEST',
    channel: 1,
    service: 'FEED',
    parameters: {
      contract: 'AUTO'
    }
  };
  ws.send(JSON.stringify(openMessage));
  logger.info('OPEN message sent for channel 1.');

  // Subscribe to Quote events
  const subQuoteMessage = {
    type: 'FEED_SUBSCRIPTION',
    channel: 1,
    add: [
      {
        type: 'Quote',
        symbol
      }
    ]
  };
  ws.send(JSON.stringify(subQuoteMessage));
  logger.info(`Quote Subscription message sent for ${symbol}`);

  // Subscribe to Greeks events
  const subGreeksMessage = {
    type: 'FEED_SUBSCRIPTION',
    channel: 1,
    add: [
      {
        type: 'Greeks',
        symbol
      }
    ]
  };
  ws.send(JSON.stringify(subGreeksMessage));
  logger.info(`Greeks Subscription message sent for ${symbol}`);

  // Subscribe to Summary events
  const subSummaryMessage = {
    type: 'FEED_SUBSCRIPTION',
    channel: 1,
    add: [
      {
        type: 'Summary',
        symbol
      }
    ]
  };
  ws.send(JSON.stringify(subSummaryMessage));
  logger.info(`Summary Subscription message sent for ${symbol}`);

  startKeepAlive();
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    logger.info(`${counter} Received message: ${JSON.stringify(message, null, 2)}`);
    counter++;
  } catch (error) {
    logger.error('Error parsing message:', error);
  }
});

ws.on('error', (error) => {
  logger.error(`${counter} WebSocket error:`, error);
  counter++;
});

ws.on('close', (code, reason) => {
  logger.info(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
  if (keepAliveInstance) {
    clearInterval(keepAliveInstance);
  }
});

/**
 * Generates a dxFeed-formatted option symbol
 * @param {string} underlying - e.g., "AAPL"
 * @param {string} expiration - in "YYYY-MM-DD" format
 * @param {string} type - "C" for call, "P" for put
 * @param {number} strike - numeric strike price (e.g., 200 or 175.5)
 * @returns {string} formatted symbol (e.g., AAPL250412C00200000)
 */
function generateDxFeedOptionSymbol(underlying, expiration, type, strike) {
  const date = new Date(expiration);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const strikeFormatted = String(Math.round(strike * 1000)).padStart(8, '0');
  const symbol = `${underlying.toUpperCase()}${yy}${mm}${dd}${type.toUpperCase()}${strikeFormatted}`;
  logger.info(`Generated symbol: ${symbol}`);
  return symbol;
}
