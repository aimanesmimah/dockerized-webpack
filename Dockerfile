FROM node:10.6.0-alpine AS builder

WORKDIR /front/app

COPY package.json tsconfig.json ./
RUN yarn install

COPY assets dist ./
COPY index.ts index.html server.ts webpack.config.js ./ 


FROM node:10.6.0-alpine

WORKDIR /app 
COPY --from=builder /front/app/ /app/

ENV PORT=8080 ENV=development

EXPOSE $PORT 

ENTRYPOINT  [ "yarn","start" ]