import { Breadcrumb, Flex } from "antd";
import { RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const Products = () => {

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
        </>
    );
};

export default Products;
