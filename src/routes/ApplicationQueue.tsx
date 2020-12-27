import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    notification, Radio,
    Result,
    Row,
    Skeleton,
    Typography
} from 'antd';
import React, { useState } from 'react';
import { useQueuedApplication } from '../lib/data/use-application';
import { axios } from '../lib/axios';
import VaccineApplicationUI from '../components/VaccineApplicationUI';

type AppStatus = 'Scheduling' | 'Rejected' | 'AwaitingApproval' | 'InformationNeeded';

const ApplicationQueue = () => {
    const [appStatus, setAppStatus] = useState<AppStatus>('AwaitingApproval');
    const [appNotes, setAppNotes] = useState('');
    const { application, mutateList, endOfQueue } = useQueuedApplication();

    const reviewApplication = async () => {
        if (appStatus === 'AwaitingApproval') {
            notification.error({
                message: 'Hold on!',
                description: 'You must make a decision. If you are unsure, select Information Needed.'
            });

            return;
        }

        try {
            await axios.post(`/api/facilities/1/application/${application?.id}`, {
                status: appStatus,
                notes: appNotes
            });

            notification.success({
                message: 'Success!',
                description: 'Successfully reviewed vaccine application! Moving to next in queue...'
            });

            setAppStatus('AwaitingApproval');
            setAppNotes('');

            await mutateList();
        } catch (e) {
            notification.error({
                message: 'Un oh!',
                description: 'There was an error reviewing this application. Please contact VallurX.'
            });
        }
    }

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

            <VaccineApplicationUI application={application} />

            <Divider>Review</Divider>

            <Row>
                <Col span={16} offset={4}>
                    <Form layout="vertical">
                        <Form.Item label="Decision">
                            <Radio.Group value={appStatus} onChange={e => setAppStatus(e.target.value)} buttonStyle="solid">
                                <Radio.Button value="AwaitingApproval" disabled>Pending</Radio.Button>
                                <Radio.Button value="Scheduling">Approved</Radio.Button>
                                <Radio.Button value="Rejected">Rejected</Radio.Button>
                                <Radio.Button value="InformationNeeded">Information Needed</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Notes">
                            <Input.TextArea value={appNotes} onChange={e => setAppNotes(e.target.value)} rows={10} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={reviewApplication}>Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ApplicationQueue;