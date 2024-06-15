import { Card, Row, Col, Form, Radio, Switch } from 'antd';
import { ICategory } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../../http/api';

type AttributesProps = {
    selectedCategoryId: string;
};

const Attributes = ({ selectedCategoryId }: AttributesProps) => {
    const { data: category } = useQuery<ICategory>({
        queryKey: ['get-category', selectedCategoryId],
        queryFn: async () => {
            const { data } = await getCategory(selectedCategoryId);
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    
    if (!category) {
        return null;
    }

    return (
        <Card title='Attributes' bordered={false}>
            {category?.attributes.map((attribute) => {
                return (
                    <Row gutter={16} key={attribute._id}>
                        <Col span={24}>
                            {attribute.widgetType === 'switch' ? (
                                <Form.Item
                                    name={['attributes', attribute.name]}
                                    label={attribute.name}
                                    initialValue={
                                        attribute.defaultValue === 'Yes'
                                            ? true
                                            : false
                                    }
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
