import { lazy, Suspense, type FC } from 'react';
import { Navigate, RouteObject, useRoutes, /** Outlet, */ } from 'react-router-dom';

const AsyncComponent: FC<{ component: React.ComponentType }> = (props) => {
  const { component: Component } = props;
  return (
    <Suspense fallback={<div>loading ...</div>}>
      <Component />
    </Suspense>
  );
};

type MyRouteConfig = Omit<RouteObject, 'children'> & {
  name?: string;
  component?: any; // FIXME: type, 参考 lazy
  children?: MyRouteConfig[];
};

// 格式转换 react-route-config -> useRoutes
const convertRoutes = (routes: MyRouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    return {
      path: route.path,
      element: route.element || <AsyncComponent component={lazy(route.component)} />,
      children: route.children ? convertRoutes(route.children) : [],
    };
  });
};

const routeConfig = convertRoutes([
  { path: '/', element: <Navigate to="/popup" replace /> },
  {
    name: 'options',
    path: '/options',
    component: () => import('./pages/Options'),
  },
  {
    name: 'popup',
    path: '/popup',
    component: () => import('./pages/Popup'),
  },
  {
    name: 'copy',
    path: '/copy',
    component: () => import('./pages/Copy'),
  },
] as MyRouteConfig[]);

export default () => <>{useRoutes(routeConfig)}</>;
