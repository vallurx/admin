import React, { useState } from 'react';
import { Form, Input, InputNumber, Modal, notification, Select } from 'antd';
import { axios } from '../lib/axios';

interface NewVaccineShipmentModalProps {
    visible: boolean;
    onOk: () => void;
    onCancel: () => void;
}

interface NewVaccineShipment {
    name: string;
    vaccine_count: number;
    manufacturer: string;
}

const NewVaccineShipmentModal = (props: NewVaccineShipmentModalProps) => {
    const { visible, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const createVaccineShipment = async (data: NewVaccineShipment) => {
        setLoading(true);

        try {
            await axios.put('/api/facilities/1/vaccine_shipments', data);
            form.resetFields();
            setLoading(false);
            onOk();
        } catch (e) {
            notification.error({
                message: 'Un oh!',
                description: 'There was an error creating a shipment. Please contact VallurX.'
            });
        }
    }

    return (
        <Modal
            title="New Vaccine Shipment"
            visible={visible}
            onOk={form.submit}
            confirmLoading={loading}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={createVaccineShipment}
            >
                <Form.Item name="name" label="Shipment Name/Number" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="vaccine_count" label="Number of Vaccines" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>

                <Form.Item name="manufacturer" label="Vaccine Manufacturer" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="MOD">Moderna</Select.Option>
                        <Select.Option value="PFR">Pfizer</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default NewVaccineShipmentModal;