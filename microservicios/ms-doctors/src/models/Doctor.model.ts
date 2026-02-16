import { DataTypes } from 'sequelize';
import db from '../config/db';

export const Doctor = db.define('Doctor', {
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
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    license_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
