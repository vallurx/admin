import React, { CSSProperties, useEffect, useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter, Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Button, Layout, Menu, Spin } from 'antd';
import 'antd/dist/antd.css';
import Login from './routes/Login';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import useUser from './lib/data/use-user';
import NurseDashboard from './routes/NurseDashboard';
import { DashboardOutlined, ExperimentOutlined, LogoutOutlined, OrderedListOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ApplicationList from './routes/ApplicationList';
import ApplicationQueue from './routes/ApplicationQueue';
import logo from './assets/VallurX Logo Dark Transparent.png';
import VaccineShipments from './routes/VaccineShipments';
import ApplicationItem from './routes/ApplicationItem';
import ApplicationResults from './routes/ApplicationResults';
import ShipmentSchedule from './routes/ShipmentSchedule';
import InviteUserModal from './components/InviteUserModal';
import RegisterUser from './routes/RegisterUser';
import { axios } from './lib/axios';

const logoStyles: CSSProperties = {
    width: '100%',
    userSelect: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    padding: 5
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
    const [inviteUserVisible, setInviteUserVisible] = useState(false);
    const { user, mutate } = useUser();

    const routes = [
        { href: `/`, title: 'Dashboard', icon: <DashboardOutlined /> },
        { href: `/applications`, title: 'Application List', icon: <OrderedListOutlined /> },
        { href: `/queue`, title: 'Application Queue', icon: <SafetyCertificateOutlined /> },
        { href: `/vaccines`, title: 'Vaccine Shipments', icon: <ExperimentOutlined /> }
    ];

    const logOut = () => {
        localStorage.removeItem('session_id');
        localStorage.removeItem('user_id');
        mutate();
    };

    useEffect(() => {
        axios.defaults = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('session_id')
            }
        }
    }, [user]);

    return (
        <Layout className={styles.Layout}>
            <Layout.Sider className="main-nav">
                <Link to="/">
                    <img style={logoStyles} src={logo} alt="logo" />
                </Link>
                <Menu theme="dark" mode="vertical" selectedKeys={[asPath.url]}>
                    <Menu.Item style={{textAlign: 'center', height: 'auto'}}>
                        Welcome, {user?.name} <br />
                        <Button type="primary" ghost onClick={() => setInviteUserVisible(true)}>
                            Invite User
                        </Button>
                    </Menu.Item>

                    {routes.map(route => (
                        <Menu.Item key={route.href} icon={route.icon}>
                            <Link to={route.href}>
                                {route.title}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
                <div style={{flex: 1}} />
                <Menu theme="dark" mode="vertical">
                    <Menu.Item icon={<LogoutOutlined />} onClick={logOut}>
                        Log Out
                    </Menu.Item>
                </Menu>
            </Layout.Sider>

            <Layout>
                <Layout.Content style={{ padding: '50px', overflow: 'scroll' }}>
                    <div className={styles.Content}>
                        <InviteUserModal visible={inviteUserVisible} onFinish={() => setInviteUserVisible(false)} />

                        {props.children}
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center' }}>VallurX 2020</Layout.Footer>
            </Layout>
        </Layout>
    )
}

const App = () => {
    const { loading } = useUser();

    return (
        <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/admin' : ''}>
            <Spin spinning={loading}>
                <Switch>
                    <Route path="/login">
                        <LoginWrapper>
                            <Login />
                        </LoginWrapper>
                    </Route>

                    <Route path="/user/invite">
                        <LoginWrapper>
                            <RegisterUser />
                        </LoginWrapper>
                    </Route>

                    <AuthenticatedRoute path="/" exact>
                        <NurseWrapper>
                            <NurseDashboard />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/applications" exact>
                        <NurseWrapper>
                            <ApplicationList />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/applications/:id" exact>
                        <NurseWrapper>
                            <ApplicationItem />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/applications/:id/results" exact>
                        <NurseWrapper>
                            <ApplicationResults />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/queue" exact>
                        <NurseWrapper>
                            <ApplicationQueue />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/vaccines" exact>
                        <NurseWrapper>
                            <VaccineShipments />
                        </NurseWrapper>
                    </AuthenticatedRoute>

                    <AuthenticatedRoute path="/vaccines/:id/schedule" exact>
                        <NurseWrapper>
                            <ShipmentSchedule />
                        </NurseWrapper>
                    </AuthenticatedRoute>
                </Switch>
            </Spin>
        </BrowserRouter>
    )
};

export default App;
