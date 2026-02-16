# CURL
Estos archivos son bastante sencillos, únicamente despliega PODs de prueba en el namespaces `ordendev`, tiene como objetivo hacer request hacia PODs del mismo namespace y probar conectividad, tenemos 3 tipos
1. [curl-test-pod](./curl-test-pod.yaml): Levanta un POD simple, sin sidecar, tiene la anotación `sidecar.istio.io/inject: "false"`, permite mostrar como los request sin mTLS son aceptados, pero con mTLS ya no funciona
2. [curl-mtls](./curl-test-pod.yaml): Levanta un POD con sidecar `sidecar.istio.io/inject: "true"`, lo cual nos permite tener verificar el mutual TLS ejecutando un request a otro microservicio del mismo namespace
3. [curl-test-pod](./curl-test-pod.yaml): Levanta un POD con sidecar `sidecar.istio.io/inject: "true"` y serviceAccount `serviceAccountName: sa-curl-mtls`, lo cual nos permite verificar RBAC
```yaml
  annotations:
    sidecar.istio.io/inject: "true"
spec:
  serviceAccountName: sa-curl-mtls
```

### Observación
Para probar y ejecutar el Paso 3, primero debemos configurar un ServiceAccount [service-account-mtls.yaml](../serviceAccount/readme.md) y colocar el mTLS en modo `STRICT` [mtls-strict.yaml](../mtls/readme.md)
