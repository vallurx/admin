import React, { useEffect, useState } from 'react';
import { Patient } from '../../lib/types';
import { AutoComplete, Col, Divider, Form, Input, Modal, notification, Row, Select, Tabs } from 'antd';
import { axios } from '../../lib/axios';
import { DatePicker } from '../dayjs';
import { states } from '../../lib/static-lists';
import dayjs from 'dayjs';

interface EditPatientModalProps {
    visible: boolean;
    patient: Patient;
    onOk: () => void;
    onCancel: () => void;
}

const EditPatientModal = (props: EditPatientModalProps) => {
    const { visible, patient, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const editPatient = async (data: any) => {
        setLoading(true);
        
        try {
            await axios.post(`/api/admin/patients/${patient.id}`, {
                ...data,
                is_mobile: data.is_mobile === 'yes'
            });

            onOk();
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error updating this patient.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const editablePatient: any = Object.assign({}, {
            ...patient,
            ssn: '',
            is_mobile: patient.is_mobile ? 'yes' : 'no'
        });

        delete editablePatient.ssn4;
        delete editablePatient.notes;

        form.setFieldsValue(editablePatient);
    }, [form, patient]);
    
    return (
        <Modal
            title="Editing Patient"
            visible={visible}
            width="80%"
            confirmLoading={loading}
            onOk={form.submit}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={editPatient}
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
                                <Form.Item name="suffix" label="Suffix">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item name="date_of_birth" label="Date of Birth" rules={[{required: true}]}>
                                    <DatePicker style={{width: '100%'}} format="M/D/YYYY" placeholder={dayjs().format("M/D/YYYY")} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="phone_number"
                                    label="Phone Number"
                                    rules={[
                                        {required: true, message: 'Required'},
                                        {pattern: /^(\d{3})-?(\d{3})-?(\d{4})$/, message: 'Must be a valid phone number!'}
                                    ]}
                                >
                                    <Input
                                        addonBefore={(
                                            <Form.Item name="is_mobile" noStyle rules={[{required: true, message: 'Required'}]}>
                                                <Select style={{ width: 120 }}>
                                                    <Select.Option value="yes">Mobile</Select.Option>
                                                    <Select.Option value="no">Home</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        )}
                                    />
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
                                <Form.Item name="insurance_policy" label="Policy Number">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="insurance_group" label="Group Number">
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

                        <Divider>Or</Divider>

                        <div style={{width: '50%', margin: 'auto'}}>
                            <Form.Item
                                name="ssn"
                                label="Social Security Number"
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </Modal>
    )
};

export default EditPatientModal;