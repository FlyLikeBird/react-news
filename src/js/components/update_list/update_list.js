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
            userActions:[],
            visible:false,
            shareVisible:false,
            deleteId:0,
            actionInfo:{},
            actionId:'',
            showForm:false,
            TopicForm:null,
            loaded:false,
            isLoading:true        
        }
    }

    componentDidMount(){
        var { match } = this.props;
        var userid = match.params.id
        fetch(`/api/action/getUserActions?userid=${userid}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({userActions:data,isLoading:false});
            })
    }
    
    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleUpdateAction(data){     
        this.setState({userActions:data})      
    }

    handleShareVisible(boolean, data, _updateShareBy){
        if ( boolean == true ){
            this._updateShareBy = _updateShareBy;
            var { _id } = data;
            this.setState({shareVisible:boolean, actionInfo:data, actionId:_id })
        } else {
            this.setState({shareVisible:boolean})
        }        
    }

    handleDelete(){
        var { deleteId, userActions } = this.state;
        var data = [...userActions];
        var deleteIndex = 0;
        for(var i=0,len=userActions.length;i<len;i++){
            if(userActions[i]._id === deleteId){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({userActions:data})
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
        var { history, socket, onCheckLogin, isSelf } = this.props;
        var { userActions, visible, deleteId, actionInfo, actionId, shareVisible, showForm, TopicForm, loaded, isLoading } = this.state;

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
                    
                    isLoading
                    ?
                    <Spin />
                    :
                    userActions.length
                    ?
                    <div style={{backgroundColor:'#f7f7f7',padding:'10px 20px 20px 20px',borderRadius:'4px'}}>
                        <span style={{display:'inline-block',transform:'scale(0.7)',padding:'4px 0',transformOrigin:'left'}}>{`共${userActions.length}条动态`}</span>
                        {
                            userActions.map((item,index)=>(
                                <UpdateItem 
                                    key={index} 
                                    data={item} 
                                    history={history} 
                                    isSelf={isSelf}
                                    socket={socket}
                                    onCheckLogin={onCheckLogin} 
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
                        deleteType="Action"
                       
                    />
                    :
                    null
                }
                
                {
                    shareVisible
                    ?
                    <ShareModal 
                        visible={shareVisible} 
                        item={actionInfo}
                        onModel="Action"
                        forAction={true}
                        uniquekey={actionId}    
                        onVisible={this.handleShareVisible.bind(this)} 
                        onUpdate={this.handleUpdateAction.bind(this)}
                        onUpdateShareBy={this._updateShareBy}
                        isSelf={isSelf}
                    />
                    :
                    null
                }
                
            </div>
        )
    }
    
}



