import client from 'prom-client';

client.collectDefaultMetrics();

export const appointmentCounter = new client.Counter({
  name: 'appointment_created_total',
  help: 'Total de appointment'
});