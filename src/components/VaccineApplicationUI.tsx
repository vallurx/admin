import React from 'react';
import { Application } from '../types';
import { Descriptions } from 'antd';
import { getAnswerToQuestion, screeningQuestions } from '../lib/screening-questions';

interface VaccineApplicationUIProps {
    application: Application;
}

const VaccineApplicationUI = (props: VaccineApplicationUIProps) => {
    const { application } = props;

    return (
        <>
            <Descriptions title="Vaccine Application" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="First Name">
                    {application.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Middle Initial">
                    {application.middle_initial}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                    {application.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Sex">
                    {application.sex}
                </Descriptions.Item>
                <Descriptions.Item label="Race">
                    {application.race}
                </Descriptions.Item>
                <Descriptions.Item label="Ethnicity">
                    {application.ethnicity}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian Name">
                    {application.guardian_name}
                </Descriptions.Item>
                <Descriptions.Item label="Employer">
                    {application.employer}
                </Descriptions.Item>
                <Descriptions.Item label="Target Population">
                    {application.target_populations}
                </Descriptions.Item>
            </Descriptions>

            <br />

            <Descriptions title="Contact Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Email">
                    {application.email}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                    {application.date_of_birth}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                    {application.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="County">
                    {application.county}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                    {application.address_street}<br />
                    {application.address_city}, {application.address_state} {application.address_zip}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {Array.isArray(application.screening_questions) && (
                <Descriptions title="Screening Questions" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    {application.screening_questions.map(question => (
                        <Descriptions.Item key={question[0]} label={screeningQuestions[question[0]]} contentStyle={{width: 100}}>
                            {getAnswerToQuestion(question[1])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}
        </>
    );
};

export default VaccineApplicationUI;