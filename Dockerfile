FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm ci \
  && npm ci --prefix backend \
  && npm ci --prefix frontend

COPY . .

RUN npm run build --prefix frontend

ENV NODE_ENV=production
ENV PORT=3000

RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["npm", "start"]
