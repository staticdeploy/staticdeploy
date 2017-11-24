FROM node

# Copy app files
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY src ./src

# Install dependencies
RUN yarn install && \
    # Compile code
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm yarn.lock tsconfig.json

# Configure listening port and other environment variables
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# Set start command
CMD [ "yarn", "start" ]
