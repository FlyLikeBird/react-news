var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
var path = require('path');

module.exports = {
    mode:'development',
    entry:{
        index:'./src/root.js',
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

                use:{
                    loader:'babel-loader'

                   
                }
            },           
            {
                test:/\.css$/,
                
                use:[
                   MiniCssExtractPlugin.loader,
                   {loader:'css-loader'}
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
    devServer:{
        contentBase:'./dist',
        historyApiFallback:true
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].[chunkhash].js"

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
            template:'index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'[name].css'
        })
    ]
    
}
