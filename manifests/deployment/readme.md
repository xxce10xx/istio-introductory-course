# Creación de deployments
En esta sección se lanzan los despliegues, recordemos que poseemos 3 microservicios (ms-patients, ms-doctors, ms-appointment)

![Conectividad de los microservicios](../../assets/microservices.png=100x200)

### Observación
1. Los microservicios van hacia una BBDD desplegada en AWS RDS
2. Para no tener comportamientos extraños, se recomienda primero crear la [BBDD](../../bd/readme.md) y el [ServiceEntry](../serviceEntry/readme.md)
3. Existe un archivo `ms-doctors-deploy-v2` este servicio despliega una segunda versión del microservicio `ms-doctors`, el cual es importante para ejemplificar características como **circuit-breaker**, **despliegue canary**, etc.
4. **Los archivos deployment requieren tener desplegado el _ConfigMap_ y _Secrets_**. Visitar [configMaps](../configMaps/readme.md) y [secrets](../secrets/readme.md)

### Extra
Rercordar que para el correcto funcionamiento se deben ejecutar los VirtualServices [ms-***-vs.yaml](../virtualServices/readme.md) y DestinationRules [ms-***-dr.yaml](../destinationRule/readme.md) correspondientes.

