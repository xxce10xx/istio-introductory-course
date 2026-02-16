# Manifests
En este grupo de carpetas especificamos cada uno de los manifest necesarios para el despliegue de la solución. Además cada manifest contiene un archivo `readme.md` que especifica brevemente su utilidad y funcionamiento

## Orden de despliegue
Antes de ingresar a esta sección se asume que ya se tienen desplegados todos los **addons** necesarios (`kiali`, `prometheus`, `alloy`, `jaeger`, `loki`, `grafana`). Si aún no los ha desplegado visitar [addons](../addons/readme.md). También se asume que ya se tienen los servicios dockerizados y la BBDD creada, caso contrario visitar [dockerfile](../microservicios/readme.md) y [BBDD](../bd/readme.md) respectivamente.

1. [Persistent Volume](./persistentVolume/readme.md)
2. [Service Entry](./serviceEntry/readme.md)
3. [Namespaces](./namespaces/readme.md)
4. [Config Maps](./configMaps/readme.md)
5. [Secrets](./secrets/db-secrets.yaml)  
6. [Deployments](./deployment/readme.md)
7. [Services](./services/readme.md)
8. [Destination Rule](./destinationRule/readme.md)
9. [Virtual Services](./virtualServices/readme.md)
10. [Service Account](./serviceAccount/readme.md)
11. [mTLS](./mtls/readme.md)
12. [Peer Authentication](./peerAuthentication/readme.md)
13. [AuthorizationPolicy](./authorizationPolicy/readme.md)
14. [Telemetry](./telemetry/readme.md)
15. [OPA (Open Policy Agent)](./OPA/readme.md)
16. [CURL](./curl/readme.md)
17. [Fails (Recursos que rompen OPA)](./fails/readme.md)
