import React, { useCallback } from 'react';

import { Redirect, Route, RouteProps } from 'react-router';
import useUser from '../../lib/data/use-user';
import { Spin } from 'antd';

interface AuthenticatedRouteProps extends RouteProps {
    children: any;
}

const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
    const {children, ...rest} = props;
    const {user, loading} = useUser();

    const routeRender = useCallback(({location}: any) => {
        if (loading) {
            return <Spin spinning>Loading...</Spin>
        }

        return user ? (
            children
        ) : (
            <Redirect to={{pathname: '/login', state: {from: location}}}/>);
        },
        [user, children, loading]
    );

    return <Route {...rest} render={routeRender}/>;
};

export default AuthenticatedRoute;