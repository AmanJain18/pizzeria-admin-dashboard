import {
    Card,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Switch,
    Typography,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getCategories, getTenants } from '../../http/api';
import { useQuery } from '@tanstack/react-query';
import { ICategory, ITenant } from '../../types';
import { useAuthStore } from '../../store';

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
        queryKey: ['get-categories'],
        queryFn: getCategoriesList,
    });

    const { data: restaurantsList } = useQuery({
        queryKey: ['get-restaurants'],
        queryFn: getTenantsList,
    });

    const { user } = useAuthStore();
    return (
        <Card style={{ marginTop: '20px' }}>
            <Row gutter={8} style={{ alignItems: 'center' }}>
                <Col span={16}>
                    <Row gutter={16} style={{ height: '40px' }}>
                        <Col span={6} style={{ height: '40px' }}>
                            <Form.Item name='q'>
                                <Input.Search
                                    placeholder='Search'
                                    size='large'
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6} style={{ height: '40px' }}>
                            <Form.Item name='categoryId'>
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

                        {user!.role === 'admin' && (
                            <Col span={6} style={{ height: '40px' }}>
                                <Form.Item name='tenantId'>
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
                        )}

                        <Col span={6} style={{ height: '40px' }}>
                            <Flex
                                style={{
                                    height: '40px',
                                    alignItems: 'center',
                                }}
                            >
                                <Form.Item
                                    name='isPublished'
                                    style={{
                                        display: 'contents',
                                    }}
                                >
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                        defaultChecked={false}
                                    />
                                </Form.Item>
                                <Typography.Text style={{marginLeft: 10}}>
                                    Show Published
                                </Typography.Text>
                            </Flex>
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
