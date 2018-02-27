import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const About = resolve => require(['@/views/About'], resolve)
const SqlGenerate = resolve => require(['@/views/SqlGenerate'], resolve)
const Doc = resolve => require(['@/views/Doc'], resolve)
const DocDetail = resolve => require(['@/views/DocDetail'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/code/generate',
        component: SqlGenerate
    },
    {
        path: '/doc',
        component: Doc
    },
    {
        path: '/doc/detail',
        component: DocDetail
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
