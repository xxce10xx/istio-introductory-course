import { DataTypes } from 'sequelize';
import db from '../config/db';

export const Appointment = db.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patient_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctor_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    appointment_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appointment_time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
