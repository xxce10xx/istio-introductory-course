import { Model, Optional } from "sequelize";

interface AppointmentAttributes {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes
{
  id!: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string
}