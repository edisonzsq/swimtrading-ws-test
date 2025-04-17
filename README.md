# SwimTrading WebSocket Test

A WebSocket client for testing TastyTrade API integration.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your configuration (see `.env.example`)
4. Run the application: `node index.js`

## Docker Deployment

### Local Docker Build

```bash
# Build the Docker image
docker build -t swimtrading-ws-test .

# Run the container
docker run -e WS_URL=your_ws_url -e TOKEN=your_token -e TASTY_API_URL=your_api_url swimtrading-ws-test
```

### Deploying to DigitalOcean App Platform

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to your DigitalOcean account
3. Go to the App Platform section
4. Click "Create App"
5. Connect your Git repository
6. Select the repository and branch
7. Choose "Dockerfile" as the deployment method
8. Configure the following environment variables:
   - `WS_URL`: WebSocket URL (e.g., wss://tasty-openapi-ws.dxfeed.com/realtime)
   - `TOKEN`: Authentication token
   - `TASTY_API_URL`: TastyTrade API URL
   - `USERNAME`: TastyTrade username
   - `PASSWORD`: TastyTrade password
   - `LOG_TO_CONSOLE`: Set to "true" to enable console logging
9. Choose your plan and region
10. Click "Create Resources"

## Environment Variables

- `WS_URL`: WebSocket URL for TastyTrade API
- `TOKEN`: Authentication token for TastyTrade API
- `TASTY_API_URL`: Base URL for TastyTrade API
- `USERNAME`: TastyTrade username
- `PASSWORD`: TastyTrade password
- `LOG_TO_CONSOLE`: Set to "true" to enable console logging (default: false)

## Logging

Logs are stored in the `logs` directory with daily rotation. Each log file is limited to 10MB and logs are kept for 14 days. 