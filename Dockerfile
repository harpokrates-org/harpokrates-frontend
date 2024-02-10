FROM node:16-alpine3.17

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Si estamos en render.com entonces
# RENDER=true
# RENDER_REACT_APP_FLICKR_API_KEY='xxxxxx' es la API de Flickr
ARG RENDER
ARG RENDER_REACT_APP_FLICKR_API_KEY

# Variables de entorno para npm run build
ENV NPM_BUILD_ENV=""

# If you are building your code for production
# RUN npm ci --only=production
RUN if [[ -z "$RENDER" ]]; then npm install; else npm ci --only=production; fi;

RUN npm install --global serve

# Rust
RUN apk add --no-cache rust cargo
RUN apk add wasm-pack

# Build wasm module
RUN npm run build:wasm

# build segun el ambiente
# render -> se agrega la api key en el comando npm build
# local -> los toma de .env
RUN if [[ ! -z "$RENDER" ]]; \
    then NPM_BUILD_ENV="${NPM_BUILD_ENV} REACT_APP_FLICKR_API_KEY=${RENDER_REACT_APP_FLICKR_API_KEY}"; \
  fi; \
  NPM_BUILD_COMMAND="${NPM_BUILD_ENV} npm run build"; \
  echo "${NPM_BUILD_COMMAND}"; \
  eval "${NPM_BUILD_COMMAND}";

# Paquetes para desarrollo con vscode
# Solo se instalan localmente, no en render
RUN if [[ -z "$RENDER" ]]; then \
  apk add nano; \
  apk add git; \
  apk add rust-analyzer; \
  fi; 

CMD ["serve",  "-s", "build"] 
