# Creación de Namespaces
Esta sección es muy sencilla, únicamente posee la creación de namespaces:
- ordendev
- ordenqa
- ordenprd
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ordenprd
  labels:
    environment: prd
    istio-injection: enabled # habilitamos la inyeccion de istio
```