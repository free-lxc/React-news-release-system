const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        // 请求api,会转到"https://www.maoyan.com/"
        '/api',
        createProxyMiddleware({
            target: "https://i.maoyan.com/#movie",
            changeOrigin: true
        })
    )
}