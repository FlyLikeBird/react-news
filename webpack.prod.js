var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');


module.exports = {
    mode:'production',
    entry:{
        //index:['./src/root.js'] 
        index:'./src/root.js'
       //login:'./src/login.js'  
    },
    //devtool:'source-map',
    module:{
        rules:[
            {
                test:/\.js?$/,
                exclude:/node_modules/,

                use:[
                    'babel-loader'
                ]
                    
            },           
            {  //对目录里面非node_modules，src/common目录下面的css文件开启模块化，页面里引用时候以模块方式引用
                test: /\.css$/,                
                exclude:[
                    path.resolve(__dirname,'node_modules'),
                    path.resolve(__dirname,'src/css')
                ],                
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader:'css-loader',
                        options:{
                            module:true,
                            localIdentName:'[name]-[local]-[hash:base64:6]'
                        }
                    }
                ]
                
            },
            
            {   //对node_modules,src/common目录下面的css文件以全局方式引用，应用到页面
                test:/\.css$/,
                include:[
                    path.resolve(__dirname,'node_modules'),
                    path.resolve(__dirname,'src/css')
                ],
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {

                test:/\.(png|svg|jpg|gif|ico|woff|eot|ttf)$/,               
                use: [
                    {
                        loader: 'file-loader',
                        options: {
    
                            limit:8000000,   //小于50K的 都打包
                            outputPath:'images/',
                            name:'[hash:8].[name].[ext]'
                        }
                           
                    }
                    
                ]
                          
            }
        ]
    },
            /*
            {   //压缩图片要在file-loader之后使用
                    loader:'image-webpack-loader',
                    options:{
                        bypassOnDebug: true
                    }
            }
            */

    
    output:{
        path:path.resolve(__dirname,'dist'),
        publicPath:'/',
        filename:"[name].[hash].js"
    },
    optimization:{
        runtimeChunk:'single',
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    chunks:'async',
                    minChunks:2,
                    name:'vendor',
                    test:/node_modules/
                },
                common: {
                    chunks:'async',
                    minChunks:2,
                    name:'common',
                    reuseExistingChunk:true,
                    enforce:true
                }
            }
        }
        
    },
    externals:[
        {
            'antd':'antd',
            'moment':'moment',
            'react':'React',
            'react-dom':'ReactDOM',
            'react-router-dom':'ReactRouterDOM',
            'echarts':'echarts'
        }
        
    ],
    
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title:'react-news',
            template:'./src/index.template.html',
            //chunks:['index']
            
        }),
        /*
        new HtmlWebpackPlugin({
            filename:'login.html',
            template:'./src/login.template.html',
            chunks:['login']
        }),
        */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/[name]_[hash:8].css'
        }),
        /*
        
        new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerHost: "127.0.0.1",
            analyzerPort: 8000, // 运行后的端口号
            reportFilename: "report.html",
            defaultSizes: "parsed",
            openAnalyzer: true

        })
        */
    ]
    
}
