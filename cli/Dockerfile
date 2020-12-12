# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:14-alpine

WORKDIR /opt/staticdeploy

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./
COPY core/package.json core/tsconfig.json core/tsconfig.browser.json ./core/
COPY core/src ./core/src/
COPY sdk/package.json sdk/tsconfig.json sdk/tsconfig.browser.json ./sdk/
COPY sdk/src ./sdk/src/
COPY tar-archiver/package.json tar-archiver/tsconfig.json ./tar-archiver/
COPY tar-archiver/src ./tar-archiver/src/
COPY cli/package.json cli/tsconfig.json ./cli/
COPY cli/bin ./cli/bin/
COPY cli/src ./cli/src/

# Install dependencies. Don't use --frozen-lockfile since some subprojets were
# excluded, causing changes to yarn.lock on install
RUN yarn install && \
    # Compile code
    yarn compile && \
    # Remove dev dependencies
    yarn install --production && \
    # Remove unecessary files
    rm yarn.lock tsconfig.json && \
    rm -r core/tsconfig.json core/tsconfig.browser.json core/src && \
    rm -r sdk/tsconfig.json sdk/tsconfig.browser.json sdk/src && \
    rm -r tar-archiver/tsconfig.json tar-archiver/src && \
    rm -r cli/tsconfig.json cli/src && \
    # Install staticdeploy executable
    ln -s /opt/staticdeploy/cli/bin/staticdeploy.js /usr/local/bin/staticdeploy

# Reset workdir
WORKDIR /
