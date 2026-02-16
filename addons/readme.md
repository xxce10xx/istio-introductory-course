# AddOns
En esta sección tenemos todos los addons aplicados a nuestro cluster. Para levantar cada uno de ellos únicamente debemos ejecutar `kubectl apply -f <nombre_archivo.yaml>`

### Observaciones
1. Al lanzar el **Statefulset** de `loki` notaremos que se queda en estado _Pending_, esto se debe a que `loki` solicita un PVC y como no tenemos **CSI (Container Storage Interface)** en nuestro clúster el POD se queda sin acciones posibles. Debemos crear nuestro [Persistent Volume](../manifests/persistentVolume/readme.md)
2. Al lanzar el **Deployment** de `prometheus` todo funcionará correctamente, pero no mostrá nuestras métricas personalizadas, ya que se exponen en el custom path _/prom/metrics_, por tanto debemos crear un **ServiceMonitor** o actualizar el **ConfigMap** de `prometheus` para crear un nuevo **scraper**

#### Opcion 1
Crear un **ServiceMonitor**, este archivo indicará a `prometheus` dónde buscar las métricas personalizadas:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ms-patients
  namespace: ordendev
spec:
  selector:
    matchLabels:
      app: ms-patients
  namespaceSelector:
    matchNames:
      - ordendev
  endpoints:
    - port: http   # nombre del puerto del service ms-patients (8080)
      path: /prom/metrics
      interval: 30s
```
#### Opcion 2
Actualizar, con mucho cuidado, el **ConfigMap** de `prometheus` y colocar un nuevo **scraper**:
```yaml
scrape_configs:
  - job_name: "ms-services-ordendev"
    kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
            - ordendev
    relabel_configs:
      - source_labels: [__meta_kubernetes_service_name]
        action: keep
        regex: ms-.*
	  - source_labels: [__meta_kubernetes_service_port_name]
        action: keep
        regex: http
    metrics_path: /prom/metrics
    scheme: http
```