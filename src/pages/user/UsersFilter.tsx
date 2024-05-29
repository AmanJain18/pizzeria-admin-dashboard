import { Button, Card, Col, Input, Row, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const UsersFilter = () => {
    return (
        <Card style={{marginTop: '20px'}}>
            <Row gutter={8}>
                <Col span={12}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Input.Search placeholder='Search' />
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder='Role'
                                allowClear={true}
                            >
                                <Select.Option value='admin'>
                                    Admin
                                </Select.Option>
                                <Select.Option value='manager'>
                                    Manager
                                </Select.Option>
                                <Select.Option value='customer'>
                                    Customer
                                </Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder='Status'
                                allowClear={true}
                            >
                                <Select.Option value='ban'>Ban</Select.Option>
                                <Select.Option value='active'>
                                    Active
                                </Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col
                    span={12}
                    style={{ display: 'flex', justifyContent: 'end' }}
                >
                    <Button type='primary' icon={<PlusOutlined />}>
                        Add User
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default UsersFilter;