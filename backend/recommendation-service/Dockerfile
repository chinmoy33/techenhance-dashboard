FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install early
COPY recommendation-service/package*.json ./
RUN npm install

# Copy source code
COPY shared ./shared
COPY recommendation-service/. .

EXPOSE 3002
CMD ["node", "server.js"]
