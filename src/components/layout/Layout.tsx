import { Layout, Menu, Breadcrumb,notification } from 'antd';
import { Link } from "react-router-dom";
import './Layout.css';
import {ReactNode, useEffect} from "react";
import {gql, useSubscription} from "@apollo/client";

const { Header, Content, Footer } = Layout;

interface IProps {
    children:ReactNode
}

const SUBSCRIBE_CREATE_ORDER=gql`
    subscription {
        orderCreated{
            orderID,
            shipAddress{
                street
                city
            }
        }
    }
`

export function LayoutApp({ children }:IProps) {
    const {data} = useSubscription(SUBSCRIBE_CREATE_ORDER);

    useEffect(()=>{
        if(data){
            notification.open({
                message:`new order create #${data.orderID}`,
                description:`street ${data.shipAddress.street}, city ${data.shipAddress.city}`
            })
        }
    },[data])

    return (
    <Layout className="layout">
      <Header>
        <div className="logo">Super Shop!</div>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item><Link to="/">All Products</Link></Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
        </Breadcrumb>
        <div className="site-layout-content">
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Super Shop App with Apollo</Footer>
    </Layout>
  )
}