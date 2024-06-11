import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type ProductsFilterProps = {
    children?: React.ReactNode;
};
const ProductsFilter = ({ children }: ProductsFilterProps) => {
    return (
        <Card style={{ marginTop: '20px' }}>
            <Row gutter={8}>
                <Col span={16}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name='q'>
                                <Input.Search
                                    placeholder='Search'
                                    size='large'
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name='category'>
                                <Select
                                    style={{ width: '100%' }}
                                    size='large'
                                    showSearch
                                    placeholder='Category'
                                    allowClear={true}
                                >
                                    <Select.Option value='pizza'>
                                        Pizza
                                    </Select.Option>
                                    <Select.Option value='drink'>
                                        Drink
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name='tenant'>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Restaurant'
                                    size='large'
                                    showSearch
                                    allowClear={true}
                                >
                                    <Select.Option value='2'>
                                        Pizzeria Andheri
                                    </Select.Option>
                                    <Select.Option value='3'>
                                        Pizzeria Bandra
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name='isPublished'>
                                <Space>
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                        defaultChecked
                                    />
                                    <Typography.Text>Show Published</Typography.Text>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col
                    span={8}
                    style={{ display: 'flex', justifyContent: 'end' }}
                >
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default ProductsFilter;
