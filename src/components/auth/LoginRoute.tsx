import React, { useCallback } from 'react';

import { Redirect, Route, RouteProps } from 'react-router';
import useUser from '../../lib/data/use-user';
import { Spin } from 'antd';

interface LoginRouteProps extends RouteProps {
    children: any;
}

const LoginRoute = (props: LoginRouteProps) => {
    const {children, ...rest} = props;
    const { user, loading, error } = useUser();

    const routeRender = useCallback(({location}: any) => {
        if (loading) {
            return <Spin spinning>Loading...</Spin>
        }

        return user && !error ? (
            <Redirect to={{pathname: '/admin', state: {from: location}}}/>
        ) : (
            children;
        )},
        [user, children, loading, error]
    );

    return <Route {...rest} render={routeRender}/>;
};

export default LoginRoute;