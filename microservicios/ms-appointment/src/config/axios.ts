import axios from 'axios';
import { IncomingHttpHeaders } from 'http';

export const doctorClient = axios.create({
  baseURL: process.env.DOCTOR_SERVICE_URL || 'http://ms-doctors:8080',
  timeout: 3000,
});

export const patientClient = axios.create({
  baseURL: process.env.PATIENTS_SERVICE_URL || 'http://ms-patients:8080',
  timeout: 3000,
});

export const forwardHeaders = (headers: IncomingHttpHeaders) => ({
  traceparent: headers['traceparent'],
  tracestate: headers['tracestate'],
});
