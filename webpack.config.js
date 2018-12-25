var webpack = require('webpack');
var path = require('path');

module.exports = {
    //context:__dirname +"/src",
    entry:'./src/js/root.js',
    module:{
        loaders:[
            {
                test:/\.js?$/,
                exclude:/(node_modules)/,
                loader:'babel-loader',
                query:{
                        presets:['react','es2015']
                    }
            },
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
                //loader:'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                
            }
        ]
    },
    output:{
        path:__dirname,
        filename:"./src/bundle.js"

    },
    devServer:{
      hot:true,
      histroryApiFallback:true,
      inline:true,
      port:9000
    }
}
