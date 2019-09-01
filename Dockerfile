FROM node:12
# Create app folder to containing the project
WORKDIR /app
# Copy package.json and package-lock.json in app dir
COPY package*.json ./
# Run the npm install command to fetch the dependencies
RUN npm install
# Copy everything to the working directory (app)
COPY . .
# Execute the application
CMD ["npm","start"]