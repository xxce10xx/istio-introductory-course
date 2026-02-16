import { DataTypes } from 'sequelize';
import db from '../config/db';

export const Patient = db.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    document_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'DNI'
    },
    document_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '+51'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
