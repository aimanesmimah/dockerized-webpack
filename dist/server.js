"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
// consts
var PORT = parseInt(process.env.PORT) || 3000;
var ENV = process.env.ENV || 'development';
var WEBPACK_CONFIG_PATH = path.join(process.cwd(), 'webpack.config.js');
// logger
function RequestLogger(request, response, next) {
    console.info("Request time: " + new Date());
    console.info("Request url: " + request.originalUrl);
    next();
}
// app
var app = express();
// middlewares
app.use(express.static(path.join(__dirname, 'assets')));
var webpackConfig = require(WEBPACK_CONFIG_PATH);
var webpackCompiler = webpack(webpackConfig);
webpackCompiler.plugin('done', function () {
    var _a;
    var memoryFs = devMiddleware.fileSystem;
    var cssFilename = 'style.css';
    var cssFile = fs.readFileSync(path.join('assets', cssFilename));
    memoryFs.data = __assign(__assign({}, memoryFs.data), (_a = {}, _a[cssFilename] = cssFile, _a));
});
var devMiddleware = webpackDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true,
    },
    stats: {
        colors: true,
    },
});
app.use(devMiddleware);
app.use(webpackHotMiddleware(webpackCompiler, {
    log: false,
    path: '/__webpack_hmr'
}));
app.use(RequestLogger);
// request handlers
var Handlers = /** @class */ (function () {
    function Handlers() {
    }
    Handlers.FrontHandler = function (req, res) {
        res.sendFile(path.join(process.cwd(), 'index.html'));
    };
    Handlers.TestHandler = function (req, res) {
        res.json({ server: "is running at port " + PORT + "..." });
    };
    return Handlers;
}());
app.get('/', Handlers.FrontHandler);
app.get('/test', Handlers.TestHandler);
// mounting the server 
app.listen(PORT, function () {
    console.log(ENV + " server is running at port:: " + PORT);
});
//# sourceMappingURL=server.js.map