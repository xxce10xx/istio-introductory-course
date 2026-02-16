# =========================
# Build stage
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos solo lo necesario para instalar deps
COPY package*.json ./

# Instala dependencias (incluye devDependencies para build)
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compila TypeScript → dist/
RUN npm run build


# =========================
# Runtime stage
# =========================
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario para runtime
COPY package*.json ./
RUN npm ci --only=production

# Copiamos build compilado
COPY --from=builder /app/dist ./dist

# Si usas Prisma / migrations / etc, aquí irían

# Puerto del microservicio
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/index.js"]