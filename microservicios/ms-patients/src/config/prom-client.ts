import client from 'prom-client';

client.collectDefaultMetrics();

export const patientCounter = new client.Counter({
  name: 'patients_created_total',
  help: 'Total de pacientes creados'
});