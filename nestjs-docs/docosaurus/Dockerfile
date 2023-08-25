# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Docosaurus project
RUN npm run build

# Expose the port your Docosaurus site will run on
EXPOSE 4040

# Define the command to run your Docosaurus site
CMD ["npm", "start"]
