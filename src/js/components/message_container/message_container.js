import React from 'react';
import { Collapse, Button, Modal, Input, Badge } from 'antd';

import MessageItem from './message_item';
import ChatList from '../user_list/user_chatlist';
import CommentsList  from '../common_comments/comments_list';
import DeleteModal from '../deleteModal';
import { parseDate, formatDate } from '../../../utils/translateDate';

const { Panel } = Collapse;

export default class MessageContainer extends React.Component{
    constructor(){
        super();
        this.state={
            visible:false,
            deleteVisible:false,
            deleteId:'',
            toId:'',
            toUser:''
        }
    }
    
    handleModalVisible(bool){
        var { socket } = this.props;
        this.setState({visible:bool});
        socket.emit('chattingClosed');
    }

    handleDeleteModalVisible(bool,deleteId){
        this.setState({deleteVisible:bool,deleteId})
    }

    handleShowChatList(bool, toId, toUser){
        this.setState({visible:bool, toId, toUser});
    }

    handleDeleteMsg(){
        var { deleteId, list } = this.state;
        var data = [...list];
        var deleteIndex = 0;
        for(var i=0,len=list.length;i<len;i++){
            if(list[i].articleId === deleteId){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({list:data})
    }

    render(){
        var { visible, deleteVisible, deleteId, toId, toUser } = this.state;
        var { msg, socket, history } = this.props;
        var { systemMsg, actionMsg, userMsg, total, actionNotRead, systemNotRead, userNotRead } = msg;       
        var systemKeys = Object.keys(systemMsg),userKeys = Object.keys(userMsg);
        
        return(
            
            <div>
                <Collapse className="message-container" bordered={false} defaultActiveKey={['system','update','user']}>
                    <Panel className="bg" header={<Badge count={actionNotRead}><span>@我的消息</span></Badge>} key="update">
                        {
                            actionMsg && actionMsg.length
                            ?
                            <CommentsList 
                            forMsg={true}
                            forUser={true} 
                            socket={socket} 
                            history={history} 
                            comments={actionMsg}
                            onDelete={this.handleDeleteModalVisible.bind(this)}
                         
                            />
                            :
                            <span>暂无@我的消息</span>
                        }
                        
                        
                    </Panel>
                    <Panel header="系统消息" key="system">
                        {   
                            systemKeys.length
                            ?
                            systemKeys.map((msgKey,index)=>(
                                <MessageItem 
                                    key={index} 
                                    data={systemMsg[msgKey]} 
                                    msgCount={systemNotRead[msgKey]} 
                                    msgKey={msgKey} 
                                    socket={socket} 
                                    onShowChatList={this.handleShowChatList.bind(this)}  
                                    onDelete={this.handleDeleteModalVisible.bind(this)}
                                />
                            ))
                            :
                            <span>暂无系统消息</span>
                        
                        }
                        
                    </Panel>
                    
                    <Panel header="用户消息" key="user">
                        {   
                            userKeys.length
                            ?
                            userKeys.map((msgKey,index)=>(
                                <MessageItem 
                                    key={index} 
                                    data={userMsg[msgKey]} 
                                    msgCount={userNotRead[msgKey]} 
                                    msgKey={msgKey} 
                                    socket={socket} 
                                    onShowChatList={this.handleShowChatList.bind(this)} 
                                    onDelete={this.handleDeleteModalVisible.bind(this)}
                                />
                            ))
                            :
                            <span>暂无用户消息</span>
                        
                        }
                    </Panel>
                
                </Collapse>
                {
                    visible
                    ?
                    <ChatList socket={socket} visible={visible} toId={toId} toUser={toUser} onModalVisible={this.handleModalVisible.bind(this)}/>
                    :
                    null
                }
                {
                    deleteVisible
                    ?
                    <DeleteModal
                        socket={socket} 
                        visible={deleteVisible} 
                        onVisible={this.handleDeleteModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDeleteMsg.bind(this)}
                        deleteType="msg"
                    />
                    :
                    null
                }
            
            </div>
        )
    }
}


