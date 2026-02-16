import { Request, Response } from 'express'
import db from '../config/db';
import { Doctor } from '../models/Doctor.model';
import { Availability } from '../models/Availability.model';
import { Doctor as DoctorType, Availability as AvailabilityType } from '../types';
import { logger } from '../config/pino';
import { doctorCounter } from '../config/prom-client';
import { SpanStatusCode, trace } from '@opentelemetry/api';

export const createDoctor = async (req : Request, res : Response) => {
    const tracer = trace.getTracer('doctors-service');
    const span = tracer.startSpan('create_doctor', {attributes: {
        'http.method': req.method,
        'http.route': req.route?.path,
    }});

    const transaction = await db.transaction();
    try {
        const { availabilities, ...doctorData } = req.body;
        const doctor = await Doctor.create(doctorData, { transaction }) as DoctorType;

        if (availabilities && Array.isArray(availabilities)) {
            for (const availability of availabilities) {
                await Availability.create({...availability, doctor_id: doctor.id}, { transaction });
            }
        }
        await transaction.commit();
        logger.info({doctorId: doctor.id, action: 'create_doctor'}, 'Doctor created successfully');
        doctorCounter.inc();
        span.setStatus({ code: SpanStatusCode.OK });
        const doctorCompose = {doctor, availabilities}
        return res.status(201).json({data: doctorCompose}); 
    } catch (error) {
        logger.error({err: error, action: 'create_doctor'}, 'Error creating doctor');
        await transaction.rollback();
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error creando doctor'});
    } finally {
        span.end();
    }
}

export const getDoctor = async (req: Request, res: Response) => {
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

export const deleteDoctor = async (req: Request, res: Response) => {
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

export const updateDoctor = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('doctor-service');
    const span = tracer.startSpan('update_doctor', {attributes: {
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
        await doctor.update(req.body)
        logger.info({doctorId: id, action: 'update_doctor'}, 'Doctor information updated');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: doctor})
    } catch (error) {
        logger.error({err: error, action: 'update_doctor'}, 'Error updating doctor information');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al actualizar el doctor'});
    } finally {
        span.end();
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('doctor-service');
    const span = tracer.startSpan('update_availability', {attributes: {
        'doctor.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});

    try {
        const availabilityData = req.body;
        const doctor = await Doctor.findByPk(id) as DoctorType
        if (!doctor) {
            logger.warn({ doctorId: id}, 'Doctor not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Doctor not found' });
            return res.status(404).json({error: 'Doctor no encontrado'})
        }
        const availability = await Availability.findByPk(availabilityData.id) as AvailabilityType
        if (!availability) {
            logger.warn({ doctorId: id}, 'Availability not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Availability not found' });
            return res.status(404).json({error: 'Disponibilidad no encontrada'})
        }
        availability.update(availabilityData)
        logger.info({traceId: span?.spanContext().traceId, availabilityId: availability.id, action: 'update_availability'}, 'Doctor availability updated');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({ data: availability })
    } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        logger.error({err: error, action: 'update_availability'}, 'Error updating doctor availability');
        return res.status(500).json({error: 'Error al actualizar la disponibilidad del doctor'});
    } finally {
        span.end();
    }
}

export const createAvailability = async (req : Request, res : Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('doctors-service');
    const span = tracer.startSpan('create_availability', {attributes: {
        'doctor.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const availabilityReq = req.body;
        const doctor = await Doctor.findByPk(id)
        if(!doctor) {
            logger.warn({ doctorId: id }, 'Doctor not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Doctor not found' });
            return res.status(404).json({error: 'Doctor no encontrado'})
        }
        const availability = await Availability.create({...availabilityReq, doctor_id: id}) as AvailabilityType 
        logger.info({availabilityId: availability.id, action: 'create_availability'}, 'Availability created successfully');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(201).json({data: availability}); 
    } catch (error) {
        logger.error({err: error, action: 'create_availability'}, 'Error creating availability');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error creando disponibilidad'});
    } finally {
        span.end();
    }
}
