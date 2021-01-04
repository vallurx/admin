import React from 'react';
import { Descriptions, Skeleton } from 'antd';
import { usePatient } from '../../lib/data/use-patient';

interface PatientUIProps {
    patientId: number;
}

const PatientUI = (props: PatientUIProps) => {
    const { patientId } = props;
    const { patient } = usePatient(patientId);

    if (!patient) {
        return <Skeleton active />
    }
    
    return (
        <>
            <Descriptions title="Patient Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="First Name">
                    {patient.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Middle Initial">
                    {patient.middle_initial}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                    {patient.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Suffix">
                    {patient.suffix}
                </Descriptions.Item>
                <Descriptions.Item label="Sex">
                    {patient.sex}
                </Descriptions.Item>
                <Descriptions.Item label="Race">
                    {patient.race}
                </Descriptions.Item>
                <Descriptions.Item label="Ethnicity">
                    {patient.ethnicity}
                </Descriptions.Item>
                <Descriptions.Item label="Employer">
                    {patient.employer}
                </Descriptions.Item>
            </Descriptions>

            <br />

            <Descriptions title="Contact Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Email">
                    {patient.email}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                    {patient.date_of_birth}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                    {patient.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="County">
                    {patient.address_county}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                    {patient.address_street}<br />
                    {patient.address_city}, {patient.address_state} {patient.address_zip}
                </Descriptions.Item>
            </Descriptions>

            <br />

            <Descriptions title="Insurance Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                {patient.insurance_name && (
                    <>
                        <Descriptions.Item label="Insurance Name">
                            {patient.insurance_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Insurance Holder Name">
                            {patient.insurance_holder_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Insurance Holder Relationship">
                            {patient.insurance_holder_relationship}
                        </Descriptions.Item>
                        <Descriptions.Item label="Policy Number">
                            {patient.insurance_policy}
                        </Descriptions.Item>
                        <Descriptions.Item label="Group Number">
                            {patient.insurance_group}
                        </Descriptions.Item>
                        <Descriptions.Item label="Insurance Phone">
                            {patient.insurance_phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Insurance Address">
                            {patient.insurance_address_street}<br />
                            {patient.insurance_address_city}, {patient.insurance_address_state} {patient.insurance_address_zip}
                        </Descriptions.Item>
                    </>
                )}

                {patient.ssn && (
                    <Descriptions.Item label="SSN (Last 4 Digits)">
                        {patient.ssn}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </>
    )
};

export default PatientUI;