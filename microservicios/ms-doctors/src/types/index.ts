import { Model, Optional } from "sequelize";

interface DoctorAttributes {
  id: number;
  first_name: string;
  last_name: string;
  specialty: string;
  license_number: string;
  availabilities: Availability[];
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, 'id'> {}

export class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes
{
  id!: number;
  first_name: string;
  last_name: string;
  specialty: string;
  license_number: string;
  availabilities: Availability[];
}

interface AvailabilityAttributes {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface AvailabilityCreationAttributes extends Optional<AvailabilityAttributes, 'id'> {}

export class Availability extends Model<AvailabilityAttributes, AvailabilityCreationAttributes> implements AvailabilityAttributes
{
  id!: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}