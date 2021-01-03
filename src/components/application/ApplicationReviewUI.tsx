import React from 'react';
import { Button, Form, Input, Radio } from 'antd';

interface ReviewForm {
    status: string;
    notes: string;
}

interface ApplicationReviewProps {
    initialValues: ReviewForm;
    onSubmit: (data: ReviewForm) => void;
}

const ApplicationReviewUI = (props: ApplicationReviewProps) => {
    const { initialValues, onSubmit } = props;

    return (
        <Form layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
            <Form.Item label="Decision" name="status">
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="AwaitingApproval" disabled>Pending</Radio.Button>
                    <Radio.Button value="Scheduling">Approved</Radio.Button>
                    <Radio.Button value="Rejected">Rejected</Radio.Button>
                    <Radio.Button value="InformationNeeded">Information Needed</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="Notes" name="notes">
                <Input.TextArea rows={10} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    )
};

export default ApplicationReviewUI;