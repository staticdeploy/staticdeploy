# Note: this Dockerfile is executed with the root of the staticdeploy monorepo
# as context
FROM node:alpine

WORKDIR /workspace

# Copy files
COPY package.json lerna.json yarn.lock tsconfig.json ./
COPY storage/package.json storage/tsconfig.json ./storage/
COPY storage/src ./storage/src/
COPY sdk/package.json sdk/tsconfig.json ./sdk/
COPY sdk/src ./sdk/src/
COPY app/package.json app/tsconfig.json ./app/
COPY app/public ./app/public/
COPY app/src ./app/src/
COPY app/typings ./app/typings/
COPY app/webpack ./app/webpack/

# Install dependencies
RUN yarn install && \
    # Compile code
    yarn compile

FROM staticdeploy/app-server
WORKDIR /website-root
COPY --from=0 /workspace/app/build /website-root
ENV APP_SERVER_ROOT /website-root
