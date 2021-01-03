import {
    Col,
    Divider,
    notification,
    Result,
    Row,
    Skeleton,
    Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useQueuedApplication } from '../lib/data/use-application';
import { axios } from '../lib/axios';
import ApplicationReviewUI from '../components/application/ApplicationReviewUI';
import PatientUI from '../components/patient/PatientUI';
import PatientApplicationUI from '../components/application/PatientApplicationUI';

const ApplicationQueue = () => {
    const { application, mutateList, endOfQueue } = useQueuedApplication();
    const [reviewData, setReviewData] = useState({
        notes: '',
        status: 'AwaitingApproval'
    });

    const reviewApplication = async (data: { notes: string, status: string }) => {
        if (data.status === 'AwaitingApproval') {
            notification.error({
                message: 'Hold on!',
                description: 'You must make a decision. If you are unsure, select Information Needed.'
            });

            return;
        }

        try {
            await axios.post(`/api/applications/${application?.id}`, data);

            notification.success({
                message: 'Success!',
                description: 'Successfully reviewed vaccine application! Moving to next in queue...'
            });

            await mutateList();
        } catch (e) {
            notification.error({
                message: 'Un oh!',
                description: 'There was an error reviewing this application. Please contact VallurX.'
            });
        }
    };

    useEffect(() => {
        if (application) {
            setReviewData({
                notes: application.notes,
                status: application.status
            });
        }
    }, [application]);

    if (endOfQueue) {
        return (
            <Result status="success" title="You have reached the end of the queue!" />
        );
    }

    if (!application) {
        return <Skeleton active />;
    }

    return (
        <>
            <Typography.Title level={2}>Application Queue</Typography.Title>

            <PatientUI patientId={application.patient_id} />

            <Divider />

            <PatientApplicationUI applicationId={application.id} />

            <br />

            <Divider>Review</Divider>

            <Row>
                <Col span={16} offset={4}>
                    <ApplicationReviewUI initialValues={reviewData} onSubmit={reviewApplication} />
                </Col>
            </Row>
        </>
    );
};

export default ApplicationQueue;