import { Card, Row, Col, Form, Space, Typography, InputNumber } from 'antd';
import { ICategory } from '../../../types';

type PriceConfigProps = {
    selectedCategory: string;
};

const PriceConfig = ({ selectedCategory }: PriceConfigProps) => {
    const category: ICategory | null = selectedCategory
        ? JSON.parse(selectedCategory)
        : null;

    if (!category) {
        return null;
    }

    return (
        <Card title='Price Info' bordered={false}>
            {Object.entries(category?.priceConfiguration).map(
                ([key, value]) => {
                    return (
                        <Space
                            direction='vertical'
                            size='middle'
                            style={{ width: '100%' }}
                            key={key}
                        >
                            <Typography.Text>{`${key} (${value.priceType})`}</Typography.Text>

                            <Row gutter={16}>
                                {value.sizeOptions.map((options) => (
                                    <Col span={8} key={options}>
                                        <Form.Item
                                            name={[
                                                'priceConfiguration',
                                                JSON.stringify({
                                                    key,
                                                    priceType: value.priceType,
                                                }),
                                                options,
                                            ]}
                                            label={options}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter amount',
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder='Enter Amount'
                                                size='large'
                                                addonBefore='₹'
                                                type='number'
                                            />
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Space>
                    );
                },
            )}
        </Card>
    );
};

export default PriceConfig;
