import React from 'react';

import { Card, Avatar, Badge } from 'antd';

import { parseDate, formatDate } from '../../../utils/translateDate';

const { Meta } = Card;

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
        
        let { data, msgCount, msgKey, socket  } = this.props;
        
        
        return(
            data.length
            ?
            <Card size="small" bordered={false} onClick={this.handleClick.bind(this,msgKey)}>
                <Meta
                    avatar={<Badge count={msgCount}><Avatar src={this.state.avatar} /></Badge>}
                    title = {msgKey}
                    description={

                        <div>
                            <span className="ant-text">{data[data.length-1].content}</span>
                            <span style={{position:'absolute',right:'0',top:'0'}} className="ant-text">{formatDate(parseDate(data[data.length-1].msgtime))}</span>
                        </div>
                    
                    }
                />
            </Card>
            :
            <div>{this.props.text}</div>
        

        )
    }
}


