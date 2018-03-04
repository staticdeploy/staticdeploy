# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:alpine

WORKDIR /workspace

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./
COPY storage/package.json storage/tsconfig.json ./storage/
COPY storage/src ./storage/src/
COPY static-server/package.json static-server/tsconfig.json ./static-server/
COPY static-server/src ./static-server/src/

# Install dependencies
RUN yarn install && \
    # Compile code
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm yarn.lock tsconfig.json && \
    rm -r storage/tsconfig.json storage/src && \
    rm -r static-server/tsconfig.json static-server/src

# Configure listening port
ENV PORT 80
EXPOSE 80

# Set start command
WORKDIR /workspace/static-server
CMD [ "yarn", "start" ]
