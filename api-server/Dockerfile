# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:8-alpine

WORKDIR /workspace

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./
COPY common-types/package.json common-types/tsconfig.json ./common-types/
COPY common-types/src ./common-types/src/
COPY storage/package.json storage/tsconfig.json ./storage/
COPY storage/src ./storage/src/
COPY api-server/package.json api-server/tsconfig.json ./api-server/
COPY api-server/src ./api-server/src/

# Install dependencies. Don't use --frozen-lockfile since some subprojets were
# excluded, causing changes to yarn.lock on install
RUN yarn install && \
    # Compile code
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm yarn.lock tsconfig.json && \
    rm -r common-types/tsconfig.json common-types/src && \
    rm -r storage/tsconfig.json storage/src && \
    rm -r api-server/tsconfig.json api-server/src && \
    # Install curl for performing healthchecks
    apk add --no-cache curl

# Configure listening port
ENV PORT 80
EXPOSE 80

# Configure healthcheck
HEALTHCHECK CMD curl -f http://localhost/health || exit 1

# Set start command
WORKDIR /workspace/api-server
CMD [ "yarn", "start" ]
