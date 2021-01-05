import React, { useState } from 'react';
import { Col, Divider, Form, Input, Modal, notification, Radio, Row, Select } from 'antd';
import { axios } from '../../lib/axios';
import { screeningQuestions } from '../../lib/static-lists';
import dayjs from 'dayjs';

interface CreateApplicationModalProps {
    patient_id: number;
    visible: boolean;
    onOk: () => void;
    onCancel: () => void;
}

const CreateApplicationModal = (props: CreateApplicationModalProps) => {
    const { patient_id, visible, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const createApplication = async (data: any) => {
        setLoading(true);
        
        try {
            const screeningFormData = screeningQuestions.map((q, i) => {
                const questionAnswer = data['screening_question_' + i];
                const questionDetails = data['screening_details_' + i] || '';

                return {
                    id: i + 1,
                    answer: questionAnswer,
                    details: questionDetails
                };
            });

            await axios.put(`/api/applications`, {
                facility_id: 1,
                patient_id,
                target_populations: data.target_populations,
                screening_questions: screeningFormData,
                guardian_name: '',
                signature_name: '',
                signature_date: dayjs().format('M/D/YYYY'),
                print_name: '',
                relationship: '',
                notes: ''
            });

            onOk();
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error creating this application.'
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Modal
            title="Create Application"
            forceRender
            visible={visible}
            width="80%"
            confirmLoading={loading}
            onOk={form.submit}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={createApplication}
            >
                {screeningQuestions.map((question, i) => (
                    <div key={i}>
                        <Row gutter={8}>
                            <Col span={16}>
                                <Form.Item name={`screening_question_${i}`} label={screeningQuestions[i].question} shouldUpdate={true} rules={[{required: true, message: 'Required'}]}>
                                    <Radio.Group>
                                        <Radio value={true}>Yes</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item shouldUpdate>
                                    {() => {
                                        return (
                                            <Form.Item name={`screening_details_${i}`} label="Details">
                                                <Input disabled={!form.getFieldValue(`screening_question_${i}`)} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />
                    </div>
                ))}

                <Row>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <Form.Item name="target_populations" label="Target Population" rules={[{required: true, message: 'Required'}]}>
                            <Select>
                                <Select.Option value="Assisted Living Facility - Resident">
                                    Assisted Living Facility - Resident
                                </Select.Option>
                                <Select.Option value="Assisted Living Facility – Staff">
                                    Assisted Living Facility – Staff
                                </Select.Option>
                                <Select.Option value="Skilled Nursing Facility (RCF) – Resident">
                                    Skilled Nursing Facility (RCF) – Resident
                                </Select.Option>
                                <Select.Option value="Skilled Nursing Facility (RCF) – Staff">
                                    Skilled Nursing Facility (RCF) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Dev. Disabilities (DODD) – Resident">
                                    State of Ohio Dept. of Dev. Disabilities (DODD) – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Dev. Disabilities (DODD) – Staff">
                                    State of Ohio Dept. of Dev. Disabilities (DODD) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Veterans Home – Resident">
                                    State of Ohio Veterans Home – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Veterans Home – Staff">
                                    State of Ohio Veterans Home – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Mental Health and Addiction Services (MHAS) – Resident">
                                    State of Ohio Mental Health and Addiction Services (MHAS) – Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Mental Health and Addiction Services (MHAS) – Staff">
                                    State of Ohio Mental Health and Addiction Services (MHAS) – Staff
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Resident">
                                    State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Resident
                                </Select.Option>
                                <Select.Option value="State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Staff">
                                    State of Ohio Dept. of Rehabilitation &amp; Correction – LTC Staff
                                </Select.Option>
                                <Select.Option value="Congregate Care Facility – Resident">
                                    Congregate Care Facility – Resident
                                </Select.Option>
                                <Select.Option value="Congregate Care Facility – Staff">
                                    Congregate Care Facility – Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Clinical Staff">
                                    Hospital Worker – Clinical Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Administrative Staff">
                                    Hospital Worker – Administrative Staff
                                </Select.Option>
                                <Select.Option value="Hospital Worker – Ancillary Staff">
                                    Hospital Worker – Ancillary Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Administrative Staff">
                                    Non-Hospital Healthcare Worker – Administrative Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Ancillary Staff">
                                    Non-Hospital Healthcare Worker – Ancillary Staff
                                </Select.Option>
                                <Select.Option value="Non-Hospital Healthcare Worker – Clinical Staff">
                                    Non-Hospital Healthcare Worker – Clinical Staff
                                </Select.Option>
                                <Select.Option value="Emergency Medical Services (EMTs/Paramedics)">
                                    Emergency Medical Services (EMTs/Paramedics)
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
};

export default CreateApplicationModal;