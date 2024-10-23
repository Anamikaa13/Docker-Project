# Use an official Node.js runtime as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory inside the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy all other project files (like index.js) to the container
COPY . .

# Expose the port that your app listens on
EXPOSE 8080

# Run the application inside the container
CMD ["node", "index.js"]
