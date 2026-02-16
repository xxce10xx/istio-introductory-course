# LocalVolume
En esta sección se crean 2 **PersistentVolume** ya que nuestro **Statefulset** de Loki lo solicita (Loki ejecuta un PVC). Este paso se produce ya que no tenemos **CSI (Container Storage Interface)** en nuestro clúster
```yaml
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /tmp/data/pv-1
```

### Observación
Ya que hemos creamos un volumen de tipo **hostPath** es posible que tengamos que ejecutar los siguientes comandos, debido a que Loki intenta escribir sobre el _filesystem_ con un _user-id_ sin permisos suficientes
```bash
sudo mkdir -p /tmp/data/pv-1
sudo chmod -R 0777 /tmp/data/pv-1
```

### Nota
Queda claro que este comportamiento es únicamente para pruebas locales, en un ambiente productivo debemos tener un OCI sea en datacenter local o en nube (StorageProvider)
