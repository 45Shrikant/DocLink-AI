# Use a lighter version of Node
FROM node:18-alpine

WORKDIR /app

# Copy package.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your server.js uses (5015 based on your code)
EXPOSE 5015

# Start command
CMD ["npm", "start"]