import { Card, Col, Form, Input, Row } from 'antd';

type TenantsFilterProps = {
    children?: React.ReactNode;
};
const TenantsFilter = ({ children }: TenantsFilterProps) => {
    return (
        <Card style={{ marginTop: '20px', justifyItems:'center' }}>
            <Row gutter={8}>
                <Col span={12}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item name='q'>
                                <Input.Search
                                    placeholder='Search'
                                    size='large'
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                />
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

export default TenantsFilter;
