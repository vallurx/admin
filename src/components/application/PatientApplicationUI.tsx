import { Card, Col, Descriptions, Image, Popover, Row, Skeleton, Typography } from 'antd';
import React from 'react';
import { getAnswerToQuestion } from '../../lib/screening-questions';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useScheduleBlock } from '../../lib/data/use-vaccines';
import { useApplication } from '../../lib/data/use-application';

interface PatientApplicationUIProps {
    applicationId: number;
}

const PatientApplicationUI = (props: PatientApplicationUIProps) => {
    const { applicationId } = props;
    const { application } = useApplication(applicationId);
    const { scheduleBlock } = useScheduleBlock(application?.schedule_block_id);


    const vaccines = useSelector((state: RootState) => state.vaccine);
    const vaccine = vaccines.find(v => v.id === application?.vaccine_id);
    const dose = vaccine?.doses.find(d => d.id === application?.vaccine_dose_id);

    if (!application) {
        return <Skeleton active />
    }

    return (
        <>
            <Row gutter={8}>
                <Col span={20}>
                    <Descriptions title="Application" bordered column={2}>
                        <Descriptions.Item label="Target Population">
                            {application.target_populations || 'N/A'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Guardian Name">
                            {application.guardian_name}
                        </Descriptions.Item>

                        <Descriptions.Item label="Signature Typed">
                            {application.signature_typed}
                        </Descriptions.Item>

                        <Descriptions.Item label="Signature Print">
                            {application.signature_print}
                        </Descriptions.Item>

                        <Descriptions.Item label="Signature Date">
                            {application.signature_date}
                        </Descriptions.Item>

                        <Descriptions.Item label="Signature Relationship">
                            {application.signature_relationship}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>

                <Col span={4}>
                    <Card cover={<Image src={application.work_id_image_url} style={{border: '1px solid #f0f0f0', cursor: 'pointer'}} />}>
                        <Card.Meta title="Work ID" />
                    </Card>
                </Col>
            </Row>

            <br />

            {Array.isArray(application.screening_questions) && (
                <>
                    <Descriptions title="Screening Questions" bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        {application.screening_questions.map(question => (
                            <Descriptions.Item key={question.id} label={question.question} contentStyle={{width: 'max(100px, 25%)'}}>
                                {getAnswerToQuestion(question.answer)}. {question?.details}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>

                    <br />
                </>
            )}

            <br />

            {vaccine && dose && (
                <>
                    <Descriptions title="Vaccine Dose" bordered column={2}>
                        <Descriptions.Item label="Vaccine Name">
                            <Popover
                                content={(
                                    <>
                                        <Typography.Paragraph>{vaccine.description}</Typography.Paragraph>

                                        <b>Manufacturer</b> {vaccine.manufacturer.name} <br />
                                        <b>CPT Code</b> {vaccine.cpt_code} <br />
                                        <b>CVX Code</b> {vaccine.cvx_code}
                                    </>
                                )}
                                title={`Vaccine Information`}
                            >
                                {vaccine.manufacturer.name} - {vaccine.name}
                            </Popover>
                        </Descriptions.Item>

                        <Descriptions.Item label="Fact Sheet">
                            <a href={vaccine.fact_sheet} target="_blank" rel="noreferrer">Fact Sheet</a>
                        </Descriptions.Item>

                        <Descriptions.Item label="Applied For Dose">
                            Dose {dose.index + 1}
                        </Descriptions.Item>

                        {application.results && (
                            <Descriptions.Item label="Lot Number">
                                Lot {application.results.lot_number}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    <br />
                </>
            )}

            {scheduleBlock && (
                <>
                    <Descriptions title="Scheduling Information" bordered>
                        <Descriptions.Item label="Time Slot">
                            {dayjs(scheduleBlock.start_at).format('LLL')}
                        </Descriptions.Item>

                        <Descriptions.Item label="Appointment Duration">
                            {(scheduleBlock.end_at - scheduleBlock.start_at) / 1000 / 60} minutes
                        </Descriptions.Item>
                    </Descriptions>

                    <br />
                </>
            )}

            {application.results && (
                <Row gutter={8}>
                    <Col span={20}>
                        <Descriptions title="Vaccine Results" bordered column={2}>
                            <Descriptions.Item label="Administered At">
                                {dayjs(application.results.administered_at).format('LLL')}
                            </Descriptions.Item>

                            <Descriptions.Item label="Anatomical Route">
                                {application.results.anatomical_route}
                            </Descriptions.Item>

                            <Descriptions.Item label="Anatomical Site">
                                {application.results.anatomical_site}
                            </Descriptions.Item>

                            <Descriptions.Item label="Dose Size">
                                {application.results.dose_size}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>

                    <Col span={4}>
                        <Card cover={<Image src={application.results.signature_url} style={{border: '1px solid #f0f0f0', cursor: 'pointer'}} />}>
                            <Card.Meta title="Nurse Signature" />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    )
};

export default PatientApplicationUI;