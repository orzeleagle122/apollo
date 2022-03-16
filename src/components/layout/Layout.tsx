import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from "react-router-dom";
import './Layout.css';
import {ReactNode} from "react";

const { Header, Content, Footer } = Layout;

interface IProps {
    children:ReactNode
}

export function LayoutApp({ children }:IProps) {
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