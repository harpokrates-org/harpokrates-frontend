FROM node:21-alpine3.18

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Argumentos recibidos en render.com
# nota: Para que se tomen como variables de entorno, deben ser agregado al string ENVVARS
# mas abajo
#
# Si estamos en render.com entonces
# RENDER=true
# NEXT_PUBLIC_BACKEND_URL='xxxxxx' es la url del backend
ARG RENDER
ARG NEXT_PUBLIC_BACKEND_URL

# Variables de entorno para npm run build
ENV NPM_BUILD_ENV=""

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Rust
# Se usa la version /edge porque utiliza rust 1.76 en vez de 1.71 (default en alpine 3.18)
RUN apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
    rust \
    cargo \
    wasm-pack

# Build wasm module
RUN npm run build:wasm

# Le tenemos que pasar las variables de entorno en el build para que las tome
# Caso contrario, se ven como "undefined"
ENV ENVVARS=""

# Paquetes para desarrollo con vscode
# Solo se instalan localmente, no en render
RUN if [[ -z "$RENDER" ]]; then \
    apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
        nano \
        git \
        rust-analyzer; \
  else \ 
    # Si estamos en render.com, seteamos la env variables en un string \
    # Settear aca todas las variablas de entorno
    ENVVARS="NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}"; \ 
  fi; 

# build
# Si estamos corriendo la app localmente, ENVVARS queda vacio y toma las 
# variables de entorno del archivo .env
# Si estamos en render.com deberia tener las variables de render
RUN ${ENVVARS} npm run build

CMD ["npm", "run", "start"] 
