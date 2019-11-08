var User = require('../../models/User');
var Message = require('../../models/Message');
var userPromise = require('../userPromise');

var onlineUsers = {};

function _checkIsFollowd(userid,checkFollow, checkFans, isFollowed){
    //  0 表示未关注  1 表示已关注  2 表示互相关注
    if (checkFollow.includes(userid)){
        if (checkFans.includes(userid)){
            isFollowed[userid] = 2;
        } else {
            isFollowed[userid] = 1;
        }
    } else {
        isFollowed[userid] = 0 ;
    }
}

function sort(arr){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a.date);
    var time2 = Date.parse(b.date);
    return time2 - time1
  })
  return arr; 
}

function filterMsgType(type){
    return (item)=>{       
        return item.msgtype === type;
    }
}

function showNotReadMsg(type,msg,userid,obj){
    obj[type] = {};
    var users = Object.keys(msg);
    
    for(var i=0,len=users.length;i<len;i++){

        var tempArr = msg[users[i]].filter(item=>{
            return item.toUser == userid && item.isRead == false
        })
        //console.log(tempArr);
        obj[type][users[i]] = tempArr.length;
        obj['total'] += tempArr.length;
    }

}

function deepFilter(arr,userid){
    var msgList = {};
    arr.map(item=>{
        // 先判断此条消息是发送方还是接收方
         if(item.fromUser == userid){
             if(!msgList[item.toUser]) {
                 var userArr = [];
                 userArr.push(item);
                 msgList[item.toUser] = userArr;
             } else {
                 msgList[item.toUser].push(item);
             }             
         } else {
             if(!msgList[item.fromUser]){
                 var userArr = [];
                 userArr.push(item);
                 msgList[item.fromUser] = userArr;
             } else {
                 msgList[item.fromUser].push(item);
             }
         }    
    });

    return msgList;
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
        User.updateOne({_id:fromUser},{$push:{message:option}},(err,result)=>{
            User.updateOne({_id:toUser},{$push:{message:option}},(err)=>{                
                resolve()
            })                            
        })           
}

function sendActionMsg( user, sender, commentid, io ){
    var date = new Date().toString();
    User.updateOne({'username':user},{$push:{message:{
        fromUser:sender,
        toUser:user,
        msgtype:'action',
        msgtime:date,
        commentid
    }}},(err,result)=>{
        if ( onlineUsers[user] && onlineUsers[user].id){
            var toSocket = io.to(onlineUsers[user].id);
            getMsg(toSocket, user);            
        }       
    })
}

function getMsg(socket,userid){  
    var promise = new Promise((resolve,reject)=>{
        User.findOne({_id:userid},(err,userInfo)=>{            
            if (userInfo) {                   
                    /*
                        消息数据格式
                        msg = {                           
                                systemMsg:{
                                    'system1':[],
                                    'system2':[],
                                    ...
                                },
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
                                actionNotRead:[],
                                userNotRead:{
                                    'user1':0,
                                    'user2':10
                                },
                                total:                            
                        }                    
                    */

                    var msg = {};                    
                    var result = userInfo.message;
                    var allSystemMsg = result.filter(filterMsgType('system'));
                    var allUserMsg =result.filter(filterMsgType('user'));
                    var allActionMsg = result.filter(filterMsgType('action'));
                    msg['total'] = 0;
                    var userMsg = deepFilter(allUserMsg,userid);
                    var systemMsg = deepFilter(allSystemMsg,userid);
                    //   筛选未读的动态消息
                    var actionNotRead = 0;
                    /*
                    var actionNotRead = allActionMsg.filter(item=>{
                        return item.toUser == username && item.isRead == false
                    })
                    */
                    showNotReadMsg('userNotRead', userMsg, userid, msg);
                    showNotReadMsg('systemNotRead', systemMsg, userid, msg);
                    msg['actionNotRead'] = actionNotRead; 
                    msg['total'] += actionNotRead;
                    msg['systemMsg'] = systemMsg;
                    msg['userMsg'] = userMsg;
                    //  构建动态消息需要的数据结构      
                    /*             
                    var allPromises = [];
                    for(var i=0,len=allActionMsg.length;i<len;i++){
                        (function(i){
                            var actionMsg = allActionMsg[i];
                            var promise = new Promise((resolve,reject)=>{
                                userPromise.getUserActionMsg(actionMsg,resolve);
                            })
                            allPromises.push(promise);
                        })(i)
                    }
                    Promise.all(allPromises)
                        .then(data=>{                            
                            msg['actionMsg'] = sort(data);
                            resolve(msg);
                        })
                    */
                    resolve(msg);
            } 
        })
    });

    promise.then((msg)=>{        
        socket.emit('receive-message',msg);
    })
}

function socketIndex(socket,io){
    
    socket.on('user-login',(userid)=>{       
        onlineUsers[userid] = {
            id:socket.id
        };
        getMsg(socket,userid); 
             
    })
    
    socket.on('user-loginout',(userid)=>{       
        onlineUsers[userid] = null;   
    })

    socket.on('isChatting',(fromUser,toUser)=>{
        onlineUsers[fromUser] = {
            id:socket.id,
            isChatting:{
                fromUser,
                toUser
            }
        }

        socket.on('chattingClosed',()=>{
            onlineUsers[fromUser] = {
                id:socket.id,
                isChatting:null
            }
        })
    })

    socket.on('checkLogined',( users, checkUserId)=>{
        var logined = {},isFollowed = {};
        for(var i=0,len=users.length;i<len;i++){
            var user = users[i];
            if (onlineUsers[user] && onlineUsers[user].id){
                logined[user] = true;
            }  
        }
        User.findOne({_id:checkUserId},(err,userInfo)=>{
            var follows = userInfo.userFollow;
            var fans = userInfo.userFans;
            for(var i=0,len=users.length;i<len;i++){
                _checkIsFollowd(users[i],follows,fans,isFollowed);
            };
            socket.emit('checkLoginedResult',logined,isFollowed);
        })
        
    })

    socket.on('markMsgIsRead',(otherUser,selfUser)=>{       
        User.findOne({'username':selfUser},(err,user)=>{
            var messages = user.message;            
            for(var i=0,len=messages.length;i<len;i++){
                if((messages[i].fromUser == otherUser || messages[i].toUser == otherUser) && messages[i].isRead == false){
                    messages[i].isRead = true;
                }
            }
            user.markModified('isRead');
            user.save(()=>{
                getMsg(socket,selfUser);
            })            
        })                
    })   
    
    socket.on('markActionMsg',(userid,msgId)=>{
        User.findOne({_id:userid,'message._id':msgId},(err,user)=>{
            var username = user.username;
            var msgs = user.message;
            var prevIsRead;
            for(var i=0,len=msgs.length;i<len;i++){
                if (msgs[i]._id == msgId){
                    prevIsRead = msgs[i].isRead;
                    break;
                }
            }
            User.updateOne({_id:userid,'message._id':msgId},{$set:{'message.$.isRead':!prevIsRead}},(err,result)=>{
                if ( onlineUsers[username] && onlineUsers[username].id){
                    var toSocket = io.to(onlineUsers[username].id);
                    getMsg(toSocket, username);            
                }
            })
        })        
    })

    socket.on('send-message',(msg)=>{
        var { fromUser, toUser, value } = msg;       
        var promise = new Promise((resolve,reject)=>{
            storeMsg(fromUser,toUser,value,resolve);
        })
        promise.then(()=>{
             User.findOne({_id:fromUser},(err,from_user)=>{
                User.findOne({_id:toUser},(err,to_user)=>{
                    var data = [];
                     data = from_user.message.filter(item=>{
                         return item.fromUser === toUser || item.toUser === toUser
                     });
    
                     data = data.map(item=>{
                        var obj = {};
                        obj.fromUser = item.fromUser;
                        obj.toUser = item.toUser;
                        obj.msgtype = item.msgtype;
                        obj.msgtime = item.msgtime;
                        obj.content = item.content;
                        obj.selfAvatar = from_user.userImage;
                        obj.otherAvatar = to_user.userImage;
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
    
    socket.on('send@Msg',( users, sender, commentid)=>{
        for(var i=0,len=users.length;i<len;i++){
            sendActionMsg( users[i], sender, commentid, io);
        }       
    })

    socket.on('removeActionMsg',(user,msgId)=>{
        User.updateOne({'username':user},{$pull:{message:{_id:msgId}}},(err,result)=>{
            getMsg(socket,user)
        })
    })

    socket.on('disconnect',()=>{
        
        console.log('disconnect: '+socket.id);
    })
   
}

module.exports = socketIndex;