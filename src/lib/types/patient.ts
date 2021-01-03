export interface PatientListResponse {
    total: number;
    items: PatientListItem[];
}

export interface PatientListItem {
    id: number;
    created_at: number;
    first_name: string;
    middle_initial: string;
    last_name: string;
    suffix: string;
    date_of_birth: string;
    phone_number: string;
}

export interface Patient extends PatientListItem {
    is_mobile: boolean;
    sex: string;
    email: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    address_county: string;
    race: string;
    ethnicity: string;
    employer: string;
    insurance_name: string;
    insurance_holder_name: string;
    insurance_holder_relationship: string;
    insurance_policy: string;
    insurance_group: string;
    insurance_phone: string;
    insurance_address_street: string;
    insurance_address_city: string;
    insurance_address_state: string;
    insurance_address_zip: string;
    ssn: string;
    notes: string;
}