import { DataTypes } from "sequelize";
import db from "../config/db";

export const Address = db.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    }
})