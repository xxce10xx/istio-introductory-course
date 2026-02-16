# AdOns Alloy
En el caso de Alloy hemos optado por instalarlo con ayuda de Helm, para ello empleamos los siguientes comandos:
```bash
helm repo add grafana https://grafana.github.io/helm-charts # agregamos el repositorio de grafana
helm repo update # actualizamos nuestros repositorios
# Ejecutamos la instación
helm install alloy grafana/alloy --namespace observability --create-namespace --set controller.type=daemonset --set alloy.configMap.create=true --set alloy.configMap.name=alloy-config --set-file alloy.configMap.content=alloy.hcl
```

### Observación
Notar que al momento de ejecutar `helm install` se solicita el archivo `alloy.hcl` el cual esta disponible en esta misma carpeta [alloy.hcl](./alloy.hcl)