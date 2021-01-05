import React, { CSSProperties, useState } from 'react';
import { Alert, Button, Card, Form, Input, Space } from 'antd';
import axios from 'axios';
import { LoginResponse } from '../lib/types';
import { useHistory } from 'react-router';
import { ErrorTypes, getError } from '../lib/error-lookup';
import useUser from '../lib/data/use-user';
import logo from '../assets/VallurX Logo Light Transparent.png';

interface LoginForm {
    email: string;
    password: string;
}

const LoginFormStyles: CSSProperties = {
    width: '40%',
    margin: 'auto'
};

const Login = () => {
    const history = useHistory();
    const { mutate } = useUser();
    const [error, setError] = useState<ErrorTypes | undefined>();
    const [loading, setLoading] = useState(false);
    const [tfaLoading, setTFALoading] = useState(false);
    const [req2FA, setReq2FA] = useState<string>();

    const onSubmitForm = async (data: LoginForm) => {
        setLoading(true);

        try {
            const loginResponse = await axios.post<LoginResponse>('/api/user/login', data);
            const { id, session_id } = loginResponse.data;
            localStorage.setItem('user_id', id.toString());
            localStorage.setItem('session_id', session_id);
            if (loginResponse.data.status === 'OK') {
                await mutate();
                history.push('/');
            } else {
                setReq2FA(session_id);
            }
        } catch (e) {
            setError(e.response.data.error);
            setLoading(false);
        }
    };

    const finishLogin = async (data: { otp_code: string }) => {
        try {
            await axios.post('/api/user/finish_login', {
                otp_code: data.otp_code.trim(),
                session_id: req2FA
            });

            await mutate();

            setLoading(false);
            history.push('/');
        } catch (e) {
            setError(e.response.data.error);
            setLoading(false);
        }
    };

    const resendAuthCode = async () => {
        setTFALoading(true);

        try {
            await axios.post('/api/user/resend_2fa', { session_id: req2FA });
        } catch (e) {
            setError(e.response.data.error);
            setLoading(false);
        } finally {
            setTimeout(() => {
                setTFALoading(false);
            }, 5000);
        }
    }

    return (
        <div style={LoginFormStyles}>
            {error && (
                <Alert
                    type="error"
                    message="Login Error"
                    description={getError(error)}
                    style={{ marginBottom: 20 }}
                />
            )}

            <Card>
                <div>
                    <img alt="Logo" src={logo} className="logo" />
                </div>

                {req2FA ? (
                    <Form
                        name="2fa"
                        onFinish={finishLogin}
                        layout="vertical"
                    >
                        <Form.Item label="Authentication Code" name="otp_code">
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>

                                <Button onClick={resendAuthCode} loading={tfaLoading}>
                                    Re-Send Code
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form
                        name="login"
                        onFinish={onSubmitForm}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email is required.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Password is required.' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    )
};

export default Login;