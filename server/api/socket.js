var User = require('../../models/User');
var Message = require('../../models/Message');
var userPromise = require('../userPromise');
var util = require('../util');

var onlineUsers = {};
onlineUsers['5dfc9a1db919945caaaba177'] = { id:'online'};
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

function showNotReadMsg(type, typeMsgs, obj){
    obj[type] = {};
    for(var i=0,len=typeMsgs.length;i<len;i++){
        var typeMsg = typeMsgs[i];
        var tempArr = typeMsg.msgs.filter(item=>{
            return item.isRead == false && String(item.fromUser._id) == String(typeMsg.toUser._id);
        })
        obj[type][typeMsg['toUser']['username']] = tempArr.length;
        obj['total'] += tempArr.length;
    }
}

function storeMsg( targetUser, toUser, fromUser, content,resolve){
        var date = new Date().toString();
        User.findOne({_id:targetUser},{message:1})
            .populate({
                path:'message',
                match:{toUser:toUser}
            })
            .then(doc=>{
                var { message } = doc;
                if( message&& message.length){
                    var toUserId = message[0]._id;
                    Message.updateOne({_id:toUserId},{$push:{msgs:{
                        content,
                        msgtime:date,
                        fromUser:fromUser
                    }}},(err,result)=>{
                        resolve();
                    })
                } else {
                    var msg = new Message({
                        toUser,
                        msgtype:'user',
                        msgs:[{
                            content,
                            fromUser,
                            msgtime:date
                        }]
                    });
                    msg.save((err)=>{
                        User.updateOne({_id:targetUser},{$push:{message:msg._id}},(err,result)=>{
                            resolve();
                        })
                    })
                }
            })
}

// 动态消息
function sendActionMsg( user, sender, commentid, io ){
    var date = new Date().toString();
    var msg = new Message({
        commentid,
        toUser:sender,
        msgtype:'action',
        date
    });
    msg.save((err)=>{
        User.findOne({'username':user},(err,userInfo)=>{
            var userid = userInfo._id;
            User.updateOne({_id:userid},{$push:{message:msg._id}},(err,result)=>{
                if ( onlineUsers[userid] && onlineUsers[userid].id){
                    var toSocket = io.to(onlineUsers[userid].id);
                    getMsg(toSocket, userid);            
                }
            })
        })  
    })
    
}

function getMsg(socket, userid){   
    User.findOne({_id:userid},{message:1})
        .populate({
            path:'message',
            populate:[
                {path:'toUser',select:'username userImage'},
                {path:'msgs.fromUser', select:'username userImage'},
                {
                    path:'commentid',
                    populate:[
                        { path:'fromUser', select:'username userImage'},
                        { 
                            path:'replyTo',
                            populate:{ path:'fromUser',select:'username userImage'},
                            select:'fromUser'
                        },
                        { 
                            path:'related',
                            populate:[
                                { path:'fromUser',select:'username userImage'},
                                { path:'tags',select:'tag'},
                                { path:'follows.user', select:'username userImage'},
                                { path:'shareBy'}
                            ],
                            select:'auth newstime thumbnails title type fromUser tags follows shareBy'
                        }
                    ]
                }
            ]
        })
        .then(doc=>{
            var messages = doc.message;
            var msg = {};
            msg['total'] = 0;

            var systemMsg = messages.filter(filterMsgType('system'));
            var userMsg =messages.filter(filterMsgType('user'));
            var actionMsg = messages.filter(filterMsgType('action')).sort(util.sortArr('date'));

            msg['userMsg'] = userMsg;
            msg['systemMsg'] = systemMsg;
            msg['actionMsg'] = actionMsg;

            showNotReadMsg('userNotRead', userMsg, msg);
            showNotReadMsg('systemNotRead', systemMsg, msg);
            msg['actionNotRead'] = actionMsg.filter(item=>!item.isRead).length;
            msg['total'] += msg['actionNotRead'];
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
            var follows = userInfo.userFollows;
            var fans = userInfo.userFans;
            for(var i=0,len=users.length;i<len;i++){
            //  0 表示未关注  1 表示已关注  2 表示互相关注
                var userid = users[i];
                if (follows.includes(userid)){
                    if (fans.includes(userid)){
                        isFollowed[userid] = 2;
                    } else {
                        isFollowed[userid] = 1;
                    }
                } else {
                    isFollowed[userid] = 0 ;
                }   
            };
            socket.emit('checkLoginedResult',logined,isFollowed);
        })
        
    })

    socket.on('markMsgIsRead',( userid, msgId )=>{
        Message.updateOne({_id:msgId},{$set:{'msgs.$[].isRead':true}},(err,result)=>{
            if (err) throw err;
            getMsg(socket, userid);
        })      
    })   
    
    socket.on('deleteMsg',(userid, deleteId)=>{
        Message.deleteOne({_id:deleteId},(err,result)=>{
            User.updateOne({_id:userid},{$pull:{message:deleteId}},(err,result)=>{
                getMsg(socket, userid);
            })          
        }) 
    })

    socket.on('markActionMsg',(userid,msgId)=>{
        console.log(msgId);
        Message.findOne({_id:msgId},(err,doc)=>{
            var isRead = doc.isRead;
            Message.updateOne({_id:msgId},{$set:{isRead:!isRead}},(err,result)=>{
                getMsg(socket, userid);
            })
        })  
    })

    socket.on('send-message',(msg)=>{
        var { fromUser, toUser, value } = msg;       
        var promise1 = new Promise((resolve,reject)=>{
            storeMsg(fromUser, toUser, fromUser, value, resolve);
        });      
        var promise2 = new Promise((resolve, reject)=>{
            storeMsg(toUser, fromUser, fromUser, value, resolve);
        });
        
        Promise.all([promise1, promise2])
            .then(()=>{
                User.findOne({_id:fromUser},{message:1})
                    .populate({
                        path:'message',
                        populate:[
                            {path:'toUser',select:'username userImage'},
                            {path:'msgs.fromUser', select:'username userImage'}
                        ],
                        match:{'toUser':toUser},
                        options:{limit:1}
                    })
                    .then(doc=>{
                        var { message } = doc;
                        if (message&&message.length){
                            socket.emit('send-chatList',message[0]);
                        }
                        
                        if(!onlineUsers[toUser]){
                             return ;
                        }        
                        if (onlineUsers[toUser].isChatting && onlineUsers[toUser].isChatting.toUser == fromUser ) {             
                            io.to(onlineUsers[toUser].id).emit('send-chatList',message[0]);
                        } else {                         
                            // 通知聊天的另一端客户端接收消息
                            var toSocket = io.to(onlineUsers[toUser].id);
                            getMsg(toSocket,toUser);
                        }
                    })
            })                 
    })                        
    
    socket.on('send@Msg',( sender, users, commentid)=>{
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