FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production
ENV LOG_TO_CONSOLE=true

# Expose port (if needed)
# EXPOSE 3000

# Start the application
CMD ["node", "index.js"] 