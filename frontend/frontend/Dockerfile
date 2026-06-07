# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Compilar la aplicación estática
RUN npm run build

# Etapa 2: Servidor de producción (Nginx)
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto HTTP estándar
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
