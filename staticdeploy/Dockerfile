# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:12-alpine

WORKDIR /opt/staticdeploy

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./

COPY admin-console/package.json admin-console/tsconfig.json ./admin-console/
COPY admin-console/webpack ./admin-console/webpack/
COPY admin-console/typings ./admin-console/typings/
COPY admin-console/public ./admin-console/public/
COPY admin-console/src ./admin-console/src/
COPY core/package.json core/tsconfig.json ./core/
COPY core/src ./core/src/
COPY http-adapters/package.json http-adapters/tsconfig.json ./http-adapters/
COPY http-adapters/src ./http-adapters/src/
COPY memory-storages/package.json memory-storages/tsconfig.json ./memory-storages/
COPY memory-storages/src ./memory-storages/src/
COPY pg-s3-storages/package.json pg-s3-storages/tsconfig.json ./pg-s3-storages/
COPY pg-s3-storages/src ./pg-s3-storages/src/
COPY sdk/package.json sdk/tsconfig.json ./sdk/
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
    rm -r admin-console/tsconfig.json admin-console/webpack admin-console/typings admin-console/public admin-console/src && \
    rm -r core/tsconfig.json core/src && \
    rm -r http-adapters/tsconfig.json http-adapters/src && \
    rm -r memory-storages/tsconfig.json memory-storages/src && \
    rm -r pg-s3-storages/tsconfig.json pg-s3-storages/src && \
    rm -r sdk/tsconfig.json sdk/src && \
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
HEALTHCHECK CMD curl -f http://$ADMIN_HOSTNAME:$PORT/api/health || exit 1

# Set start command
WORKDIR /opt/staticdeploy/staticdeploy
CMD [ "yarn", "start" ]
