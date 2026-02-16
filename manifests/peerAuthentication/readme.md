# PeerAuthentication
En esta sección se "suavizan" los requisitos de mTLS.
> Por ejemplo, el servicio de `grafana` lo tenemos desplegado en el namespace **istio-system**, el cual no tiene inyección de sidecar, por otro lado nuetro servicio de `prometheus` esta
> desplegado en el namespace **monitoring** el cual sí tiene activado la inyección de sidecar, entonces necesitamos hacer **scrape** desde un servicio sin certificado hacia otro que exige mTLS,
> para ello "suavizamos" la autenticación peer-to-peer. Ver [peer-grafana.yaml](./peer-grafana.yaml)
```yaml
metadata:
  name: grafana-permissive
  namespace: istio-system
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: grafana
  mtls:
    mode: PERMISSIVE
```
- [peer-kiali.yaml](./peer-kiali.yaml): Análogo para este archivo, el cual permite que `kiali` desplegado en el namespace **istio-system**, pueda obtener métricas de `prometheus` que esta desplegado en el namespace **monitoring** el cual sí tiene activado la inyección de sidecar
```yaml
metadata:
  name: kiali-permissive
  namespace: istio-system
spec:
  selector:
    matchLabels:
      app: kiali
  mtls:
    mode: PERMISSIVE
```
[peer-jaeger.yaml](./peer-jaeger.yaml): Análogo para este archivo, el cual permite que `jaeger-collector` desplegado en el namespace **istio-system**, pueda obtener métricas de los microservicios que estan desplegado en el namespace **ordendev** el cual sí tiene activado la inyección de sidecar