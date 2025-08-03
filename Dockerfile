# Dockerfile para frontend React (cardiology-reports)
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Servir con un servidor web liviano
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
