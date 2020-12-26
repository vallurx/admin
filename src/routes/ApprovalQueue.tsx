import {
    Button,
    Col,
    Descriptions,
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
import { useQueuedApproval } from '../lib/data/use-approval';
import { getAnswerToQuestion, screeningQuestions } from '../lib/screening-questions';
import { axios } from '../lib/axios';

type AppStatus = 'Scheduling' | 'Rejected' | 'AwaitingApproval' | 'InformationNeeded';

const ApprovalQueue = () => {
    const [appStatus, setAppStatus] = useState<AppStatus>('AwaitingApproval');
    const [appNotes, setAppNotes] = useState('');
    const { approval, mutateList, params, endOfQueue } = useQueuedApproval();

    const reviewApplication = async () => {
        if (appStatus === 'AwaitingApproval') {
            notification.error({
                message: 'Hold on!',
                description: 'You must make a decision. If you are unsure, select Information Needed.'
            });

            return;
        }

        try {
            await axios.post(`/api/facilities/${params.facilityId}/approval/${approval?.id}`, {
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
            console.error(e);
        }
    }

    if (endOfQueue) {
        return (
            <Result status="success" title="You have reached the end of the queue!" />
        );
    }

    if (!approval) {
        return <Skeleton active />;
    }

    return (
        <>
            <Typography.Title level={2}>Application Queue</Typography.Title>

            <Descriptions title="Vaccine Application" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="First Name">
                    {approval.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Middle Initial">
                    {approval.middle_initial}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                    {approval.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Sex">
                    {approval.sex}
                </Descriptions.Item>
                <Descriptions.Item label="Race">
                    {approval.race}
                </Descriptions.Item>
                <Descriptions.Item label="Ethnicity">
                    {approval.ethnicity}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian Name">
                    {approval.guardian_name}
                </Descriptions.Item>
                <Descriptions.Item label="Employer">
                    {approval.employer}
                </Descriptions.Item>
                <Descriptions.Item label="Target Population">
                    {approval.target_populations}
                </Descriptions.Item>
            </Descriptions>

            <br />

            <Descriptions title="Contact Information" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Email">
                    {approval.email}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                    {approval.date_of_birth}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                    {approval.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="County">
                    {approval.county}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                    {approval.address_street}<br />
                    {approval.address_city}, {approval.address_state} {approval.address_zip}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {Array.isArray(approval.screening_questions) && (
                <Descriptions title="Screening Questions" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    {approval.screening_questions.map(question => (
                        <Descriptions.Item key={question[0]} label={screeningQuestions[question[0]]} contentStyle={{width: 100}}>
                            {getAnswerToQuestion(question[1])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}

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

export default ApprovalQueue;