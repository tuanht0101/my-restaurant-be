FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN find -mindepth 1 -not \( -path './dist' -prune -o -path './node_modules' -prune -o -path './.env' -o -path './prisma' -prune -o -path './views' -prune \) -exec rm -rf {} +
EXPOSE 6868
ENTRYPOINT sleep 5 && npx prisma db push && node dist/main