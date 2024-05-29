import { Row, Col, Input, Form, Card } from 'antd';

const UserForm = () => {
    return (
        <Row>
            <Col span={24}>
                <Card
                    title='Basic Info'
                    bordered={false}
                    style={{ marginBottom: 16 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name='firstName'
                                label='First name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter first name',
                                    },
                                ]}
                            >
                                <Input placeholder='Please enter first name' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='lastName'
                                label='Last name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter last name',
                                    },
                                ]}
                            >
                                <Input placeholder='Please enter last name' />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default UserForm;
