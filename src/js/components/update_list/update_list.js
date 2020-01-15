import React from 'react';
import { Upload, Form, Button, Input, Select, Radio, Icon, Spin, Modal, Card  } from 'antd';
import DeleteModal from '../deleteModal';
import ShareModal from '../shareModal';
import UpdateItem from './update_list_item';
import TopicForm from '../topic_form';
import SelectContainer from '../select_container';
import { formatContent, sortByDate, translateType } from '../../../utils/translateDate';

export default class UpdateContainer extends React.Component{
    constructor(){
        super();
        this.state={
            userActions:[],
            currentData:[],
            visible:false,
            shareVisible:false,
            deleteId:0,
            actionInfo:{},
            actionId:'',
            showForm:false,
            isLoading:true ,
            selectValue:'all',
            dateValue:[]       
        }
    }

    componentDidMount(){
        var { user } = this.props;
        fetch(`/api/action/getUserActions?userid=${user}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                data = sortByDate(data,'date');
                this.setState({userActions:data, currentData:data, isLoading:false});
            })
    }
    
    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleUpdateAction(data){  
        var data = sortByDate(data,'date');   
        this.setState({userActions:data, currentData:data, selectValue:'all', dateValue:[]});      
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
        this.setState({userActions:data, currentData:data, selectValue:'all', dateValue:[]});
    }

    componentWillUnmount(){
        this._updateShareBy = null;     
    }

    handleFormShow(){
        var { showForm } = this.state;
        this.setState({showForm:!showForm});
    }

    _filterActions(data, selectValue, dateValue ){
        this.setState({currentData:data, selectValue, dateValue});
    }

    render(){
        var { history, onCheckLogin, isSelf } = this.props;
        var { userActions, currentData, visible, deleteId, actionInfo, actionId, shareVisible, showForm, isLoading, selectValue, dateValue } = this.state;

        return(
            
            <div style={{textAlign:'left'}}>
                {
                    isSelf
                    ?
                    <Button type="primary" style={{fontSize:'12px'}} onClick={this.handleFormShow.bind(this)}>发布动态</Button>
                    :
                    null
                }
                
                    <TopicForm visible={showForm} onVisible={this.handleFormShow.bind(this)} onUpdate={this.handleUpdateAction.bind(this)} forAction={true}/> 
                {
                    
                    isLoading
                    ?
                    <Spin />
                    :
                    userActions.length
                    ?
                    <div>
                        <SelectContainer
                            forAction={true} 
                            currentData={currentData} 
                            data={userActions} 
                            onSelect={this._filterActions.bind(this)} 
                            selectValue={selectValue}
                            dateValue={dateValue} 
                            text="动态"
                        />
                        <div style={{backgroundColor:'#f7f7f7',padding:'20px',borderRadius:'4px'}}>                       
                            {   
                                currentData && currentData.length 
                                ?
                                currentData.map((item,index)=>(
                                    <UpdateItem 
                                        key={index} 
                                        data={item} 
                                        history={history} 
                                        isSelf={isSelf}
                                
                                        onCheckLogin={onCheckLogin} 
                                        onVisible={this.handleModalVisible.bind(this)}
                                        onShareVisible={this.handleShareVisible.bind(this)}
                                    />
                                ))
                                :
                                <div style={{padding:'30px 0'}}>{`${selectValue =='Self'?'还没有发布过动态!':`还没有转发过${translateType(selectValue)}`}`}</div>
                            }
                        </div>
                    </div>                    
                    :
                    <div style={{padding:'10px 0',fontSize:'12px'}}>还没有发布过任何动态!</div>

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



