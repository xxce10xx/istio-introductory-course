# Telemetry
Este archivo es muy sencillo, únicamente nos sirve para especificar el **provider** y el **porcentaje de sampleo** de `jaeger-collector`
```yaml
apiVersion: telemetry.istio.io/v1
kind: Telemetry
metadata:
  name: tracing
  namespace: ordendev
spec:
  tracing:
  - providers:
    - name: jaeger # le pedimos que use el provider jager, debe estar establecido en el configMap de istiod
    randomSamplingPercentage: 100 # porcentaje de sampling
```
### Observación
Notar que para que esto funcione correctamente necesitamos ejecutar 2 verificaciones
1. Desactivar la variable `OTEL_EXPORTER_OTLP_ENDPOINT` del _configMap_ correspondiente, colocar el valor `none`. Ver [otel-configmap.yaml](../configMaps/readme.md)
2. Verificar que el _configMap_ de **istiod** tenga configurado el provider **jaeger**, si no lo tuviera, podemos editarlo y agregar:
```yaml
mesh: |-
  enableTracing: true
  defaultConfig:
    discoveryAddress: istiod.istio-system.svc:15012
  defaultProviders:
    tracing:
    - jaeger
    metrics:
    - prometheus
  extensionProviders:
  - name: jaeger
    opentelemetry:
      service: jaeger-collector.istio-system.svc.cluster.local
      port: 4317
  enablePrometheusMerge: true
  rootNamespace: istio-system
  trustDomain: cluster.local
```
3. Una vez agregado el provider debemos reinciar **istiod** y también los microservicios del namespace **ordendev**
- `kubectl rollout restart deploy/<deployment-name>`