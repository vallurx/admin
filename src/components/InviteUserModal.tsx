import React, { useState } from 'react';
import { Form, Input, Modal, notification } from 'antd';
import { axios } from '../lib/axios';

interface InviteUserForm {
    name: string;
    email: string;
}

interface InviteUserModalProps {
    visible: boolean;
    onFinish: () => void;
}

const InviteUserModal = (props: InviteUserModalProps) => {
    const { visible, onFinish } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const inviteUser = async (data: InviteUserForm) => {
        setLoading(true);

        try {
            await axios.put('/api/user/invite', data);

            notification.success({
                message: 'Success!',
                description: 'You have successfully invited a user. Please ask them to check their email for further instructions.'
            });

            onFinish();
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error inviting a user.'
            });
        }
    };

    const cancel = () => {
        form.resetFields();
        onFinish();
    };

    return (
        <Modal
            title="Invite New User"
            visible={visible}
            onOk={form.submit}
            onCancel={cancel}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={inviteUser}
            >
                <Form.Item label="Name" name="name" rules={[{required: true}]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{required: true}, {type: 'email', message: 'Must be a valid email.'}]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default InviteUserModal;