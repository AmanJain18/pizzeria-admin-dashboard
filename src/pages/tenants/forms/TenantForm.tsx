import { Row, Col, Input, Form, Card } from 'antd';

const TenantForm = () => {
    return (
        <Row>
            <Col span={24}>
                <Card title='Tenant Info' bordered={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name='name'
                                label='Name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='Please enter tenant name'
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='address'
                                label='Address'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Address is required',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='Please enter tenant address'
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default TenantForm;
