import { Model, Optional } from "sequelize";

interface PatientAttributes {
  id: number;
  first_name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  phone_code: string;
  phone: string;
  email: string;
  address: AddressAttributes;
}

interface PatientCreationAttributes extends Optional<PatientAttributes, 'id' | 'document_type' | 'phone_code' > {}

export class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes
{
    id!: number;
    first_name: string;
    last_name: string;
    document_type!: string;
    document_number: string;
    phone_code!: string;
    phone: string;
    email: string;
    address: AddressAttributes;
}

interface AddressAttributes {
  id: number;
  street: string;
  city: string;
  region: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}


export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes
{
  id: number;
  street: string;
  city: string;
  region: string;
}