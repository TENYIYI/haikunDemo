import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue' //登录页面
import Register from "./views/Login/register.vue";
import NotFound from "./components/commonPages/404.vue";
import Manage from './views/ManageContent/Manage.vue'
Vue.use(Router)

const router = Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    }, {
        path: '/Register',
        name: 'Register',
        component: Register
    },
    {
        path: '*',
        name: '/404',
        component: NotFound
    }, {
        path: '/Manage',
        name: 'Manage',
        meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: Manage
    }

    ],

})
// * to: Route: 即将要进入的目标 路由对象 
// * from: Route: 当前导航正要离开的路由 
// * next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。 
// * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        // 如果去的是登录或者注册页面，不守卫
        if (to.path == '/Login' || to.path == '/Register') {
            next();
        } else {
            // 去非登录或注册页面，才进行如下判断
            if (store.state.token) {  // 通过vuex state获取当前的token是否存在
                const isLogin = localStorage.eleToken ? true : false;  //或者判断localStorage里是否存在token
                next();
            }
            else {
                next({
                    path: '/Login',
                    query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        }

    }
    else {
        next();
    }
})

export default router;