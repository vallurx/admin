import React, { CSSProperties, useState } from 'react';
import { Button, Card, Form, Input, notification, Typography } from 'antd';
import logo from '../assets/VallurX Logo Light Transparent.png';
import { axios } from '../lib/axios';
import { useHistory } from 'react-router';

const RegisterFormStyles: CSSProperties = {
    width: '40%',
    margin: 'auto'
};

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const RegisterUser = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const onSubmitForm = async (data: { password: string, phone_number: string }) => {
        setLoading(true);

        try {
            await axios.put('/api/user/register', {
                password: data.password,
                phone_number: data.phone_number,
                token
            });

            notification.success({
                message: 'Success!',
                description: 'You have successfully registered an account. Please log in.'
            });

            history.push('/login');
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error processing your registration.'
            });

            setLoading(false);
        }
    };

    const generatePassword = () => {
        const length = 12;
        const lowerCharset = 'abcdefghijklmnopqrstuvwxyz';
        const upperCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberCharset = '0123456789';
        const specialCharset = '@$!%*?&';
        let retVal = '';

        do {
            retVal += lowerCharset.charAt(Math.floor(Math.random() * lowerCharset.length));
            retVal += upperCharset.charAt(Math.floor(Math.random() * upperCharset.length));
            retVal += numberCharset.charAt(Math.floor(Math.random() * numberCharset.length));
            retVal += specialCharset.charAt(Math.floor(Math.random() * specialCharset.length));
        } while (retVal.length < length) {
            const randType = Math.floor(Math.random() * 4);

            switch (randType) {
                case 0:
                    retVal += lowerCharset.charAt(Math.floor(Math.random() * lowerCharset.length))
                    break;
                case 1:
                    retVal += upperCharset.charAt(Math.floor(Math.random() * upperCharset.length));
                    break;
                case 2:
                    retVal += numberCharset.charAt(Math.floor(Math.random() * numberCharset.length));
                    break;
                case 3:
                    retVal += specialCharset.charAt(Math.floor(Math.random() * specialCharset.length));
                    break;
            }
        }

        notification.success({
            message: 'Secure Password',
            description: <span>Your secure password is <code><Typography.Text copyable>{retVal}</Typography.Text></code></span>,
            duration: 10
        });
    }

    if (!token) {
        return (
            <div style={{textAlign: 'center'}}>
                <div>
                    <img alt="Logo" src={logo} className="logo" />
                </div>

                <Typography.Title>Invalid Token</Typography.Title>
                <Typography.Paragraph>There is a problem with the token used for authentication. Please contact VallurX.</Typography.Paragraph>
            </div>
        )
    }

    return (
        <div style={RegisterFormStyles}>
            <Card>
                <div>
                    <img alt="Logo" src={logo} className="logo" />
                </div>

                <Typography.Paragraph style={{textAlign: 'center'}}>You have been invited to join the VallurX Nurse Dashboard.</Typography.Paragraph>

                <Form
                    name="login"
                    onFinish={onSubmitForm}
                    layout="vertical"
                >
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

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Password is required.' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
                                message: 'Password requires a number and special character, and must be at least 12 characters long.'
                            }
                        ]}
                    >
                        <Input.Password size="large" addonAfter={(
                            <Button type="link" onClick={generatePassword}>
                                Generate Password
                            </Button>
                        )} />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item>
                        <br />
                        <Button type="primary" htmlType="submit" loading={loading}>Accept Invitation</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
};

export default RegisterUser;