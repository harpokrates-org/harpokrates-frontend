FROM rust:1.77.1-alpine3.19 AS WASMBUILDER
WORKDIR /usr/src/app/wasm-lib
RUN apk add --no-cache wasm-pack
ADD wasm-lib ./
RUN wasm-pack build --target web --out-dir pkg

FROM node:21.7.1-alpine3.19 AS NEXTBUILDER
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=WASMBUILDER /usr/src/app/wasm-lib/pkg /usr/src/app/wasm-lib/pkg
RUN npm ci --verbose
COPY . . 
RUN npm run build

FROM node:21.7.1-alpine3.19 AS RUNNER
WORKDIR /usr/src/app
COPY --from=NEXTBUILDER /usr/src/app/.next/standalone ./
COPY --from=NEXTBUILDER /usr/src/app/.next/static ./.next/static
COPY --from=NEXTBUILDER /usr/src/app/public ./public
CMD node server.js