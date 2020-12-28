import React, { CSSProperties, useState } from 'react';
import { Alert, Button, Card, Form, Input } from 'antd';
import axios from 'axios';
import { LoginResponse } from '../types';
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

    const onSubmitForm = async (data: LoginForm) => {
        setLoading(true);

        try {
            const loginResponse = await axios.post<LoginResponse>('/api/login', data);
            const { id, session_id } = loginResponse.data;

            localStorage.setItem('user_id', id.toString());
            localStorage.setItem('session_id', session_id);

            await mutate();

            setLoading(false);
            history.push('/');
        } catch (e) {
            setError(e.response.data.error);
            setLoading(false);
        }
    };

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
            </Card>
        </div>
    )
};

export default Login;