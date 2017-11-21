FROM node

# Copy app files
RUN mkdir -p /usr/src/app
COPY . /usr/src/app

# Install dependencies and compile code
WORKDIR /usr/src/app
RUN npm install
RUN npm run build

# Configure the listening port
ENV PORT 80
EXPOSE 80

# Set start command
CMD [ "npm", "start" ]
