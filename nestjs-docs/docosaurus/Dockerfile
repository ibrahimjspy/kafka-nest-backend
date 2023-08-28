# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files separately
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Docusaurus project
RUN npm run build

# Expose the port your Docusaurus site will run on
EXPOSE 3000

# Define the command to run your Docusaurus site
CMD ["npm", "run", "serve"]

