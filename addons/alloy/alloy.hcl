logging {
  level = "info"
}

/* -------------------- */
/* Descubrimiento de pods en ordendev solamente */
discovery.kubernetes "pods" {
  role = "pod"
  namespaces {
    names = ["ordendev"] // Nota: 'names' es una lista []
  }
}

/* -------------------- */
/* Relabeling Kubernetes */
discovery.relabel "pods" {
  targets = discovery.kubernetes.pods.targets

  // 1. Filtrado preventivo (Mejor usar la meta-label original)
  rule {
    action        = "keep"
    source_labels = ["__meta_kubernetes_pod_name"]
    regex         = "ms-.*"
  }

  // 2. Mapeo de etiquetas finales
  rule {
    action        = "replace"
    source_labels = ["__meta_kubernetes_namespace"]
    target_label  = "namespace"
  }

  rule {
    action        = "replace"
    source_labels = ["__meta_kubernetes_pod_name"]
    target_label  = "pod"
  }

  rule {
    action        = "replace"
    source_labels = ["__meta_kubernetes_pod_container_name"]
    target_label  = "container"
  }
  
  // Agregamos una etiqueta de job por buena práctica
  rule {
    action        = "replace"
    replacement   = "kubernetes-pods"
    target_label  = "job"
  }
}

/* -------------------- */
/* Loki writer (logs)   */
loki.write "default" {
  endpoint {
    url = "http://loki.istio-system.svc.cluster.local:3100/loki/api/v1/push"
  }
}

/* Source de logs */
loki.source.kubernetes "pods" {
  targets    = discovery.relabel.pods.output
  forward_to = [loki.write.default.receiver]
}
