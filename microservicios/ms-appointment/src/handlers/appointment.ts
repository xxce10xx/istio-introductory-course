import { Request, Response } from 'express'
import db from '../config/db';
import { Appointment } from '../models/Appointment.model';
import { Appointment as AppointmentType } from '../types';
import { logger } from '../config/pino';
import { appointmentCounter } from '../config/prom-client';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { doctorClient, forwardHeaders, patientClient } from '../config/axios';

export const createAppointment = async (req : Request, res : Response) => {
    const tracer = trace.getTracer('appointments-service');
    const span = tracer.startSpan('create_appointment', {attributes: {
        'http.method': req.method,
        'http.route': req.route?.path,
    }});

    try {
        const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
        const doctor = await doctorClient.get(`/api/doctors/${doctor_id}`,{headers: forwardHeaders(req.headers), validateStatus: (status) => status < 500});
        if(doctor.status === 404) {
            logger.warn({ doctorId: doctor_id }, 'Doctor not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Doctor not found' });
            return res.status(404).json({error: 'Doctor no encontrado'})
        }

        const patient = await patientClient.get(`/api/patients/${patient_id}`, {headers: forwardHeaders(req.headers), validateStatus: (status) => status < 500});
        if(patient.status === 404) {
            logger.warn({ patientId: patient_id }, 'Patient not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Patient not found' });
            return res.status(404).json({error: 'Paciente no encontrado'})
        }

        const appointment = await Appointment.create({patient_id, doctor_id, appointment_date, appointment_time, status}) as AppointmentType
        logger.info({appointmentId: appointment.id,action: 'create_appointment'}, 'Appointment created successfully');
        appointmentCounter.inc();
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(201).json({data: appointment}); 
    } catch (error) {
        logger.error({err: error, action: 'create_appointment'}, 'Error creating appointment');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error creando cita'});
    } finally {
        span.end();
    }
}
/** 
export const getAppointment = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('doctor-service');
    const span = tracer.startSpan('get_doctor', {attributes: {
        'doctor.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const doctor = await Doctor.findByPk(id, {
            attributes: ['id', 'first_name', 'last_name', 'specialty', 'license_number'],
            include: [
                {
                    model: Availability,
                    as: 'availability',
                    attributes: ['id','day_of_week', 'start_time', 'end_time']
                }
            ]
        }) as DoctorType;
        if(!doctor) {
            logger.warn({ doctorId: id }, 'Doctor not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Doctor not found' });
            return res.status(404).json({error: 'Doctor no encontrado'})
        }
        logger.info({doctorId: id, action: 'get_doctor'}, 'Doctor successfully obtained');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: doctor})
    } catch (error) {
        logger.error({err: error, action: 'get_doctor'}, 'Error geting doctor information');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al obtener al doctor'});
    } finally {
        span.end();
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('doctor-service');
    const span = tracer.startSpan('delete_doctor', {attributes: {
        'doctor.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const doctor = await Doctor.findByPk(id)
        if (!doctor) {
            logger.warn({ doctorId: id }, 'Doctor not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Doctor not found' });
            return res.status(404).json({error: 'Doctor no encontrado'})
        }
        await doctor.destroy();
        logger.info({doctorId: id, action: 'delete_dcotor'}, 'Doctor deleted successfully');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: 'Doctor eliminado correctamente'})
    } catch (error) {
        logger.error({err: error, action: 'delete_doctor'}, 'Error deleting doctor');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al obtener al doctor'});
    } finally {
        span.end();
    }
}
*/