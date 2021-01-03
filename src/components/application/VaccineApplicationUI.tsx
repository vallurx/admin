import React, { useState } from 'react';
import { Application } from '../../lib/types';
import { Button, Descriptions, Divider } from 'antd';
import { getAnswerToQuestion } from '../../lib/screening-questions';
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

            <Descriptions title="Vaccine Application">

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