import { Breadcrumb, Button, Flex, message, Form } from 'antd';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { useAuthStore } from '../../store';

const Products = () => {
    const { user } = useAuthStore();
    const [filterForm] = Form.useForm();

    if (!user || user.role !== 'admin') {
        message.error('Authorized Access!');
        return <Navigate to='/' replace={true} />;
    }
    return (
        <>
            <Flex justify='space-between'>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to='/'>Home</Link>,
                        },
                        {
                            title: <Link to='/products'>Products</Link>,
                        },
                    ]}
                />
            </Flex>

            <Form form={filterForm} onFieldsChange={() => {}}>
                <ProductsFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => {}}
                    >
                        Add Product
                    </Button>
                </ProductsFilter>
            </Form>
        </>
    );
};

export default Products;
