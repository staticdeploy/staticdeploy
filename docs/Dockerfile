FROM node

# Copy app files
RUN mkdir -p /usr/src/app
COPY . /usr/src/app

# Install dependencies and compile code
WORKDIR /usr/src/app
# Install dependencies
RUN yarn install && \
    # Compile docs
    yarn compile

# Configure the listening port
ENV PORT 80
EXPOSE 80

# Set start command
CMD [ "yarn", "start" ]
