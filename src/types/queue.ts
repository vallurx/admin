export interface ApprovalListItem {
    id: number;
    created_at: number;
    first_name: string;
    middle_initial: string;
    last_name: string;
    date_of_birth: string;
    employer: string;
}

export interface ApprovalListResults {
    items: ApprovalListItem[];
    total: number;
}

export interface Approval {
    id: number,
    facility_id: number,
    vaccine_batch_id: number,
    schedule_block_id: number,
    first_name: string,
    middle_initial: string,
    last_name: string,
    date_of_birth: string,
    phone_number: string,
    sex: string,
    email: string,
    address_street: string,
    address_city: string,
    address_state: string,
    address_zip: string,
    county: string,
    race: string,
    ethnicity: string,
    guardian_name: string,
    signature_typed: string,
    signature_date: string,
    signature_print: string,
    signature_relationship: string,
    target_populations: string,
    screening_questions: [number, boolean | null][] | null,
    created_at: number,
    employer: string,
    status: string,
    notes: string,
}