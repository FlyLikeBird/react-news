
var User = require('../../models/User');
var Message = require('../../models/Message');

var onlineUsers = {};

function filterMsgType(type){
    return (item)=>{
        
        return item.msgtype === type;
    }
}

function showNotReadMsg(type,msg,user,obj){
    obj[type] = {};
    var users = Object.keys(msg);
    for(var i=0,len=users.length;i<len;i++){

        var tempArr = msg[users[i]].filter(item=>{
            return item.toUser === user && item.isRead === false
        })
        //console.log(tempArr);
        obj[type][users[i]] = tempArr.length;
        obj['total'] += tempArr.length;
    }

}

function deepFilter(arr,user,userList={}){
    arr.map(item=>{
        // 先判断此条消息是发送方还是接收方
         if(item.fromUser == user){
             if(!userList[item.toUser]) {
                 var userArr = [];
                 userArr.push(item);
                 userList[item.toUser] = userArr;
             } else {
                 userList[item.toUser].push(item);
             }             
         } else {
             if(!userList[item.fromUser]){
                 var userArr = [];
                 userArr.push(item);
                 userList[item.fromUser] = userArr;
             } else {
                 userList[item.fromUser].push(item);
             }
         }    
    });

    return userList;
}

function storeMsg(fromUser,toUser,content,resolve){
        var date = new Date().toString();
        var option = {
            fromUser:fromUser,
            content:content,
            toUser:toUser,
            msgtype:'user',
            msgtime:date,
        };

            User.updateOne({username:fromUser},{$push:{message:option}},(err,result)=>{
            //console.log(result);
                User.updateOne({username:toUser},{$push:{message:option}},(err)=>{
                    
                    if(resolve){
                        resolve()
                    }
                })               
                   
            })  
           
}

function sendActionMsg(user,sender){

    User.updateOne({'username':user},{$push:{message:{
        fromUser:sender,
        toUser:user,
        msgtype:'action',
        msgtime:new Date().toString(),
        content:'hello'
    }}},(err,result)=>{
        
    })
}

function getMsg(socket,user){  
    var promise = new Promise((resolve,reject)=>{
        User.findOne({username:user},(err,userInfo)=>{            
            if (userInfo) {                   
                    /*
                        消息数据格式
                        msg = {                           
                                systemMsg:[],
                                actionMsg:[],
                                userMsg:{
                                    '001':[],
                                    '002':[],
                                    ...
                                }                                               
                                systemNotRead:{
                                    'system1':0,
                                    'system2':10
                                },
                                @NotRead:[],
                                userNotRead:{
                                    'user1':0,
                                    'user2':10
                                },
                                total:                            
                        }                    
                    */

                    var msg = {},username = userInfo.username;                    
                    var result = userInfo.message;
                    var allSystemMsg = result.filter(filterMsgType('system'));
                    var allUserMsg =result.filter(filterMsgType('user'));
                    var actionMsg = result.filter(filterMsgType('action'));
                            
                    var userMsg = deepFilter(allUserMsg,username);
                    var systemMsg = deepFilter(allSystemMsg,username);

                    msg['systemMsg'] = systemMsg;
                    msg['userMsg'] = userMsg;
                    msg['actionMsg'] = actionMsg;

                    msg['total'] = 0;

                    showNotReadMsg('userNotRead',userMsg,username,msg);
                    showNotReadMsg('systemNotRead',systemMsg,username,msg);
                    showNotReadMsg('actionNotRead',actionMsg,username,msg);
                    resolve(msg);
                        
            } 
        })
    });

    promise.then((msg)=>{
        
        socket.emit('receive-message',msg);

    })
}

function socketIndex(socket,io){
    
    socket.on('user-login',(user)=>{
        onlineUsers[user] = {
            id:socket.id
        };
        getMsg(socket,user);       
    })
    

    socket.on('user-loginout',(user)=>{       
        onlineUsers[user] = null;   
    })

    socket.on('isChatting',(fromUser,toUser)=>{
        onlineUsers[fromUser] = {
            id:socket.id,
            isChatting:{
                fromUser,
                toUser
            }
        }
        console.log(onlineUsers);

        socket.on('chattingClosed',()=>{
            onlineUsers[fromUser] = {
                id:socket.id,
                isChatting:null
            }
            console.log(onlineUsers);
        })
    })

    socket.on('checkLogined',(list)=>{
        //console.log(list);
        var result = {}
        for(var i=0,len=list.length;i<len;i++){
            if (onlineUsers[list[i]]){
                if (onlineUsers[list[i]].id) {
                    result[list[i]] = true;
                }
            }
            
        }
        socket.emit('checkLoginedResult',result)
    })


    socket.on('checkIsFollowed',(list,user)=>{

        // 0未关注  1已关注  2互相关注

        var data = [];
        User.findOne({'username':user},(err,checkUser)=>{
            var follows = checkUser.userFollow;
            var fans = checkUser.userFans;

            User.find({'username':{$in:list}},(err,result)=>{
                
                var ids = result.map(item=>({username:item.username,id:item._id}));
                // 遍历每个用户列表的用户
                one:for(let i=0,len=ids.length;i<len;i++){
                    // 先检查某个用户是否在关注列表里
                   two:for(let j=0,len=follows.length;j<len;j++){
                        
                        if (ids[i].id == follows[j].id) {
                            // 如果在关注列表里再继续判断是否在粉丝列表里
                            three:for(let k=0,len=fans.length;k<len;k++){
                                    if(ids[i].id == fans[k].id) {
                                       
                                       data.push({
                                           id:fans[k].id,
                                           state:2
                                       })
                                       continue one;
                                } 
                            }

                            data.push({
                                id:follows[j].id,
                                state:1
                            });
                            
                            continue one;
                        } 
                   }

                   data.push({
                    id:ids[i].id,
                    state:0
                   })
                }

                socket.emit('checkIsFollowedResult',data)

            })
            

        })
    });


    socket.on('markMsgIsRead',(otherUser,selfUser)=>{
        
        User.findOne({username:selfUser},(err,user)=>{
            /*
            for(var i=0,len=user.message.length;i<len;i++){
                
                if ((user.message[i].fromUser == otherUser || user.message[i].toUser ==otherUser) && user.message[i].isRead==false) {
                    
                    
                    user.message[i].isRead = true;
                    user.markModified('isRead');
                    
                }
                
            }
            */
            
        })
        
        
    })   
    
    socket.on('send-message',(msg)=>{
        var { fromUser, toUser, value } = msg;
        
        var promise = new Promise((resolve,reject)=>{
            storeMsg(fromUser,toUser,value,resolve);
        })

        promise.then(()=>{

             User.findOne({'username':fromUser},(err,from_user)=>{

                User.findOne({'username':toUser},(err,to_user)=>{
                    var data = [];

                     data = from_user.message.filter(item=>{
                         return item.fromUser === toUser || item.toUser === toUser
                     })
    
                     data = data.map(item=>{
                        var obj={};
                       
                        obj.content = item.content;
                        obj.msgtime = item.msgtime;
                        obj.fromUser = item.fromUser;                        
                        obj.fromUserAvatar = from_user.userImage;
                        obj.toUserAvatar = to_user.userImage;
                        return obj;
                     })
                
                     socket.emit('send-chatList',data);
    
                     if(!onlineUsers[toUser]){
                         return ;
                     }
    
                     if (onlineUsers[toUser].isChatting && onlineUsers[toUser].isChatting.toUser === fromUser ) {             
                         io.to(onlineUsers[toUser].id).emit('send-chatList',data);
                     } else {
    
                         
                         // 通知聊天的另一端客户端接收消息
                         var toSocket = io.to(onlineUsers[toUser].id);
                         getMsg(toSocket,toUser);
                     }
                })
                   
            })
        })     
       
    })                        
    
    socket.on('send-@msg',(users,sender)=>{
        var users = users.map(item=>item.substring(1,item.length));
        for(var i=0,len=users.length;i<len;i++){
            sendActionMsg(users[i],sender);
        }
        
    })

    socket.on('disconnect',()=>{
        
        console.log('disconnect: '+socket.id);
    })
   
}

module.exports = socketIndex;