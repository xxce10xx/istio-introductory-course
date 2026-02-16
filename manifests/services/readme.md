# Sevices
En esta sección se generan los service para el acceso a los microservicios de negocio desplegados en el namespace **ordendev**
- [ms-patient-svc.yaml](./ms-patient-svc.yaml): Este archivo define el servicio para el deployment `ms-patients`
```yaml
spec:
  type: ClusterIP
  selector:
    app: ms-patients
  ports:
    - name: http
      port: 8080
      targetPort: 3000
```
- [ms-doctor-svc.yaml](./ms-doctor-svc.yaml): Este archivo define el servicio para el deployment `ms-doctors`
```yaml
spec:
  type: ClusterIP
  selector:
    app: ms-doctors
  ports:
    - name: http
      port: 8080
      targetPort: 3000
```
- [ms-appointment-svc.yaml](./ms-appointment-svc.yaml): Este archivo define el servicio para el deployment `ms-appointments`
```yaml
spec:
  type: ClusterIP
  selector:
    app: ms-appointments
  ports:
    - name: http
      port: 8080
      targetPort: 3000
```

### Observación
> Existe un archivo [svc-externalname.yaml](./svc-externalname.yaml), este archivo lo usamos ya que, `prometheus` esta en el namespace llamado **monitoring** y `kiali` esta en el namespace **istio-system**; además, por defecto `kiali` apunta al service `prometheus:9090` y obtiene error. Podríamos editar el _configMap_ de `kiali` y apuntar a `http://prometheus.monitoring.svc.cluster.local:9090` o generar un _service externalName_
```yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: istio-system
spec:
  type: ExternalName
  externalName: prometheus.monitoring.svc.cluster.local
  ports:
    - port: 9090
      protocol: TCP
```