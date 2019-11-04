import React from 'react';

import {  List, Avatar, Button, Icon, Card, Modal } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';

export default class DeleteModal extends React.Component{
  
  handleDelete(deleteId){
    var { deleteType, onVisible, onDelete, parentcommentid, socket } = this.props;
    if ( deleteType === 'news'){
        fetch(`/api/usr/removeHistory?userid=${localStorage.getItem('userid')}&uniquekey=${deleteId}`)
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
        fetch(`/api/action/delete?id=${deleteId}`)
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
        fetch(`/api/topic/removeTopic?topicId=${deleteId}`)
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
        fetch(`/api/collect/removeCollect?id=${deleteId}&userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                if (onDelete){
                  onDelete();
                  if (onVisible){
                    onVisible(false)
                  }
                }
                
        })
    } else if ( deleteType === 'comment') {
        fetch(`/api/comment/delete?commentid=${deleteId}&parentcommentid=${parentcommentid?parentcommentid:''}`)
          .then(response=>response.json())
          .then(json=>{
              if (onDelete) onDelete();
              if (onVisible) onVisible(false);
          })
    } else if ( deleteType === 'actionMsg' && socket ){
        socket.emit('removeActionMsg',localStorage.getItem('username'),deleteId);
        if ( onVisible ) onVisible(false);
    }
    
  }
  
  render(){
    var { visible, onVisible, deleteType, deleteId, parentcommentid } = this.props;
    
    return(
      
      
      <Modal visible={visible} footer={null} onCancel={()=>onVisible(false)}>
          <div style={{margin:'10px 0'}}>
              <span>{`确定要删除这条${translateType(deleteType)}吗？`}</span>
              { 
                  deleteType == 'comment' && !parentcommentid
                  ?
                  <div><span style={{display:'inline-block',transform:'scale(0.7)',transformOrigin:'left'}}>删除此评论会同时删除该评论下的所有回复评论</span></div>
                  :
                  null
              }
          </div>
          <Button style={{marginRight:'4px'}} type="primary" onClick={this.handleDelete.bind(this,deleteId)}>删除</Button>
          <Button onClick={()=>onVisible(false)}>取消</Button>
      </Modal>   
      
      
    )
  }
}


