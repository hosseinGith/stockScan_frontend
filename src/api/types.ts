export const Access = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ACCEPTANCE: "acceptance",
  ADMIN: "admin",
  FINANCIAL_MANAGER: "financialManager",
  SYSTEM_ADMIN: "system_admin",
} as const;
export type Role = (typeof Access)[keyof typeof Access];

export const StatusPrescriptions = {
  ACTIVE: "active",
  DISPENSED: "dispensed",
  EXPIRED: "expired",
} as const;
export type StatusPrescriptionsType =
  (typeof StatusPrescriptions)[keyof typeof StatusPrescriptions];

export interface Users {
  id: string;
  number: string;
  doctor: Doctors;
  patient: Patients;
  first_name: string;
  last_name: string;
  national_id: string;
  access: Role;
  created_at: string;
}
export interface ChatRequests {
  id: string;
  patient: Patients;
  doctor: Doctors;
  status: string;
  roomId: string;
}
export interface Appointments {
  id: string;
  patient: Patients;
  doctor: Doctors;
  prescriptions: Prescriptions[];
  appointment_date: Date;
  hour: DoctorHours;
  status: string;
  visit_type: string;
  symptoms: string;
  created_at: Date;
  reminder_sent: boolean;
}
export interface Prescriptions {
  id: string;
  patient: Patients;
  appointment: Appointments;
  issue_date: string;
  valid_until: string;
  diagnosis: string;
  medications: string;
  doctor_digital_signature: string;
  status: StatusPrescriptionsType;
  created_at: Date;
}
export interface Patients {
  id: string;
  user: Users;
  appointments: Appointments[];
  prescription: Prescriptions[];
  chatRequests: ChatRequests[];
  medical_record_number: string;
  blood_type: string;
  allergies: string;
  chronic_diseases: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  insurance_company: string;
}
export interface DoctorHours {
  id: string;
  doctor: Doctors;
  hour: string;
}
export const DRD_Type = {
  DAY: "day",
  HOUR: "hour",
};
export type DRD_Type_type = (typeof DRD_Type)[keyof typeof DRD_Type];

export const DRD_ReserveType = {
  BLOCK: "block",
  PATIENT: "patient",
};
export type DRD_ReserveType_type =
  (typeof DRD_ReserveType)[keyof typeof DRD_ReserveType];

export interface DatesOfReservedDay {
  id: string;
  doctor: Doctors;
  date: Date;
  type: DRD_Type_type;
  reserveType: DRD_ReserveType_type;
}

export interface Rates {
  id: string;
  doctor: Doctors;
  patient: Patients;
  rate: number;
  description: string;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  icon: string;
  doctors: Doctors;
}
export interface DoctorSpecialties {
  id: string;
  doctors: Doctors;
  specialty: Specialty;
}

export interface Doctors {
  id: string;
  user: Users;
  doctorHours: DoctorHours[];
  rates: Rates;
  chatRequests: ChatRequests[];
  specialties: DoctorSpecialties[];
  medical_license_number: number;
  consultation_fee: number;
  bio: string;
}
