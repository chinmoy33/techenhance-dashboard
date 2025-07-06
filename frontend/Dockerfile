# === Builder ===
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# === Production ===
FROM nginx:alpine

# ⬇️ Fix this line: use dist instead of build
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
