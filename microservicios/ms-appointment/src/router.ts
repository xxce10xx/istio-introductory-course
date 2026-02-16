import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'
import { createAppointment } from './handlers/appointment'

const router = Router()

// Routing
router.post('/', 
    body('patient_id').notEmpty().withMessage('El ID de paciente debe ser entero no vacio'),
    body('doctor_id').notEmpty().withMessage('El ID de doctor debe ser entero no vacio'),
    body('appointment_date').notEmpty().withMessage('La fecha de cita debe ser no vacía').isString(),
    body('appointment_time').notEmpty().withMessage('El hora de cita debe ser no vacía'),
    body('status').notEmpty().withMessage('El status debe ser no vacío'),
    handleInputErrors,
    createAppointment
)

/**
router.get('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getDoctor
)
router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteDoctor
)
 */
export default router
