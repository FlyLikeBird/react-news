var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
var path = require('path');


module.exports = {
    mode:'production',
    entry:{
        index:['./src/root.js'],
        vendor:[
            'react',
            'react-dom',
            'react-router-dom'
        ]
    },
    devtool:'source-map',
    module:{
        rules:[
            {
                test:/\.js?$/,
                exclude:/node_modules/,

                use:[
                    'babel-loader'
                ]
                    
            },           
            {
                test: /\.css$/,
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
    
    output:{
        path:path.resolve(__dirname,'dist'),
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
