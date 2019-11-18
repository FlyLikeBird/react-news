import React from 'react';
import { Card, Avatar, Badge, Button } from 'antd';
import { parseDate, formatDate } from '../../../utils/translateDate';

export default class MessageItem extends React.Component{
    
    handleClick( toId, toUser ){
        var { socket, onShowChatList } = this.props;
        if (onShowChatList) onShowChatList(true, toId, toUser);
        socket.emit('markMsgIsRead',localStorage.getItem('userid'), toId);
        
    }

    handleDelete(toUser, e){
        e.stopPropagation();
        var { onDelete } = this.props;
        if (onDelete) onDelete(true, toUser);
    }
    
    render(){
        var { data, msgCount, msgKey, socket, onDelete } = this.props;
        var { message, username, avatar } = data;
        var latestMsg = message[message.length-1];
        
        return(         
            <div className="msg-container" onClick={this.handleClick.bind(this, msgKey, username)}> 
                <div style={{display:'flex',alignItems:'center'}}>
                    <Badge count={msgCount}><span className="avatar-container"><img src={avatar} /></span></Badge>
                    <div style={{marginLeft:'10px'}}>
                        <div><span style={{color:'#000'}}>{username}</span></div>
                        <span className="text">{`发布于 ${formatDate(parseDate(latestMsg.msgtime))}`}</span>
                    </div>
                </div> 
                <div className="content-container">
                    <span>{latestMsg.content}</span>
                </div>
                <Button size="small" className="button" onClick={this.handleDelete.bind(this,msgKey)} shape="circle" icon="close"/>
                      
            </div>                  
        )
    }
}


