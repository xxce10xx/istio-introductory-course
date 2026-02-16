import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'
import { createPatient, deletePatient, getPatient, updateAddress, updatePatient } from './handlers/patient'

const router = Router()

// Routing
router.post('/', 
    body('first_name').notEmpty().withMessage('El nombre del paciente no puede ir vacio').isString(),
    body('last_name').notEmpty().withMessage('El apellido del paciente no puede ir vacio').isString(),
    body('document_number').notEmpty().withMessage('El documento del paciente no puede ir vacio').isString(),
    body('phone').notEmpty().withMessage('El teléfono del paciente no puede ir vacío'),
    body('email').isEmail().withMessage('El email tiene formato incorrecto'),
    body('address').exists().withMessage('La direción es obligatoria').isObject().withMessage('La dirección debe ser un objeto'),
    body('address.street').notEmpty().withMessage('La calle o avenida es obligatorio').isString(),
    body('address.city').notEmpty().withMessage('La ciudad es obligatoria').isString(),
    body('address.region').notEmpty().withMessage('La región es obligatoria').isString(),
    handleInputErrors,
    createPatient
)
router.get('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getPatient
)
router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deletePatient
)
router.put('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('first_name').notEmpty().withMessage('El nombre del paciente no puede ir vacio').isString(),
    body('last_name').notEmpty().withMessage('El apellido del paciente no puede ir vacio').isString(),
    body('document_number').notEmpty().withMessage('El documento del paciente no puede ir vacio').isString(),
    body('phone').notEmpty().withMessage('El teléfono del paciente no puede ir vacío'),
    body('email').isEmail().withMessage('El email tiene formato incorrecto'),
    body('address').exists().withMessage('La direción es obligatoria').isObject().withMessage('La dirección debe ser un objeto'),
    body('address.street').notEmpty().withMessage('La calle o avenida es obligatorio').isString(),
    body('address.city').notEmpty().withMessage('La ciudad es obligatoria').isString(),
    body('address.region').notEmpty().withMessage('La región es obligatoria').isString(),
    handleInputErrors,
    updatePatient
)

router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('street').notEmpty().withMessage('La calle o avenida es obligatorio').isString(),
    body('city').notEmpty().withMessage('La ciudad es obligatoria').isString(),
    body('region').notEmpty().withMessage('La región es obligatoria').isString(),
    handleInputErrors,
    updateAddress
)

export default router
