import { DataTypes } from "sequelize";
import db from "../config/db";

export const Availability = db.define('Availability', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day_of_week: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: false
    }
})