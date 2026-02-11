# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables (Railway will override these)
ENV PORT=5000
ENV NODE_ENV=production

# Command to start the application
CMD ["npm", "start"]
