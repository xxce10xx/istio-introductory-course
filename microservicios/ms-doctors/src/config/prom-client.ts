import client from 'prom-client';

client.collectDefaultMetrics();

export const doctorCounter = new client.Counter({
  name: 'doctors_created_total',
  help: 'Total de doctors with contract'
});