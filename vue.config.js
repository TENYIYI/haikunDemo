module.exports = {
    baseUrl: '/', //根路径
    outputDir: "dist", //构建输出目录
    assetsDir: "assets", //静态资源目录 js、css/img/fonts
    lintOnSave: true, //是否开启eslint保存检测 
    devServer: {
        open: true, //启动项目，自动打开浏览器
        host: "localhost", //定义的主机名字，本地开发都是localhost
        port: 8080, //可定义端口号
        https: false, //默认是http
        hotOnly: false, //false是热更新
        proxy: {
            // 配置跨域
            '/apis': {
                target: 'https://jsonplaceholder.typicode.com', //接口域名
                ws: true,
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/apis': '' //这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替 
                        //比如我要调用'http://40.00.100.133:3002/user/login'，直接写‘/api/user/login'即可
                }
            }
        },
        // 服务内部所有其他中间件之前，提供执行自定义中间件的功能，给我们提供了参数
        before(app) {
            // app.get("/apis/posts?userId=1", (req, res) => {
            //     res.json();
            // })
        }
    },
    // 配置代理
    // devServer: {
    //     proxy: {
    //         // '/apis': {
    //         //     target: 'https://jsonplaceholder.typicode.com', //接口域名
    //         //     changeOrigin: true, //是否跨域
    //         //     pathRewrite: {
    //         //         '^/apis': '' //这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替 
    //         //             //比如我要调用'http://40.00.100.133:3002/user/login'，直接写‘/api/user/login'即可
    //         //     }
    //         // }
    //     }
    // }
}