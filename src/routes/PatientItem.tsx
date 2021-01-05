import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button, notification, Space, Typography } from 'antd';
import PatientUI from '../components/patient/PatientUI';
import { usePatientApplications } from '../lib/data/use-patient';
import CreateApplicationModal from '../components/application/CreateApplicationModal';

const PatientItem = () => {
    const { id } = useParams<{ id: string }>();
    const { applications } = usePatientApplications(parseInt(id));
    const [visible, setVisible] = useState(false);

    const onCreateApplication = () => {
        setVisible(false);
        notification.success({
            message: 'Success!',
            description: 'You have successfully created an application for this patient.'
        });
    }

    return (
        <>
            <Typography.Title level={2}>Patient View</Typography.Title>

            <CreateApplicationModal patient_id={parseInt(id)} visible={visible} onOk={onCreateApplication} onCancel={() => setVisible(false)} />

            <PatientUI patientId={parseInt(id)} />

            <br />

            <Space>
                <Button type="primary" disabled={applications && applications.length > 0} onClick={() => setVisible(true)}>
                    Create Application
                </Button>
            </Space>
        </>
    )
};

export default PatientItem;