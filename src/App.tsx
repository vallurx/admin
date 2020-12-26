import React, { CSSProperties } from 'react';
import styles from './App.module.css';
import { BrowserRouter, Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import 'antd/dist/antd.css';
import Login from './routes/Login';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import useUser from './lib/data/use-user';
import NurseDashboard from './routes/NurseDashboard';
import { DashboardOutlined, OrderedListOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ApprovalList from './routes/ApprovalList';
import ApprovalQueue from './routes/ApprovalQueue';
import logo from './assets/VallurX Logo Dark Transparent.png';

const logoStyles: CSSProperties = {
    width: '100%',
    userSelect: 'none',
    cursor: 'pointer',
    textAlign: 'center'
};

const LoginWrapper = (props: { children: any }) => {
    return (
        <Layout className={styles.Layout}>
            <Layout.Content style={{padding: '50px'}}>
                {props.children}
            </Layout.Content>
            <Layout.Footer style={{textAlign: 'center'}}>VallurX 2020</Layout.Footer>
        </Layout>
    );
};

const NurseWrapper = (props: { children: any }) => {
    const asPath = useRouteMatch();

    const routes = [
        { href: `/nurse-dashboard`, title: 'Dashboard', icon: <DashboardOutlined /> },
        { href: `/approval-list`, title: 'Application List', icon: <OrderedListOutlined /> },
        { href: `/queue`, title: 'Application Queue', icon: <SafetyCertificateOutlined /> }
    ];

    return (
        <Layout className={styles.Layout}>
            <Layout.Sider>
                <Link to="/nurse-dashboard">
                    <img style={logoStyles} src={logo} alt="logo" />
                </Link>
                <Menu theme="dark" mode="vertical" selectedKeys={[asPath.url]}>
                    {routes.map(route => (
                        <Menu.Item key={route.href} icon={route.icon}>
                            <Link to={route.href}>
                                {route.title}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Layout.Sider>

            <Layout>
                <Layout.Content style={{ padding: '50px', overflow: 'scroll' }}>
                    <div className={styles.Content}>
                        {props.children}
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center' }}>VallurX 2020</Layout.Footer>
            </Layout>
        </Layout>
    )
}

const App = () => {
    const { user, loading } = useUser();

    return (
        <BrowserRouter>
            <Spin spinning={loading}>
                <Switch>
                    <Route path="/" exact>
                        Hello, { (user && user.name) || 'Unknown!' }
                    </Route>

                    <Route path="/login">
                        <LoginWrapper>
                            <Login />
                        </LoginWrapper>
                    </Route>

                    <AuthenticatedRoute path="/nurse-dashboard">
                        <NurseWrapper>
                            <NurseDashboard />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/approval-list">
                        <NurseWrapper>
                            <ApprovalList />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/queue">
                        <NurseWrapper>
                            <ApprovalQueue />
                        </NurseWrapper>
                    </AuthenticatedRoute>
                </Switch>
            </Spin>
        </BrowserRouter>
    )
};

export default App;
