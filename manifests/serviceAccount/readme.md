# ServiceAccount
En esta sección únicamenete se crea el **ServiceAccount** utilizado por el POD de testing `curl-mtls-sa`
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa-curl-mtls
  namespace: monitoring
```