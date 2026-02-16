import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'
import { createAvailability, createDoctor, deleteDoctor, getDoctor, updateAvailability, updateDoctor } from './handlers/doctors'

const router = Router()

// Routing
router.post('/', 
    body('first_name').notEmpty().withMessage('El nombre del doctor no puede ir vacio').isString(),
    body('last_name').notEmpty().withMessage('El apellido del doctor no puede ir vacio').isString(),
    body('specialty').notEmpty().withMessage('La especialidad del doctor no puede ir vacio').isString(),
    body('license_number').notEmpty().withMessage('El núymero de licencia del doctor no puede ir vacío'),
    body('availabilities').exists().withMessage('La disponibilidad es obligatoria').isArray().withMessage('La disponibilidad debe ser un arreglo'),
    body('availabilities.*.day_of_week').notEmpty().withMessage('El día de la semana es obligatorio').isString(),
    body('availabilities.*.start_time').notEmpty().withMessage('La fecha de inicio es obligatoria').isString(),
    body('availabilities.*.end_time').notEmpty().withMessage('La fecha de fin  es obligatoria').isString(),
    handleInputErrors,
    createDoctor
)
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
router.put('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('first_name').notEmpty().withMessage('El nombre del doctor no puede ir vacio').isString(),
    body('last_name').notEmpty().withMessage('El apellido del doctor no puede ir vacio').isString(),
    body('specialty').notEmpty().withMessage('La especialidad del doctor no puede ir vacio').isString(),
    body('license_number').notEmpty().withMessage('El núymero de licencia del doctor no puede ir vacío'),
    handleInputErrors,
    updateDoctor
)

router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('id').isInt().withMessage('El id es obligatorio'),
    body('day_of_week').notEmpty().withMessage('El día de la semana es obligatorio').isString(),
    body('start_time').notEmpty().withMessage('La fecha de inicio es obligatoria').isString(),
    body('end_time').notEmpty().withMessage('La fecha de fin  es obligatoria').isString(),
    handleInputErrors,
    updateAvailability
)

router.post('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('day_of_week').notEmpty().withMessage('El día de la semana es obligatorio').isString(),
    body('start_time').notEmpty().withMessage('La fecha de inicio es obligatoria').isString(),
    body('end_time').notEmpty().withMessage('La fecha de fin  es obligatoria').isString(),
    handleInputErrors,
    createAvailability
)


export default router
