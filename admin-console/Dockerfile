# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:8-alpine

WORKDIR /workspace

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./
COPY storage/package.json storage/tsconfig.json ./storage/
COPY storage/src ./storage/src/
COPY sdk/package.json sdk/tsconfig.json ./sdk/
COPY sdk/src ./sdk/src/
COPY admin-console/package.json admin-console/tsconfig.json ./admin-console/
COPY admin-console/public ./admin-console/public/
COPY admin-console/src ./admin-console/src/
COPY admin-console/typings ./admin-console/typings/
COPY admin-console/webpack ./admin-console/webpack/

# Install dependencies. Don't use --frozen-lockfile since some subprojets were
# excluded, causing changes to yarn.lock on install
RUN yarn install && \
    # Compile code
    yarn compile

FROM staticdeploy/app-server
WORKDIR /website-root
COPY --from=0 /workspace/admin-console/build /website-root
ENV APP_SERVER_ROOT /website-root
