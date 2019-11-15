import React from 'react';

import { Upload, Form, Button, Input, Select, Radio, Icon, Spin, Modal, Card  } from 'antd';
import DeleteModal from '../deleteModal';
import ShareModal from '../shareModal';
import { formatContent } from '../../../utils/translateDate';

import UpdateItem from './update_list_item';
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
            showForm:false,
            TopicForm:null,
            loaded:false
            
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
        this.setState({isLoading:true});
        setTimeout(()=>{
            this.setState({userAction:data,isLoading:false})
        },0)
        
    }

    handleShareVisible(boolean,option, _updateShareBy){
        if ( boolean == true ){
            this._updateShareBy = _updateShareBy;
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

    handleFormShow(loaded){
        var { showForm } = this.state;
        if ( !loaded ){
            import('../topic_form').then(TopicForm=>{
                this.setState({TopicForm:TopicForm.default,loaded:true})
                return ;
            })
        }
        this.setState({showForm:!showForm});
    }

    
    render(){
        var { history, socket, isSelf } = this.props;
        var { userAction, visible, deleteId, actionInfo, actionId, shareVisible, showForm, TopicForm, loaded } = this.state;

        return(
            
            <div style={{textAlign:'left'}}>
                {
                    isSelf
                    ?
                    <Button type="primary" style={{fontSize:'12px',marginBottom:'20px'}} onClick={this.handleFormShow.bind(this,loaded)}>发布动态</Button>
                    :
                    null
                }
                
                { TopicForm && <TopicForm visible={showForm} onVisible={this.handleFormShow.bind(this)} onUpdate={this.handleUpdateAction.bind(this)} forAction={true}/> }
                {
                    
                    userAction.length
                    ?
                    <div style={{backgroundColor:'#f7f7f7',padding:'10px 20px 20px 20px',borderRadius:'4px'}}>
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
                    <div style={{padding:'10px 0',fontSize:'12px'}}>你还没有发布过任何动态!</div>
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
                        onUpdateShareBy={this._updateShareBy}
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



