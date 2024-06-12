import {
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    Switch,
    Typography,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getCategories, getTenants } from '../../http/api';
import { useQuery } from '@tanstack/react-query';
import { ICategory, ITenant } from '../../types';

type ProductsFilterProps = {
    children?: React.ReactNode;
};

const getCategoriesList = async () => {
    try {
        const { data } = await getCategories();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const getTenantsList = async () => {
    try {
        const { data } = await getTenants();
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
    const { data: categoriesList } = useQuery({
        queryKey: ['get-category'],
        queryFn: getCategoriesList,
    });

    const { data: restaurantsList } = useQuery({
        queryKey: ['get-restaurants'],
        queryFn: getTenantsList,
    });

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
                                    placeholder='Select Category'
                                    allowClear
                                >
                                    {categoriesList?.map(
                                        (category: ICategory) => (
                                            <Select.Option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </Select.Option>
                                        ),
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name='tenant'>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Select Restaurant'
                                    size='large'
                                    showSearch
                                    allowClear
                                >
                                    {restaurantsList?.data.map(
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
                        <Col span={6}>
                            <Form.Item name='isPublished'>
                                <Space>
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                        // defaultChecked
                                    />
                                    <Typography.Text>
                                        Show Published
                                    </Typography.Text>
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
