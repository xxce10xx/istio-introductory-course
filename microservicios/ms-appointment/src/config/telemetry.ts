// src/observability.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

export const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'appointment-service',
    'service.version': '1.0.0',
    'deployment.environment': 'dev',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://jaeger:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

process.on('SIGTERM', async () => {
  await sdk.shutdown();
});

