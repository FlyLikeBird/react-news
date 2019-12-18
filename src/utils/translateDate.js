export function parseDate (date) {  
    var t = Date.parse(date);  
    if (!isNaN(t)) {  
        return new Date(Date.parse(date.replace(/-/g, "/")));  
    } else {  
        return new Date();  
    }  
};  

export function formatDate (date) {     
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours();  
        var minute = date.getMinutes();  
        minute = minute < 10 ? ('0' + minute) : minute; 
        var second= date.getSeconds();  
        second = minute < 10 ? (second) : second;  
        //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;  
        return y + '-' + m + '-' + d+'  '+h+':'+minute ;   
}

export function getElementTop (el) {
　　　　var actualTop = el.offsetTop
　　　　var current = el.offsetParent
　　　　while (current !== null) {
　　　　　　actualTop += current.offsetTop
　　　　　　current = current.offsetParent
　　　　}
　　　　return actualTop
}

export function translateType(type){
    var str = '';
    switch(type){
        case 'Article':
            str =  '新闻';
            break;
        case 'Collect':
            str = '收藏夹';
            break;
        case 'Topic':
            str = '话题';
            break;
        case 'Comment':
            str = '评论';
            break;
        case 'Action':
            str = '动态';
            break;
        case 'msg':
            str = '消息';
            break;
        case 'User':
            str = '用户';
            break;
    }
    return str;
}

export function formatContent(content){ 
    var pattern = /(.*?)@([^@|\s|:]+)/g;  
    var str = content;
    var remainStr = '';
    var data = [];
    var result = pattern.exec(str);
    if(result){
        while(result){
            var obj = {};
            obj['text'] = result[1];
            obj['user'] = result[2];
            data.push(obj);
            //  获取匹配后的剩余字符串
            if(result.index<str.length){
                remainStr = str.substring(result['index']+result[0].length,str.length);
            }  
    
            result = pattern.exec(str);
        }
        if(remainStr&&remainStr.length){
            data.push({
              text:remainStr,
              user:null
            })
        }
       
    }
    return data; 
}

export function sortByDate( arr, name){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a[name]);
    var time2 = Date.parse(b[name]);
    return time2 - time1
  })
  return arr; 
}

export function checkArrIsEqual(arr1, arr2){
    return arr1.sort().toString() == arr2.sort().toString();
}

export function once(fn, context){
    var result;
    return function (){
        if (fn){
            result = fn.apply(context || this, arguments);
            fn = null
        }
        return result;
    }
}





