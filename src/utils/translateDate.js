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
        case 'news':
            str =  '新闻';
            break;
        case 'collect':
            str = '收藏夹';
            break;
        case 'topic':
            str = '话题';
            break;
        case 'comment':
            str = '评论';
            break;

    }
    return str;
}




