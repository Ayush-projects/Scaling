# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (Optional, you might omit this in dev if using volumes)
COPY . .

# Expose the port your application will run on
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "dev"]  # Assuming you have a "dev" script in package.json