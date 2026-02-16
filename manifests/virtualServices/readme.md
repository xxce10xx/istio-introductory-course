# VirtualServices
En esta sección definimos los **VirtualServices** de los diferentes PODs
- [ms-patients-vs.yaml](./ms-patients-vs.yaml): Especifica el **VirtualService** para el deployment `ms-patients`
```yaml
spec:
  hosts:
    - ms-patients
  http:
    - route:
        - destination:
            host: ms-patients
            subset: v1 # tener en cuenta que este subset se mapea con el DestinationRule
            port:
              number: 8080
```
- [ms-doctors-vs.yaml](./ms-doctors-vs.yaml): Especifica el **VirtualService** para el deployment `ms-doctors`
```yaml
spec:
  hosts:
    - ms-doctors
  http:
    - route:
        - destination:
            host: ms-doctors
            subset: v1
            port:
              number: 8080
```
- [ms-appoinment-vs.yaml](./ms-appointment-vs.yaml): Especifica el **VirtualService** para el deployment `ms-appointments`
```yaml
spec:
  hosts:
    - ms-appointments
  http:
    - route:
        - destination:
            host: ms-appointments
            subset: v1
            port:
              number: 8080
```

### Observación
Existe un archivo extra llamado [ms-doctors-vs-v2.yaml](./ms-doctors-vs-v2.yaml) el cual contiene una segunda versión del **VirtualService** para el deployment `ms-doctors`, en este caso se contemplan los dos despliegues y el balanceo entre ellos
```yaml
spec:
  hosts:
    - ms-doctors
  http:
    - route:
        - destination:
            host: ms-doctors
            subset: v1
          weight: 80
        - destination:
            host: ms-doctors
            subset: v2
          weight: 20
```
