# Microservicios
En esta sección tenemos el código fuente de nuestros microservicios. Se han desarrollado 3 microservicios `ms-patients`, `ms-doctors` y `ms-appointments`, todos estan hechos con **NodeJS** y utilizan las siguientes dependencias:
```json
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/auto-instrumentations-node": "^0.69.0",
    "@opentelemetry/exporter-jaeger": "^2.5.0",
    "@opentelemetry/sdk-node": "^0.211.0",
    "colors": "^1.4.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "pino": "^10.3.0",
    "pino-http": "^11.0.0",
    "prom-client": "^15.1.3",
    "sequelize": "^6.33.0",
    "sequelize-typescript": "^2.1.5"
  }
```
### Observación
- Cada microservicio contiene un archivo Dockerfile multistage para su respectiva dockerización
- No es necesario dockerizar ya que las imágenes ya se encuentran disponibles en el repositorio público **cedser**; sin embargo, si decide cambiar o actualizar el código deberá ejecutar `docker build -t <nombre_imagen> -f Dockerfile .`