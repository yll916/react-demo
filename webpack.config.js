const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 拆分css 以外链方式引入到header中

module.exports = {
    mode: 'development', // 默认开发环境
    entry: path.resolve(__dirname, './src/index.tsx'), // 入口文件\
    // 打包出口文件
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].[contenthash:8].bundle.js',
        // webpack5支持clean属性配置 不需要再去依赖其他plugin配置
        clean: true, // 清除掉之前的bundle
    },
    devServer: {
        port: 9090,
        hot: true, // 本地开发热更新 代码更改后自动重新编译
    },
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 使用默认目录缓存Loader执行结果 提升webpack打包速率
                            // 也可以在.babelrc中配置
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript',
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                ],
                include: /src/,
            },
            // 用于解析antd样式文件
            {
                test: /\.css$/,
                include: [/node_modules/],
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            // 用于解析非antd相关样式文件
            {
                test: /\.(css|scss)$/,
                exclude: [/node_modules/], // 非antd
                // css-loader对css文件进行合并处理等
                // style-loader用于处理的css文件以style标签的形式嵌入到html页面中
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            // 启用css module
                            modules: {
                                auto: /\.module\./, // 仅业务页面相关样式开启
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            // 打包静态资源 webpack5之前主要用file-loader跟url-loader
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]',
                },
            },
        ],
    },
    plugins: [
        // 将bundle.js自动挂载到index.html
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'), // 要挂载的模板文件
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css', // filename打包的是同步代码
            chunkFilename: '[id].css', // 异步代码
        }),
    ],
    // 配置模块如何解析 便于开发
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@config': path.resolve(__dirname, './src/config'),
            '@services': path.resolve(__dirname, './src/services'),
            '@router': path.resolve(__dirname, './src/router'),
            '@views': path.resolve(__dirname, './src/views'),
            '@components': path.resolve(__dirname, './src/components'),
        },
        extensions: ['.tsx', '.js', '.jsx'], // 自动解析的扩展 用户在使用时可以不用带扩展名eg: import file from @/to/file
    },
}
