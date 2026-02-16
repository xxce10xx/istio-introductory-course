# ConfigMaps
En esta sección se lanza un configMap sencillo que permite setear las siguientes variables para los microservicios:

- OTEL_EXPORTER_OTLP_ENDPOINT: "none" (`ubicación de jaeger-collector`)
- PATIENTS_SERVICE_URL: "http://ms-patients:8080" (`ubicación del microservicios patients, al estar en el mismo namespace podemos invocarlo sin usar el FQDN`)
- DOCTOR_SERVICE_URL: "http://ms-doctors:8080" (`ubicación del microservicios doctors, al estar en el mismo namespace podemos invocarlo sin usar el FQDN`)
- LOGGER_LEVEL: "info" (`nivel de logger requerido: info | warning | error`)

### Observación 
La variable `OTEL_EXPORTER_OTLP_ENDPOINT` puede setearse con `http://jaeger-collector.istio-system.svc.cluster.local:4317` o con `none` dependiendo de lo que se busque:

#### Opcion 1
El microservicio de negocio envía trazas a `jaeger-collector`, para ello en el código necesitamos establecer:
```javascript
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://jaeger:4317',
  })
```
y setear la variable de entorno con `http://jaeger-collector.istio-system.svc.cluster.local:4317`

#### Opcion 2
Envoy de Istio recoge las trazas y las envía a `jaeger-collector`, esta opción es un poco más profesional pero requiere 2 pasos:
1. Desactivar el `OTEL_EXPORTER_OTLP_ENDPOINT`, por esta razón le pusimos como valor `none`
2. Ejecutar el archivo `telemetry-tracing.yaml`. Visitar [telemetry](../telemetry/readme.md)
