import React from 'react';

import {  List, Avatar, Button, Icon, Card, Modal } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';

export default class DeleteModal extends React.Component{
  constructor(){
    super();
    this.state={
      
    }
  }

  handleDelete(deleteId){
    var { deleteType, onVisible, onDelete } = this.props;
    if ( deleteType === 'news'){
        fetch(`/usr/removeHistory?userid=${localStorage.getItem('userid')}&uniquekey=${deleteId}`)
        .then(response=>response.json())
        .then(data=>{
            if (onDelete){
                onDelete();
                if (onVisible){
                    onVisible(false);
                }
            }
        })
    } else if ( deleteType === 'action'){
        fetch(`/action/delete?id=${deleteId}`)
        .then(response=>response.json())
        .then(data=>{
            if (onDelete){
                onDelete();
                if (onVisible){
                    onVisible(false);
                }
            }
        })
    } else if ( deleteType === 'topic'){
        fetch(`/topic/removeTopic?topicId=${deleteId}`)
        .then(response=>response.json())
        .then(data=>{
            if (onDelete){
                onDelete();
                if (onVisible){
                    onVisible(false);
                }
            }
        })
    } else if ( deleteType === 'collect'){
        fetch(`/collect/removeCollect?id=${deleteId}&userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                if (onDelete){
                  onDelete();
                  if (onVisible){
                    onVisible(false)
                  }
                }
                
        })
    }
    
  }
  
  render(){
    var { visible, onVisible, deleteType, deleteId } = this.props;
    
    return(
      
      
      <Modal visible={visible} footer={null} onCancel={()=>onVisible(false)}>
          <p>{`确定要删除这条${translateType(deleteType)}吗？`}</p>
          <Button style={{marginRight:'4px'}} type="primary" onClick={this.handleDelete.bind(this,deleteId)}>删除</Button>
          <Button onClick={()=>onVisible(false)}>取消</Button>
      </Modal>   
      
      
    )
  }
}


