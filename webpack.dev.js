var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
var path = require('path');

//const ExtractTextPlugin = require("extract-text-webpack-plugin");//用来抽离单独抽离css文件
//const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

module.exports = {
    mode:'development',
    entry:{
        index:['./src/root.js',hotMiddlewareScript],
        vendor:[
            'react',
            'react-dom',
            'react-router-dom'
        ]
    },
    devtool:'inline-source-map',
    module:{
        rules:[
            {
                test:/\.js?$/,
                exclude:/node_modules/,

                use:[
                    'babel-loader'
                ]
                    
            },           
            {  // css样式处理
                test: /\.css$/,
                exclude:/node_modules/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
                
            },
            {

                test:/\.(png|svg|jpg|gif|ico|woff|eot|ttf)$/,               
                use: [{
                    loader: 'file-loader',
                    options: {

                        limit:8000000,   //小于50K的 都打包
                        outputPath:'images/',
                        name:'[hash:8].[name].[ext]',
                           
                    }
                }]
                          
            }

        ]
        
    },
    /*
    devServer:{
        hot:true,
        contentBase:'./dist',
        historyApiFallback:true
    },
    */
    output:{
        path:path.resolve(__dirname,'dist'),
        publicPath:'/',
        filename:"[name].[hash].js"

    },
    /*
    optimization:{
        splitChunks:{
            cacheGroups:{
                vendors:{
                    test:/node_modules/,
                    name:'vendors',
                    chunks:'all'
                }
            }
        }
    },
    */
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title:'react-news',
            template:'./src/template.html'
            
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name]_[hash:8].css'
        })
    ]
    
}
