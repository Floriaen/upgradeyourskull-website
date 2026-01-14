FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 9000

CMD ["npx", "gatsby", "serve", "-H", "0.0.0.0", "-p", "9000"]
