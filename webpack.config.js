var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');

module.exports = {
    mode:'development',
    entry:{
        index:'./src/root.js'
    },
    devtool:'inline-source-map',
    module:{
        rules:[
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                   
                }
            },
            /*
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                    
                }
            },
            */
            {
                test:/\.css?$/,
                exclude:/node_modules/,
                use:['style-loader','css-loader']
            }
        ]
        
    },
    devServer:{
        contentBase:'./dist'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].bundle.js"

    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title:'react-news',
            template:'index.html'
        })
    ]
    
}
