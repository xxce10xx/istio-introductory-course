# Fails
En esta sección colocamos ejemplos de Deployments, Services y PODs incorrectos, los cuales serán rechazados por OPA
- [deploy-imagetag-fail.yaml](./deploy-imagetag-fail.yaml): Este despliegue fallará debido a que no posee **tag** en la imagen que usa y además no tiene límites de recursos (CPU y memoria)
- [pod-max-resource-fail.yaml](./pod-max-resource-fail.yaml): La creación de este POD fallará debido a que solicita **768MiB** de recursos, lo cual excede el límite establecido de **512MiB**
```yaml
      resources:
        requests:
          memory: "768Mi"
        limits:
          memory: "768Mi"
```
- [svc-nodeport-fail.yaml](./svc-nodeport-fail.yaml): Esta implementación fallará debido a que se solicita la creación de un servicio tipo **NodePort** el cual no esta permitido
```yaml
      type: NodePort
```
### Observación
Para que estas restricciones OPA (Open Policy Agent) funcionen correctamente, primero debe verificar el readme e implementar los archivos de la sección [OPA](../OPA/readme.md)