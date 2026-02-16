# Secrets
En esta sección creamos los secretos usados por los microservicios para conectarse a la BBDD. 

>Nosotros usamos AWS RDS, pero podría usar cualquier servicio de base de datos. Notar que los valores fueron quitados y deberá completar con los valores de su propio servicio.

```yaml
metadata:
  namespace: ordendev
  name: db-secret
type: Opaque
stringData:
  host: 
  username: 
  password: 
  dbPort: "5432"
  dbname: postgres
```