## Creación del ServiceEntry
Esta sección crea un **ServiceEntry** el cual nos permite comunicar al MESH que consumiremos un recurso externo, de esta forma cuando visualicemos en `Kiali` no tendremos errores o services en estado _unknown_
```yaml
spec:
  hosts:
  - mi-database.host.amazonaws.com
  location: MESH_EXTERNAL # notar que especificamos que es externo al MESH
  ports:
  - number: 5432
    name: tcp-postgres
    protocol: TCP
  resolution: DNS
```