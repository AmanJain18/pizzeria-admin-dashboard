import { useQuery } from '@tanstack/react-query';
import { Row, Col, Input, Form, Card, Space, Select } from 'antd';
import { getTenants } from '../../http/api';
import { ITenant } from '../../types';

const getAllTenants = async () => {
    try {
        const { data } = await getTenants();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const UserForm = () => {
    const selectedRole = Form.useWatch('role');
    const { data: tenantData } = useQuery({
        queryKey: ['tenants'],
        queryFn: getAllTenants,
    });
    return (
        <Row>
            <Col span={24}>
                <Space direction='vertical' size='large'>
                    <Card title='Basic Info' bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='firstName'
                                    label='First name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'First name is required',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Please enter first name'
                                        size='large'
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name='lastName'
                                    label='Last name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Last name is required',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Please enter last name'
                                        size='large'
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name='email'
                                    label='Email'
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email is required',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Please enter valid email',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Please enter email'
                                        size='large'
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='Security Info' bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='password'
                                    label='Password'
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Password is required',
                                        },
                                        {
                                            min: 8,
                                            message: 'At least 8 characters',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder='Please enter password'
                                        size='large'
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='Role Info' bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='role'
                                    label='Role'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select role',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder='Select Role'
                                        size='large'
                                        allowClear
                                    >
                                        <Select.Option value='admin'>
                                            Admin
                                        </Select.Option>
                                        <Select.Option value='manager'>
                                            Manager
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {selectedRole === 'manager' && (
                                <Col span={12}>
                                    <Form.Item
                                        name='tenantId'
                                        label='Restaurant'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please select restaurant',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder='Select Restaurant'
                                            size='large'
                                            allowClear
                                            onChange={() => {}}
                                        >
                                            {tenantData?.map(
                                                (tenant: ITenant) => (
                                                    <Select.Option
                                                        key={tenant.id}
                                                        value={tenant.id}
                                                    >
                                                        {tenant.name}
                                                    </Select.Option>
                                                ),
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default UserForm;
