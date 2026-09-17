FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variable temporal para permitir la generación del cliente de Prisma en tiempo de build
ENV DATABASE_URL="postgresql://appuser:apppass@localhost:5432/appdb"
RUN npx prisma generate

EXPOSE 4000

CMD ["npx", "tsx", "src/index.ts"]