import { Card, Col, Form, Input, Row, Select } from 'antd';

type UsersFilterProps = {
    children?: React.ReactNode;
};
const UsersFilter = ({ children }: UsersFilterProps) => {
    return (
        <Card style={{ marginTop: '20px' }}>
            <Row gutter={8} style={{ alignItems: 'center' }}>
                <Col span={12}>
                    <Row gutter={16} style={{ height: '40px' }}>
                        <Col span={8} style={{ height: '40px' }}>
                            <Form.Item name='q'>
                                <Input.Search
                                    placeholder='Search'
                                    size='large'
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ height: '40px' }}>
                            <Form.Item name='role'>
                                <Select
                                    style={{ width: '100%' }}
                                    size='large'
                                    showSearch
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
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ height: '40px' }}>
                            <Form.Item name='status'>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Status'
                                    size='large'
                                    showSearch
                                    allowClear={true}
                                >
                                    <Select.Option value='ban'>
                                        Ban
                                    </Select.Option>
                                    <Select.Option value='active'>
                                        Active
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col
                    span={12}
                    style={{ display: 'flex', justifyContent: 'end' }}
                >
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default UsersFilter;
