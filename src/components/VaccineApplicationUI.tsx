import React, { useState } from 'react';
import { Application } from '../types';
import { Button, Descriptions, Divider } from 'antd';
import { getAnswerToQuestion } from '../lib/screening-questions';
import EditApplicationModal from './EditApplicationModal';

interface VaccineApplicationUIProps {
    application: Application;
    editable?: boolean;
    onEdit?: () => void;
}

const VaccineApplicationUI = (props: VaccineApplicationUIProps) => {
    const { application, onEdit, editable } = props;
    const [visible, setVisible] = useState(false);

    const onFinish = () => {
        setVisible(false);

        if (onEdit) {
            onEdit();
        }
    }

    return (
        <>
            <EditApplicationModal visible={visible} application={application} onOk={onFinish} onCancel={onFinish} />

            {editable && (
                <Button type="primary" onClick={() => setVisible(true)}>
                    Edit Application
                </Button>
            )}

            <Divider />

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
                <Descriptions.Item label="Suffix">
                    {application.suffix}
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

            <Descriptions title="Insurance Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Insurance Name">
                    {application.insurance_name}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Holder Name">
                    {application.insurance_holder_name}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Holder Relationship">
                    {application.insurance_holder_relationship}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Policy">
                    {application.insurance_policy}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Group">
                    {application.insurance_group}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Phone">
                    {application.insurance_phone}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance Address">
                    {application.insurance_address_street}<br />
                    {application.insurance_address_city}, {application.insurance_address_state} {application.insurance_address_zip}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {Array.isArray(application.screening_questions) && (
                <Descriptions title="Screening Questions" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    {application.screening_questions.map(question => (
                        <Descriptions.Item key={question.id} label={question.question} contentStyle={{width: 100}}>
                            {getAnswerToQuestion(question.answer)}. {question?.details}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}
        </>
    );
};

export default VaccineApplicationUI;