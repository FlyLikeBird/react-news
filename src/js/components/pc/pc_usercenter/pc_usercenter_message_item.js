import React from 'react';
import { Card, Avatar, Badge } from 'antd';
import { parseDate, formatDate } from '../../../../utils/translateDate';

export default class MessageItem extends React.Component{
    constructor(){
        super();
        this.state={
            avatar:''
        }
    }

    componentDidMount(){
        var { msgKey } = this.props;

        fetch(`/usr/getUserAvatar?other=${msgKey}`)
            .then(response=>response.json())
            .then(json=>{
                var avatar = json.data.otherAvatar;
                this.setState({avatar})
            })
    }

    handleClick(toUser){

        var { socket } = this.props;

        if(this.props.onShowChatList){
            this.props.onShowChatList(true,toUser)
        }

        socket.emit('markMsgIsRead',toUser,localStorage.getItem('username'));
        
    }

    render(){
        var { avatar } = this.state;
        var { data, msgCount, msgKey, socket, text  } = this.props;
        var latestMsg = data[data.length-1];
        
        return(
            <div>
                {
                    data.length
                    ?
                    <div className="msg-container" onClick={this.handleClick.bind(this,msgKey)}>       
                        <Badge count={msgCount}><div className="avatar-container"><img src={avatar} /></div></Badge>
                        <div style={{marginLeft:'20px'}}>
                            <div><span style={{color:'#000'}}>{msgKey}</span></div>
                            <div><span>{latestMsg.content}</span></div>
                            <span className="text">{`发布于 ${formatDate(parseDate(latestMsg.msgtime))}`}</span>
                        </div>
                                
                    </div>
                    :
                    <div>{text}</div>
                }
            </div>
        )
    }
}


