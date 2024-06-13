import { Card, Row, Col, Form, Radio, Switch } from 'antd';
import { ICategory } from '../../../types';

type AttributesProps = {
    selectedCategory: string;
};

const Attributes = ({ selectedCategory }: AttributesProps) => {
    const category: ICategory | null = selectedCategory
        ? JSON.parse(selectedCategory)
        : null;
    console.log(category);

    if (!category) {
        return null;
    }

    return (
        <Card title='Attributes' bordered={false}>
            {category?.attributes.map((attribute) => {
                return (
                    <Row gutter={16}>
                        <Col span={24} key={attribute._id}>
                            {attribute.widgetType === 'switch' ? (
                                <Form.Item
                                    name={['attributes', attribute.name]}
                                    label={attribute.name}
                                >
                                    <Switch
                                        checkedChildren='Yes'
                                        unCheckedChildren='No'
                                        defaultChecked={
                                            attribute.defaultValue === 'Yes'
                                                ? true
                                                : false
                                        }
                                    />
                                </Form.Item>
                            ) : attribute.widgetType === 'radio' ? (
                                <Form.Item
                                    name={['attributes', attribute.name]}
                                    label={attribute.name}
                                    initialValue={attribute.defaultValue}
                                    rules={[
                                        {
                                            required: true,
                                            message: `${attribute.name} is required`,
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        {attribute.options.map((option) => (
                                            <Radio.Button
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            ) : null}
                        </Col>
                    </Row>
                );
            })}
        </Card>
    );
};

export default Attributes;
