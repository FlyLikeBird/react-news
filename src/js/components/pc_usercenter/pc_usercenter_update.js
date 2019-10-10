import React from 'react';

import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import DeleteModal from './pc_usercenter_delete_modal';
import ShareModal from '../common_comments/comment_share_modal';
import { formatContent } from '../../../utils/translateDate';

import UpdateItem from './pc_usercenter_update_item';
const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;

export default class UpdateContainer extends React.Component{
    constructor(){
        super();
        this.state={
            userAction:[],
            visible:false,
            shareVisible:false,
            deleteId:0,
            actionInfo:{},
            actionId:'',
            
        }
    }

    componentDidMount(){
        var { data } = this.props;
        this.setState({userAction:data})

    }
    
    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleUpdateAction(data){
        this.setState({userAction:data})
    }

    handleShareVisible(boolean,option){
        if ( boolean == true ){
            var { actionId } = option;
            this.setState({shareVisible:boolean, actionInfo:option, actionId })
        } else {
            this.setState({shareVisible:boolean})
        }        
    }

    handleDelete(){
        var { deleteId, userAction } = this.state;
        var data = [...userAction];
        var deleteIndex = 0;
        for(var i=0,len=userAction.length;i<len;i++){
            if(userAction[i].id === deleteId){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({userAction:data})
    }

    componentWillUnmount(){
        if (this._updateShareBy) this._updateShareBy = null;     
    }

    render(){
        var { history, socket, isSelf } = this.props;
        var { userAction, visible, deleteId, actionInfo, actionId, shareVisible } = this.state;

        return(
            
            <div style={{textAlign:'left'}}>
                
                {
                    userAction.length
                    ?
                    <div>
                        <span style={{display:'inline-block',transform:'scale(0.7)',padding:'4px 0',transformOrigin:'left'}}>{`共${userAction.length}条动态`}</span>
                        {
                            userAction.map((item,index)=>(
                                <UpdateItem 
                                    key={index} 
                                    data={item} 
                                    history={history} 
                                    isSelf={isSelf}
                                    socket={socket} 
                                    onVisible={this.handleModalVisible.bind(this)}
                                    onShareVisible={this.handleShareVisible.bind(this)}
                                />
                            ))
                        }
                    </div>
                    
                    :
                    <div>你还没有发布过任何动态!</div>
                }
                {
                    visible
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="action"
                        forActions={true}
                    />
                    :
                    null
                }
                
                {
                    shareVisible
                    ?
                    <ShareModal 
                        visible={shareVisible} 
                        actionInfo={actionInfo}
                        uniquekey={actionId}
                        history={history}    
                        onVisible={this.handleShareVisible.bind(this)} 
                        onUpdate={this.handleUpdateAction.bind(this)}
                        forUserAction={true}
                        isSelf={isSelf}
                    />
                    :
                    null
                }
                
            </div>
        )
    }
    
}



