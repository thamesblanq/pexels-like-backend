const { createProxyMiddleware } = require('http-proxy-middleware');

//any request that is coming into this server has to pass through this proxy api server first before it's been redirected to the original path 
const proxyServer = createProxyMiddleware({
    target: 'http://locallhost:3000',
    changeOrigin: true
});

module.exports = proxyServer

