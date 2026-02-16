import { Request, Response } from 'express'
import db from '../config/db';
import { Patient } from '../models/Patient.model';
import { Address } from '../models/Address.model';
import { Patient as PatientType, Address as AddressType } from '../types';
import { logger } from '../config/pino';
import { patientCounter } from '../config/prom-client';
import { SpanStatusCode, trace } from '@opentelemetry/api';

export const createPatient = async (req : Request, res : Response) => {
    const tracer = trace.getTracer('patients-service');
    const span = tracer.startSpan('create_patient', {attributes: {
        'http.method': req.method,
        'http.route': req.route?.path,
    }});

    const transaction = await db.transaction();
    try {
        const { address, ...patientData } = req.body;
        const patient = await Patient.create(patientData, { transaction }) as PatientType;
        if(address) {
            await Address.create({...address, patient_id: patient.id},{ transaction });
        }
        await transaction.commit();
        logger.info({patientId: patient.id, action: 'create_patient'}, 'Patient created successfully');
        patientCounter.inc();
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(201).json({data: patient}); 
    } catch (error) {
        logger.error({err: error, action: 'create_patient'}, 'Error creating patient');
        await transaction.rollback();
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error creando al paciente'});
    } finally {
        span.end();
    }
}

export const getPatient = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('patients-service');
    const span = tracer.startSpan('get_patient', {attributes: {
        'patient.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const patient = await Patient.findByPk(id, {
            attributes: ['id', 'first_name', 'last_name', 'document_number', 'email'],
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['street', 'city', 'region']
                }
            ]
        });
        if(!patient) {
            logger.warn({ patientId: id }, 'Patient not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Patient not found' });
            return res.status(404).json({error: 'Paciente no encontrado'})
        }
        logger.info({patientId: id, action: 'get_patient'}, 'Patient successfully obtained');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: patient})
    } catch (error) {
        logger.error({err: error, action: 'get_patient'}, 'Error geting patient information');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al obtener al paciente'});
    } finally {
        span.end();
    }
}

export const deletePatient = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('patients-service');
    const span = tracer.startSpan('delete_patient', {attributes: {
        'patient.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const patient = await Patient.findByPk(id)
        if (!patient) {
            logger.warn({ patientId: id }, 'Patient not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Patient not found' });
            return res.status(404).json({error: 'Paciente no encontrado'})
        }
        await patient.destroy();
        logger.info({patientId: id, action: 'delete_patient'}, 'Patient deleted successfully');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: 'Paciente eliminado correctamente'})
    } catch (error) {
        logger.error({err: error, action: 'delete_patient'}, 'Error deleting patient');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al obtener al paciente'});
    } finally {
        span.end();
    }
}

export const updatePatient = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('patients-service');
    const span = tracer.startSpan('update_patient', {attributes: {
        'patient.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});
    try {
        const patient = await Patient.findByPk(id)
        if (!patient) {
            logger.warn({ patientId: id }, 'Patient not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Patient not found' });
            return res.status(404).json({error: 'Paciente no encontrado'})
        }
        await patient.update(req.body)
        logger.info({patientId: id, action: 'update_patient'}, 'Patient information updated');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({data: patient})
    } catch (error) {
        logger.error({err: error, action: 'update_patient'}, 'Error updating patient information');
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        return res.status(500).json({error: 'Error al actualizar el paciente'});
    } finally {
        span.end();
    }
}

export const updateAddress = async (req: Request, res: Response) => {
    const {id} = req.params
    const tracer = trace.getTracer('patients-service');
    const span = tracer.startSpan('update_patient_address', {attributes: {
        'patient.id': id,
        'http.method': req.method,
        'http.route': req.route?.path,
    }});

    try {
        const addressData = req.body;
        const patient = await Patient.findByPk(id, {
            include: [
                { 
                    model: Address, 
                    as: 'address',
                    attributes: ['id', 'street', 'city', 'region']
                }
            ]}) as PatientType;
        if (!patient) {
            logger.warn({ patientId: id }, 'Patient not found');
            span.setStatus({ code: SpanStatusCode.ERROR, message: 'Patient not found' });
            return res.status(404).json({error: 'Paciente no encontrado'})
        }
        await (patient.address as AddressType).update(addressData);
        logger.info({traceId: span?.spanContext().traceId, patientId: id, action: 'update_address'}, 'Patient address updated');
        span.setStatus({ code: SpanStatusCode.OK });
        return res.status(200).json({ data: patient })
    } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        logger.error({err: error, action: 'update_address'}, 'Error updating patient address');
        return res.status(500).json({error: 'Error al actualizar la dirección del paciente'});
    } finally {
        span.end();
    }
}