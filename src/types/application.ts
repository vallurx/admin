export interface ApplicationListItem {
    id: number;
    created_at: number;
    first_name: string;
    middle_initial: string;
    last_name: string;
    date_of_birth: string;
    employer: string;
}

export interface ApplicationListResults {
    items: ApplicationListItem[];
    total: number;
}

export interface Application {
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
    suffix: string,
    insurance_name: string,
    insurance_holder_name: string,
    insurance_holder_relationship: string,
    insurance_policy: string,
    insurance_group: string,
    insurance_phone: string,
    insurance_address_street: string,
    insurance_address_city: string,
    insurance_address_state: string,
    insurance_address_zip: string,
    notes: string,
}



export interface ApplicationResult {
    cvx_vaccine_code: string;
    cpt_vaccine_code: string;
    lot_number: string;
    /*
        Intradermal = ID
        Intramuscular = IM
        Intravenous = IV
        Nasal = NS
        Oral = O
        Other Miscellaneous = OTH
        Subcutaneous = SC
        Transdermal = TD
     */
    anatomical_route: string;
    /*
        Left Arm = LA
        Left Thigh = LT
        Left Deltoid = LD
        Left Gluteus Medius = LG
        Left Vastua Lateralis = LVL
        Left Lower Forearm = LLFA
        Right Arm = RA
        Right Thigh = RT
        Right Vastua Lateralis = RVL
        Right Gluteus Medius = RG
        Right Deltoid = RD
        Right Lower Forearm = RLFA
     */
    anatomical_site: string;
    dose_size: string;
    manufacturer: string;
    notes: string;
}