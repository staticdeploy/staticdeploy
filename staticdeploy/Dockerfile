# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:14-alpine

WORKDIR /opt/staticdeploy

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./

COPY management-console/package.json management-console/tsconfig.json ./management-console/
COPY management-console/public ./management-console/public/
COPY management-console/src ./management-console/src/
COPY core/package.json core/tsconfig.json core/tsconfig.browser.json ./core/
COPY core/src ./core/src/
COPY http-adapters/package.json http-adapters/tsconfig.json ./http-adapters/
COPY http-adapters/src ./http-adapters/src/
COPY jwt-authentication-strategy/package.json jwt-authentication-strategy/tsconfig.json ./jwt-authentication-strategy/
COPY jwt-authentication-strategy/src ./jwt-authentication-strategy/src/
COPY memory-storages/package.json memory-storages/tsconfig.json ./memory-storages/
COPY memory-storages/src ./memory-storages/src/
COPY oidc-authentication-strategy/package.json oidc-authentication-strategy/tsconfig.json ./oidc-authentication-strategy/
COPY oidc-authentication-strategy/src ./oidc-authentication-strategy/src/
COPY pg-s3-storages/package.json pg-s3-storages/tsconfig.json ./pg-s3-storages/
COPY pg-s3-storages/src ./pg-s3-storages/src/
COPY sdk/package.json sdk/tsconfig.json sdk/tsconfig.browser.json ./sdk/
COPY sdk/src ./sdk/src/
COPY serve-static/package.json serve-static/tsconfig.json ./serve-static/
COPY serve-static/src ./serve-static/src/
COPY storages-test-suite/package.json storages-test-suite/tsconfig.json ./storages-test-suite/
COPY storages-test-suite/src ./storages-test-suite/src/
COPY tar-archiver/package.json tar-archiver/tsconfig.json ./tar-archiver/
COPY tar-archiver/src ./tar-archiver/src/
COPY staticdeploy/package.json staticdeploy/tsconfig.json ./staticdeploy/
COPY staticdeploy/typings ./staticdeploy/typings/
COPY staticdeploy/src ./staticdeploy/src/

# Install dependencies. Don't use --frozen-lockfile since some subprojets were
# excluded, causing changes to yarn.lock on install
RUN yarn install && \
    # Compile code
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm yarn.lock tsconfig.json && \
    rm -r management-console/tsconfig.json management-console/public management-console/src && \
    rm -r core/tsconfig.json core/tsconfig.browser.json core/src && \
    rm -r http-adapters/tsconfig.json http-adapters/src && \
    rm -r jwt-authentication-strategy/tsconfig.json jwt-authentication-strategy/src && \
    rm -r memory-storages/tsconfig.json memory-storages/src && \
    rm -r oidc-authentication-strategy/tsconfig.json oidc-authentication-strategy/src && \
    rm -r pg-s3-storages/tsconfig.json pg-s3-storages/src && \
    rm -r sdk/tsconfig.json sdk/tsconfig.browser.json sdk/src && \
    rm -r serve-static/tsconfig.json serve-static/src && \
    rm -r storages-test-suite && \
    rm -r tar-archiver/tsconfig.json tar-archiver/src && \
    rm -r staticdeploy/tsconfig.json staticdeploy/src staticdeploy/typings && \
    # Install curl for performing healthchecks
    apk add --no-cache curl

# Configure listening port
ENV PORT 80
EXPOSE 80

# Configure healthcheck
HEALTHCHECK CMD curl -f -H "Host: $MANAGEMENT_HOSTNAME" http://localhost:$PORT/api/health || exit 1

# Set start command
WORKDIR /opt/staticdeploy/staticdeploy
CMD [ "yarn", "start" ]
