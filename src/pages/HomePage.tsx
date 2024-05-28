import {
    Button,
    Card,
    Col,
    List,
    Row,
    Skeleton,
    Space,
    Statistic,
    Tag,
    Typography,
    theme,
} from 'antd';
import type { StatisticProps } from 'antd';
import Icon from '@ant-design/icons';
import { useAuthStore } from '../store';
import {
    FaClipboardList,
    FaRupeeSign,
    FaBoxes,
    FaRegChartBar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import getGreeting from '../hooks/greeting';

const { Title, Text } = Typography;
const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator=',' duration={1} />
);

const list = [
    {
        OrderSummary: 'Mexican Green Wave, Margarita ...',
        address: 'Bandra, Mumbai',
        amount: 1200,
        status: 'Preparing',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, 4 Cheese ...',
        address: 'Link Road, Andheri',
        amount: 2000,
        status: 'On the way',
        loading: false,
    },
    {
        OrderSummary: 'Farmhouse, Veg Delight ...',
        address: 'Bandra, Mumbai',
        amount: 2000,
        status: 'On the way',
        loading: false,
    },
    {
        OrderSummary: 'Double Margarita, Veggie Paradise ...',
        address: 'Airport Road, Vile Parle',
        amount: 2000,
        status: 'Delivered',
        loading: false,
    },
    {
        OrderSummary: 'Peppy Paneer, Cheese n Corn ...',
        address: 'Kala Ghoda, Mumbai',
        amount: 2000,
        status: 'Delivered',
        loading: false,
    },
];


const HomePage = () => {
    const { user } = useAuthStore();
    const greeting = getGreeting();
    const {
        token: {
            colorSuccess,
            colorSuccessBg,
            colorError,
            colorErrorBg,
            colorWarning,
            colorWarningBg,
        },
    } = theme.useToken();

    return (
        <>
            <Title level={4}>
                {greeting}, {user?.firstName}
            </Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic
                                    title={
                                        <Space
                                            style={{
                                                fontWeight: '600',
                                                fontSize: '16px',
                                                color: '#000',
                                            }}
                                        >
                                            <Icon
                                                component={FaClipboardList}
                                                style={{
                                                    fontSize: '18px',
                                                    color: '#13C925',
                                                    backgroundColor: '#CAF3CE',
                                                    borderRadius: '12px',
                                                    padding: '8px',
                                                }}
                                            />
                                            Total Orders
                                        </Space>
                                    }
                                    style={{ textAlign: 'start' }}
                                    value={30}
                                    valueStyle={{
                                        color: '#13C925',
                                        fontSize: '32px',
                                    }}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic
                                    title={
                                        <Space
                                            style={{
                                                fontWeight: '600',
                                                fontSize: '16px',
                                                color: '#000',
                                            }}
                                        >
                                            <Icon
                                                component={FaRupeeSign}
                                                style={{
                                                    fontSize: '18px',
                                                    color: '#14AAFF',
                                                    backgroundColor: '#E1F8FF',
                                                    borderRadius: '12px',
                                                    padding: '8px',
                                                }}
                                            />
                                            Total Sales
                                        </Space>
                                    }
                                    style={{ textAlign: 'start' }}
                                    value={30000}
                                    valueStyle={{
                                        color: 'green',
                                        fontSize: '32px',
                                    }}
                                    prefix='₹'
                                    precision={2}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card
                                bordered={false}
                                title={
                                    <Space
                                        style={{
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            color: '#000',
                                        }}
                                    >
                                        <Icon
                                            component={FaRegChartBar}
                                            style={{
                                                fontSize: '18px',
                                                color: '#14AAFF',
                                                backgroundColor: '#E1F8FF',
                                                borderRadius: '12px',
                                                padding: '8px',
                                            }}
                                        />
                                        Sales
                                    </Space>
                                }
                            ></Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Card
                        bordered={false}
                        title={
                            <Space
                                style={{
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    color: '#000',
                                }}
                            >
                                <Icon
                                    component={FaBoxes}
                                    style={{
                                        fontSize: '18px',
                                        color: '#13C925',
                                        backgroundColor: '#CAF3CE',
                                        borderRadius: '12px',
                                        padding: '8px',
                                    }}
                                />
                                Recent Orders
                            </Space>
                        }
                    >
                        <List
                            loading={false}
                            itemLayout='horizontal'
                            dataSource={list}
                            renderItem={(item) => (
                                <List.Item>
                                    <Skeleton
                                        title={false}
                                        loading={item.loading}
                                        active
                                    >
                                        <List.Item.Meta
                                            title={
                                                <a href='https://ant.design'>
                                                    {item.OrderSummary}
                                                </a>
                                            }
                                            description={item.address}
                                        />
                                        <Row
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                            }}
                                            justify='space-around'
                                        >
                                            <Col>
                                                <Text strong>
                                                    ₹{item.amount}
                                                </Text>
                                            </Col>
                                            <Col>
                                                <Tag
                                                    color={colorSuccess}
                                                    bordered={false}
                                                    style={{
                                                        textTransform:
                                                            'capitalize',
                                                        borderRadius: '12px',
                                                        padding: '4px 8px',
                                                        width: '100px',
                                                        textAlign: 'center',
                                                        color:
                                                            item.status ===
                                                            'Delivered'
                                                                ? colorSuccess
                                                                : item.status ===
                                                                  'On the way'
                                                                ? colorWarning
                                                                : colorError,
                                                        backgroundColor:
                                                            item.status ===
                                                            'Delivered'
                                                                ? colorSuccessBg
                                                                : item.status ===
                                                                  'On the way'
                                                                ? colorWarningBg
                                                                : colorErrorBg,
                                                    }}
                                                >
                                                    {item.status}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: 20 }}>
                            <Button type='link' style={{ padding: 0 }}>
                                <Link to='/orders'>See all orders</Link>
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default HomePage;
