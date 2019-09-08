var axios = require('axios');

let config = {
    
    
    transformRequest: [
        function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            //console.log(ret);
            return ret
        }
    ],

    transformResponse: [
        function (data) {
            return data
        }
    ],
    
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    timeout: 10000,
    responseType: 'json'
};

/*
axios.interceptors.response.use(function(res){
    //相应拦截器
    return res.data;
});

*/

module.exports = {
    get:function (url){
        return axios.get(url,config)
    },
    post:function (url,data){
        return axios.post(url,data, config);
    }
}
