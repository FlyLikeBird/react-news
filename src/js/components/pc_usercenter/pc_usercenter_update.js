import React from 'react';

import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import DeleteModal from './pc_usercenter_delete_modal';
import ShareModal from '../common_comments/comment_share_modal';

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
            text:'',
            actionType:'',
            uniquekey:'',
            translateData:[],
            item:{}
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
        this.setState({userAction:[]});
        this.setState({userAction:data})
    }

    handleShareVisible(boolean,option){
        if ( boolean == true ){
            var { uniquekey, text,  item, value, username, actionType } = option;
            var data = [];
            var pattern = /@([^:]+):([^@]+)/g;
            var result = pattern.exec(text);
            while(result){              
                data.push({
                  username:result[1],
                  content:result[2]
                });              
                result = pattern.exec(text);
            }
            data.unshift({username,content:value}); 
            text = `@${username}:${text}`;    
            this.setState({shareVisible:boolean,uniquekey,text,item,actionType,translateData:data})
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

    render(){
        var { history, socket, isSelf } = this.props;
        var { userAction, visible, deleteId, shareVisible, uniquekey, text, actionType, translateData, item  } = this.state;

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
                <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="action"
                        forActions={true}
                />
                {
                    shareVisible
                    ?
                    <ShareModal 
                        visible={shareVisible} 
                        toId={uniquekey}         
                        onVisible={this.handleShareVisible.bind(this)} 
                        text={text}
                        data={translateData}
                        shareType={actionType}
                        item={item}
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



