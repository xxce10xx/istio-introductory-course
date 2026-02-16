# DestinationRules
En esta sección se implementan cada una de las **DestinationRule** para los diferentes Deployments: `ms-appointment-dr.yaml`, `ms-doctors-dr.yaml` y `ms-patients-dr.yaml`. Podemos ver un ejemplo:
```yaml
kind: DestinationRule
metadata:
  name: ms-doctors
  namespace: ordendev
spec:
  host: ms-doctors
  subsets:
    - name: v1
      labels:
        version: v1
```

### Observación
Podemos notar que existen dos achivos adicionales:
- [ms-doctors-dr-v2.yaml](./ms-doctors-dr-v2.yaml): Este archivo es una segunda versión del **DestinationRule** para el deployment `ms-doctors-v2`, nos permite tener dos deployments y balancear entre ellos. El balanceo se especifica en [virtualServices](../virtualServices/readme.md)
```yaml
  host: ms-doctors
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```
- [ms-doctors-dr-adv.yaml](./ms-doctors-dr-adv.yaml): Este archivo es una tercera versión del **DestinationRule** para el deployment `ms-doctors`, nos permite especificar _trafficPolicy_ para implementar patrones como `outliers`, `circuit-breaker`, etc.
```yaml
      trafficPolicy:
        connectionPool: #Aplica cuando NO se usa un subset o como valor base
          tcp:
            maxConnections: 3
          http:
            http1MaxPendingRequests: 5
            maxRequestsPerConnection: 3
        outlierDetection: #Si un pod responde 2 errores 5xx consecutivos:
          consecutive5xxErrors: 2
          interval: 5s
          baseEjectionTime: 30s #Se expulsa del load balancing por 30s
          maxEjectionPercent: 100 #Istio puede expulsar todos los pods de esta versión
```