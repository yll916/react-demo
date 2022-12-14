/**
 * @description 路由文件配置
 */
import React, { ReactComponentElement } from 'react'
import { Navigate } from 'react-router-dom'
import LazyWrap from '@components/LazyWrap.tsx'
import Main from '../views/Main'

interface Router {
    label?: string
    path: string
    children?: Array<Router>
    element: ReactComponentElement<any>
    redirect?: string
}
// 全局路由
const globalRoutes: Array<Router> = [
    {
        path: '/login',
        element: <LazyWrap path="Login" />,
    },
    {
        // 缺省页面
        path: '*',
        element: <NotFound />,
    },
]

function NotFound() {
    return <div>你所访问的页面不存在！</div>
}
// 主路由->后续接口中动态获取
const mainRoutes: Array<Router> = [
    {
        // 页面入口
        path: '/',
        element: <Main />,
        children: [
            {
                path: '/home',
                label: '首页',
                element: <LazyWrap path="Home" />,
            },
            {
                path: '/hello',
                label: '测试',
                element: <LazyWrap path="Hello" moduleName="test" />,
            },
        ],
    },
]

let router: Array<Router> = globalRoutes.concat(mainRoutes)
// 路由配置转换处理
function transformRoutes(routeList = router) {
    const list: Array<Router> = []
    routeList.forEach(route => {
        const obj = { ...route }
        if (route.path === undefined) return
        // 如果存在嵌套路由
        if (obj.children) {
            // 递归处理子路由
            obj.children = transformRoutes(obj.children)
        }
        list.push(obj)
    })
    return list
}

router = transformRoutes(router)
export { router, mainRoutes }
