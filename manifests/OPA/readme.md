# OPA (Open Policy Agent)
En esta sección especificamos las `Constraints` y `ConstraintTemplate` para restringir acciones en el clúster:

## Templates
- [template-nodeport.yaml](./template-nodeport.yaml): Este archivo genera un template para restringir la creación de **Services** de tipo **NodePort**
```yaml
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8snonodeport

        violation[{"msg": msg}] {
          input.review.object.spec.type == "NodePort"
          msg := sprintf("No se permite crear Service de tipo NodePort: %s", [input.review.object.metadata.name])}
```
- [template-max-resources.yaml](./template-max-resources.yaml): Este archivo genera un template para restringir la creación de recursos que soliciten mayor cantidad de memoria que la permitida
```yaml
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8smaxmemoryrequest

        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          req := container.resources.requests.memory
          req != ""
          max := input.parameters.maxMemory

          exceeds(req, max)

          msg := sprintf("El contenedor '%s' solicita %s de memoria, que excede el máximo permitido (%s)", [container.name, req, max])
        }

        # Convierte strings tipo "512Mi", "1Gi" a bytes y compara
        exceeds(req, max) {
          parse_bytes(req) > parse_bytes(max)
        }

        parse_bytes(mem) = bytes {
          endswith(mem, "Mi")
          n := to_number(trim_suffix(mem, "Mi"))
          bytes := n * 1024 * 1024
        }

        parse_bytes(mem) = bytes {
          endswith(mem, "Gi")
          n := to_number(trim_suffix(mem, "Gi"))
          bytes := n * 1024 * 1024 * 1024
        }

        parse_bytes(mem) = bytes {
          endswith(mem, "M")
          n := to_number(trim_suffix(mem, "M"))
          bytes := n * 1000 * 1000
        }

        parse_bytes(mem) = bytes {
          endswith(mem, "G")
          n := to_number(trim_suffix(mem, "G"))
          bytes := n * 1000 * 1000 * 1000
        }
```
- [template-resourcelimit.yaml](./template-resourcelimit.yaml): Este archivo genera un template para restringir la creación de recursos que no especifiquen límites de CPU y memoria
```yaml
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredresources

        violation[{"msg": msg}] {
          container := input.review.object.spec.template.spec.containers[_]
          not container.resources.limits.cpu
          msg := sprintf("El container %s no tiene CPU limit", [container.name])
        }

        violation[{"msg": msg}] {
          container := input.review.object.spec.template.spec.containers[_]
          not container.resources.limits.memory
          msg := sprintf("El container %s no tiene memoria limit", [container.name])
        }
```

## Constrainst
- [constraint-nodeport.yaml](./constraint-nodeport.yaml): Este archivo define la **Constraint** que evita la creación de _Servicios NodePort_ basada en el **Template** especificado anteriormente
```yaml
spec:
  match:
    kinds:
      - apiGroups: [""]       # Service esta en el grupo core, por eso ""
        kinds: ["Service"]
```
- [constraint-max-resources.yaml](./constraint-max-resources.yaml): Este archivo define la **Constraint** que evita la creación de un _recurso_ que exceda los **512MiB** de memoria, basada en el **Template** especificado anteriormente
```yaml
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
      - apiGroups: ["apps"]
        kinds: ["Deployment", "StatefulSet", "DaemonSet", "ReplicaSet"]
  parameters:
    maxMemory: "512Mi"
```
- [constraint-resourcelimit.yaml](./constraint-resourcelimit.yaml): Este archivo define la **Constraint** que evita la creación de un _recurso_ que no especifique límites de memoria y CPU, basada en el **Template** especificado anteriormente
```yaml
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment"]
```

### Observación: 
Recordar que antes de ejecutar esto, debemos validar que hayamos creado los recursos `gatekeeper`, para ello podemos ejecutar
`kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.15/deploy/gatekeeper.yaml`