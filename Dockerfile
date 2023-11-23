FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN find -mindepth 1 -not \( -path './dist' -prune -o -path './node_modules' -prune \) -exec rm -rf {} +
EXPOSE 6868
ENTRYPOINT ["node", "dist/main"]