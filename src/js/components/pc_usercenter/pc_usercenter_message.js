import React from 'react';

import MessageItem from './pc_usercenter_message_item';
import ChatList from '../pc_search/pc_user_chatlist';
import { Collapse, Button, Modal, Input } from 'antd';

import { parseDate, formatDate } from '../../../utils/translateDate';

const { Panel } = Collapse;

export default class MessageContainer extends React.Component{
    constructor(){
        super();
        this.state={
            visible:false,
            toUser:''
            
        }
    }

    
    handleModalVisible(bool){
        var { socket } = this.props;
        this.setState({visible:bool});

        socket.emit('chattingClosed');

    }

    handleShowChatList(bool,toUser){
        this.setState({visible:bool,toUser});
    }


    render(){
        var { msg, socket } = this.props;
        var { systemMsg, actionMsg, userMsg, total, actionNotRead, systemNotRead, userNotRead } = msg;
        
        var systemKeys = Object.keys(systemMsg),userKeys = Object.keys(userMsg),actionKeys=Object.keys(actionMsg);
        
        const text = (
          <p style={{ paddingLeft: 24 }}>
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
            as a welcome guest in many households across the world.
          </p>
        );

        return(
            
            <div>
                <Collapse className="message-container" bordered={false} defaultActiveKey={['system','update','user']}>
                    <Panel header="@我的消息" key="update">
                        {
                            actionKeys.map((msgKey,index)=>(
                                <MessageItem key={index}  data={actionMsg[msgKey]} msgCount={actionNotRead[msgKey]} msgKey={msgKey} socket={socket} onShowChatList={this.handleShowChatList.bind(this)} text="暂无动态消息" />
                            ))
                        
                        }
                    </Panel>
                    <Panel header="系统消息" key="system">
                        {
                            systemKeys.map((msgKey,index)=>(
                                <MessageItem key={index} isSystem data={systemMsg[msgKey]} msgCount={systemNotRead[msgKey]} msgKey={msgKey} socket={socket} onShowChatList={this.handleShowChatList.bind(this)} text="暂无系统消息" />
                            ))
                        
                        }
                        
                    </Panel>
                    
                    <Panel header="用户消息" key="user">
                        {
                            userKeys.map((msgKey,index)=>(
                                <MessageItem key={index} data={userMsg[msgKey]} msgCount={userNotRead[msgKey]} msgKey={msgKey} socket={socket} onShowChatList={this.handleShowChatList.bind(this)} text="暂无用户消息" />
                            ))
                        
                        }
                    </Panel>
                
                </Collapse>
                {
                    this.state.visible
                    ?
                    <ChatList socket={socket} visible={this.state.visible} toUser={this.state.toUser} onModalVisible={this.handleModalVisible.bind(this)}/>
                    :
                    null
                }
                
            
            </div>
        )
    }
}


