import { Card, Input, Layout, Space, Button, Form, Checkbox } from 'antd';
import type { FormProps } from 'antd';
import {
    LockFilled,
    UserOutlined,
    LockOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
} from '@ant-design/icons';
import { useState } from 'react';
import './loginPage.css';
import { RuleObject } from 'antd/es/form';
import Logo from '../../components/icons/Logo';

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const passwordRules = [
    {
        pattern: /.{8,}/,
        message: 'At least 8 characters',
    },
    {
        pattern: /(?=.*[A-Z])/,
        message: 'Contain one uppercase letter',
    },
    {
        pattern: /(?=.*[a-z])/,
        message: 'Contain one lowercase letter',
    },
    {
        pattern: /(?=.*\d)/,
        message: 'Contain a number',
    },
    {
        pattern: /(?=.*[@$!%*?&])/,
        message: 'Contain a special symbol',
    },
];

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const validatePassword = (_rule: RuleObject, value: string) => {
        const errors = passwordRules
            .filter((rule) => !rule.pattern.test(value))
            .map((rule) => rule.message);
        if (errors.length > 0) {
            return Promise.reject();
        }
        return Promise.resolve();
    };
    return (
        <>
            <Layout
                style={{
                    height: '100vh',
                    placeItems: 'center',
                    display: 'grid',
                    placeContent: 'center',
                }}
            >
                <Space direction='vertical' size='large' align='center'>
                    <Layout.Content>
                        <Logo />
                    </Layout.Content>
                    <Card
                        title={
                            <Space
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                }}
                            >
                                <LockFilled />
                                Log In
                            </Space>
                        }
                        bordered={false}
                        style={{ width: 300 }}
                    >
                        <Form
                            name='login'
                            initialValues={{ remember: true }}
                            style={{ maxWidth: 300 }}
                            autoComplete='off'
                            onFinish={onFinish}
                        >
                            <Form.Item<FieldType>
                                name='email'
                                validateDebounce={300}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Please enter a valid email!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder='Email'
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name='password'
                                hasFeedback
                                validateDebounce={300}
                                rules={[
                                    { validator: validatePassword },
                                    {
                                        required: true,
                                        message: 'Please enter password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder='Password'
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                />
                            </Form.Item>
                            <div
                                className={`validation-message ${
                                    isPasswordFocused ? 'show' : ''
                                }`}
                            >
                                {passwordRules.map((rule, index) => {
                                    const isValid = rule.pattern.test(password);
                                    return (
                                        <Space
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'right',
                                            }}
                                        >
                                            {isValid ? (
                                                <CheckCircleFilled
                                                    style={{ color: '#52C51A' }}
                                                />
                                            ) : (
                                                <CloseCircleFilled
                                                    style={{ color: 'red' }}
                                                />
                                            )}
                                            <span
                                                style={{
                                                    color: isValid
                                                        ? '#52C51A'
                                                        : 'red',
                                                }}
                                            >
                                                {rule.message}
                                            </span>
                                        </Space>
                                    );
                                })}
                            </div>
                            <Form.Item>
                                <Form.Item<FieldType>
                                    name='remember'
                                    valuePropName='checked'
                                    style={{ float: 'left' }}
                                    noStyle
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a style={{ float: 'right' }} href=''>
                                    Forgot Password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    style={{ width: '100%' }}
                                    type='primary'
                                    htmlType='submit'
                                >
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Space>
            </Layout>
        </>
    );
};

export default LoginPage;
