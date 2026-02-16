import { Patient } from './Patient.model';
import { Address } from './Address.model';

Patient.hasOne(Address, {
  foreignKey: 'patient_id',
  as: 'address',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Address.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});
