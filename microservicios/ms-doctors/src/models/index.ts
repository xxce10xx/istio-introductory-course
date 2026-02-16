import { Doctor } from './Doctor.model';
import { Availability } from './Availability.model';

Doctor.hasMany(Availability, {
  foreignKey: 'doctor_id',
  as: 'availability',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Availability.belongsTo(Doctor, {
  foreignKey: 'doctor_id',
  as: 'doctor'
});
