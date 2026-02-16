# AuthorizationPolicy
En esta sección tenemos 3 bloques de manifest AuthorizationPolicy, los cuales nos permiten "autorizar" el acceso a un determinado PODs:

1. `ap-allow-appointment-***.yaml`: Permite brindar autorización, para que un POD con **ServiceAccount** `default` pueda acceder a un determinado path de los PODs `ms-patient` y `ms-doctors`
```yaml
  action: ALLOW
  rules:
    - from:
        - source:
            principals:
              - "cluster.local/ns/ordendev/sa/default"
```
2. `ap-allow-curl-***.yaml`: Permite brindar autorización, para que el POD con **ServiceAccount** `sa-curl-mtls` pueda acceder a un determinado path de los PODs `ms-patient`, `ms-doctors` y `ms-appointments`
```yaml
  action: ALLOW
  rules:
    - from:
        - source:
            principals:
              - "cluster.local/ns/ordendev/sa/sa-curl-mtls"
      to:
        - operation:
            methods: ["GET"]
            paths:
              - "/api/appointments/*"
```
3. `ap-allow-prometheus-***.yaml`: Permite brindar autorización, para que el POD con **ServiceAccount** `prometheus` pueda acceder a un determinado path de los PODs `ms-patient`, `ms-doctors` y `ms-appointments`
```yaml
  action: ALLOW
  rules:
    - from:
        - source:
            principals:
              - "cluster.local/ns/monitoring/sa/prometheus"
      to:
        - operation:
            methods: ["GET"]
            paths:
              - "/prom/metrics"
```

### Comandos
Existen una serie de comandos útiles que nos permiten verificar la "conectividad" entre PODs
- `istioctl x authz check <pod_name> -n <namespace_name>`: Permite revisar las **AuthorizationPolicy** que afectan un determinado POD
- `kubectl auth can-i list services -n <namespace_name> --as=system:serviceaccount:<namespace>:<sa_name>`: Permite listar los service que puedo acceder con un determinado **ServiceAccount**