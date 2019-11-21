import React from 'react';
import { Card, Avatar, Badge, Button } from 'antd';
import { parseDate, formatDate } from '../../../utils/translateDate';

export default class MessageItem extends React.Component{
    
    handleClick( toId, toUser, msgId ){
        var { socket, onShowChatList } = this.props;
        if (onShowChatList) onShowChatList(true, toId, toUser);
        socket.emit('markMsgIsRead',localStorage.getItem('userid'), msgId);       
    }

    handleDelete(deleteId, e){
        e.stopPropagation();
        var { onDelete } = this.props;
        if (onDelete) onDelete(true, deleteId);
    }
    
    render(){
        var { data, msgCount, socket, onDelete } = this.props;
        var { msgs, toUser, _id } = data;
        var latestMsg = msgs[msgs.length-1];
        var { content, msgtime, fromUser } = latestMsg;

        return(         
            <div className="msg-container" onClick={this.handleClick.bind(this, toUser._id, toUser.username, _id)}> 
                <div style={{display:'flex',alignItems:'center'}}>
                    <Badge count={msgCount}><span className="avatar-container"><img src={fromUser.userImage} /></span></Badge>
                    <div style={{marginLeft:'10px'}}>
                        <div><span style={{color:'#000'}}>{toUser.username}</span></div>
                        <span className="text">{`发布于 ${formatDate(parseDate(msgtime))}`}</span>
                    </div>
                </div> 
                <div className="content-container">
                    <span>{content}</span>
                </div>
                <Button size="small" className="button" onClick={this.handleDelete.bind(this, _id)} shape="circle" icon="close"/>
                      
            </div>                  
        )
    }
}


