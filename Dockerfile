# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY phye4ooc0g8yyzi
ENV PM2_SECRET_KEY xeiw123b2exafww


# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 5050

CMD ["pm2-runtime", "index.js"]