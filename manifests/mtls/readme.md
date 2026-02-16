# mTLS
En esta sección se coloca el mTLS en modo `STRICT`
- En el archivo [mtls-strict.yaml](./mtls-strict.yaml), especificamos el modo estricto requerido en el namespace `ordendev`
```yaml
  namespace: ordendev
spec:
  mtls:
    mode: STRICT
```
- También se tienen archivos individuales (`ms-doctors-dr-mtls.yaml`, `ms-appointment-dr-mtls.yaml`, ``ms-patients-dr-mtls.yaml`) para especificar el modo estricto de forma segmentada:
```yaml
spec:
  host: ms-**
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```