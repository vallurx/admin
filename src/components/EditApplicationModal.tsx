import React, { useState } from 'react';
import { Application } from '../types';
import { AutoComplete, Col, Divider, Form, Input, Modal, notification, Radio, Row, Select, Tabs } from 'antd';
import pick from 'lodash/pick';
import { axios } from '../lib/axios';
import { DatePicker } from './dayjs';
import dayjs from 'dayjs';
import { screeningQuestions, states } from '../lib/static-lists';

interface EditApplicationModalProps {
    visible: boolean;
    application: Application;
    onOk: () => void;
    onCancel: () => void;
}

const editableFields: (keyof Application)[] = [
    'first_name',
    'last_name',
    'middle_initial',
    'date_of_birth',
    'phone_number',
    'sex',
    'email',
    'address_city',
    'address_state',
    'address_street',
    'address_zip',
    'county',
    'race',
    'ethnicity',
    'guardian_name',
    'employer',
    'suffix',
    'target_populations',
    'insurance_address_city',
    'insurance_address_state',
    'insurance_address_street',
    'insurance_address_zip',
    'insurance_group',
    'insurance_holder_name',
    'insurance_holder_relationship',
    'insurance_name',
    'insurance_phone',
    'insurance_policy'
]

const EditApplicationModal = (props: EditApplicationModalProps) => {
    const { visible, application, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const editApplication = async (data: any) => {
        setLoading(true);
        
        try {
            const normalFormData: Partial<Application> = pick(data, editableFields);
            const screeningFormData = screeningQuestions.map((q, i) => {
                const questionAnswer = data['screening_question_' + i];
                const questionDetails = data['screening_details_' + i];

                return {
                    id: i + 1,
                    answer: questionAnswer,
                    details: questionDetails
                };
            });

            await axios.post(`/api/facilities/1/application/${application.id}`, {
                ...normalFormData,
                date_of_birth: dayjs(data.date_of_birth).format('MM/DD/YYYY'),
                screening_questions: screeningFormData,
                status: application.status,
                notes: application.notes
            });
            onOk();
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error updating this application.'
            });
        } finally {
            setLoading(false);
        }
    };

    const formQuestions = screeningQuestions.map((q, i) => ({
        [`screening_question_${i}`]: application.screening_questions ? application.screening_questions.find(q => q.id === i + 1)?.answer : false
    }));

    const formDetails = screeningQuestions.map((q, i) => ({
        [`screening_details_${i}`]: application.screening_questions ? application.screening_questions.find(q => q.id === i + 1)?.details : ''
    }));

    const initialFormValues = Object.assign({
        ...pick(application, editableFields),
        date_of_birth: dayjs(application.date_of_birth)
    }, ...formQuestions, ...formDetails);
    
    return (
        <Modal
            title="Editing Application"
            visible={visible}
            width="80%"
            confirmLoading={loading}
            onOk={form.submit}
            onCancel={onCancel}
        >
            <Form
                form={form}
                initialValues={initialFormValues}
                layout="vertical"
                onFinish={editApplication}
            >
                <Tabs>
                    <Tabs.TabPane tab="Patient Information" key="1">
                        <Row gutter={8}>
                            <Col span={6}>
                                <Form.Item name="first_name" label="First Name" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="middle_initial" label="Middle Initial">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="last_name" label="Last Name" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="suffix" label="Suffix" help="Required if you are a healthcare worker.">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="date_of_birth" label="Date of Birth" rules={[{required: true}]}>
                                    <DatePicker style={{width: '100%'}} format="MM/DD/YYYY" />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="phone_number"
                                    label="Phone Number"
                                    rules={[
                                        {required: true},
                                        {pattern: /^(\d{3})-?(\d{3})-?(\d{4})$/, message: 'Must be a valid phone number!'}
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="email" label="Email" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="sex" label="Sex" rules={[{required: true}]}>
                                    <AutoComplete
                                        options={[
                                            { label: 'Male', value: 'male' },
                                            { label: 'Female', value: 'female' },
                                            { label: 'Transgender', value: 'transgender' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="race" label="Race" rules={[{required: true}]}>
                                    <AutoComplete
                                        options={[
                                            { label: 'American Indian', value: 'american_indian' },
                                            { label: 'Asian', value: 'asian' },
                                            { label: 'Black', value: 'black' },
                                            { label: 'Pacific Islander', value: 'pacific_islander' },
                                            { label: 'White', value: 'white' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="ethnicity" label="Ethnicity" rules={[{required: true}]}>
                                    <Select>
                                        <Select.Option value="non-hispanic">Non-Hispanic</Select.Option>
                                        <Select.Option value="hispanic">Hispanic</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8} wrap>
                            <Col span={8}>
                                <Form.Item name="address_street" label="Street Address" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_city" label="City" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_state" label="State" rules={[{required: true}]}>
                                    <Select>
                                        {states.map(state => (
                                            <Select.Option key={state.abbreviation} value={state.abbreviation}>{state.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="address_zip" label="Zip" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="county" label="County" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item name="employer" label="Employer" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="guardian_name" label="Parent/Guardian">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={24}>
                                <Form.Item name="target_populations" label="Target Populations" rules={[{required: true}]}>
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
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Patient Insurance" key="2">
                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="insurance_name" label="Insurance Name">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="insurance_holder_name" label="Insurance Holder Name">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="insurance_holder_relationship" label="Insurance Holder Relationship">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="insurance_policy" label="Insurance Policy">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="insurance_group" label="Insurance Group">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="insurance_phone" label="Insurance Phone">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={6}>
                                <Form.Item name="insurance_address_street" label="Street Address">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="insurance_address_city" label="City">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="insurance_address_state" label="State">
                                    <Select>
                                        {states.map(state => (
                                            <Select.Option key={state.abbreviation} value={state.abbreviation}>{state.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="insurance_address_zip" label="Zip">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Screening Questions" key="3">
                        {screeningQuestions.map((question, i) => (
                            <div key={i}>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Form.Item name={`screening_question_${i}`} label={screeningQuestions[i].question}>
                                            <Radio.Group>
                                                <Radio value={true}>Yes</Radio>
                                                <Radio value={false}>No</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={`screening_details_${i}`} label="Details">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider />
                            </div>
                        ))}
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </Modal>
    )
};

export default EditApplicationModal;