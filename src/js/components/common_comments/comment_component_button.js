import React from 'react';
import { Icon } from 'antd';
import CommentsInput from './comments_input';

import { parseDate, formatDate } from '../../../utils/translateDate';

var isAllowed = true ;

export default class CommentsComponentButton extends React.Component{
  constructor(){
    super();
   
    this.state={
      isLiked:false,
      isdisLiked:false,
      likeNum:0,
      dislikeNum:0,
      visible:false     
    }
  }

 
  handleUserAction(commentid,action,isCancel,parentcommentid){
    
    fetch('/comment/operatecomment?action='+action+'&commentid='+commentid +'&isCancel='+isCancel +'&parentcommentid='+parentcommentid)
      .then(response=>response.json())
      .then(json=>{
        
        var responseData = json.data;
        var likeNum = responseData.like;
        var dislikeNum = responseData.dislike;

        this.setState({likeNum,dislikeNum});

        if (action == 'like' && !Boolean(isCancel)) {
          this.setState({isLiked:true})
        } else if (action == 'like' && Boolean(isCancel)){
          this.setState({isLiked:false})
        } else if (action == 'dislike' && !Boolean(isCancel)){
          this.setState({isdisLiked:true})
        } else if (action == 'dislike' && Boolean(isCancel)){
          this.setState({isdisLiked:false})
        }
      })

      
      if ( isAllowed ) {
        if(action === 'like' && !isCancel )
        fetch(`/usr/operatecomment?user=${localStorage.getItem('username')}`)
        .then(()=>{

          isAllowed = false;

          setTimeout(()=>{
            isAllowed = true;
          },60000)
        })
      }
      

      if(action == 'like') {
        
        if (this.likeDom){
            var span = this.likeDom;
            var i = span.getElementsByClassName('anticon')[0];
            i.classList.add('addFlash');
            setTimeout(()=>i.classList.remove('addFlash'),500)
        }
      } else if(action == 'dislike'){
        if(this.dislikeDom){
          var span = this.dislikeDom;
          var i = span.getElementsByClassName('anticon')[0];
          i.classList.add('addFlash'); 
          setTimeout(()=>i.classList.remove('addFlash'),500)
        }
      }
      
      
  }

  componentWillReceiveProps(newprops){
   let { like, dislike } = newprops;
   this.setState({likeNum:like,dislikeNum:dislike})

  }

  handleReply(){
    this.setState({visible:!this.state.visible});

  }

  handleDelete(commentid,parentcommentid){
      
      fetch(`/comment/delete?commentid=${commentid}&parentcommentid=${parentcommentid}&user=${localStorage.getItem('username')}`)
      .then(response=>response.json())
      .then(json=>{
        
        var comments = json.data;
        if (this.props.onDelete){
          this.props.onDelete(comments);
        }
      })
      
  }   

  handleDeleteReply(commentid,parentcommentid){
      fetch(`/comment/deleteReply?commentid=${commentid}&parentcommentid=${parentcommentid}&user=${localStorage.getItem('username')}`)
      .then(response=>response.json())
      .then(json=>{
        
        var comments = json.data;
        comments = comments.map(item=>{
              var username = localStorage.getItem('username');              
              item['owncomment'] = item.fromUser === username ? true : false;               
              return item                    
        })
        if (this.props.onSubCommentList){
          this.props.onSubCommentList(comments);
        }
      })
  }

  handleShare(commentid,parentcommentid){
    if(this.props.onVisible){
      this.props.onVisible(true,commentid,parentcommentid)
    }
  }

  handleGotoDetail(){
    console.log(this);
    var { history, commentid, parentcommentid } = this.props;
    fetch(`/comment/getCommentPagenum?commentid=${parentcommentid ? parentcommentid : commentid}`)
      .then(response=>response.json())
      .then(json=>{
          var data = json.data;
      })
  }

  render(){
    var { isLiked, isdisLiked, likeNum, dislikeNum, hide, visible } = this.state;
    var { username, fromUser, toUser, isSub,  commentid, showReplies, onShowReplies, socket,  forUser, replies,  parentcommentid, fathercommentid, owncomment, hasDelete, grayBg } = this.props;
    var _id = this.props.commentid;
    //console.log(this.props.like);
    
    //  父评论的id传递到子评论组件

    const commentsInputProps = {
      isParentReplyComment:isSub ? false : true,
      socket,
      isSub,
      fromUser,
      toUser,
      commentid,
      parentcommentid,
      onUpdateFromSub:this.props.onUpdateFromSub,
      onUpdateReplies:this.props.onUpdateReplies,
      onCloseReply:this.handleReply.bind(this)
    }
    //console.log(hasDelete);
    return (
      <div>
          <div className="comment-user-action">
               {
                  forUser
                  ?
                  <div>
                      <span onClick={this.handleGotoDetail.bind(this,commentid,parentcommentid)} ><Icon type="export" />回复 </span>
                      <span onClick={this.handleDeleteReply.bind(this,commentid,parentcommentid)} ><Icon type="export" />删除 </span>
                  </div>
                  :
                  <div>
                      <span ref={span=>this.likeDom=span} onClick={this.handleUserAction.bind(this,_id,'like',isLiked?'true':'',parentcommentid)}><Icon type="like" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>{isLiked?'取消点赞':'赞成' }<span className="num">{ likeNum  }</span></span>
                      <span ref={span=>this.dislikeDom=span} onClick={this.handleUserAction.bind(this,_id,'dislike',isdisLiked?'true':'',parentcommentid)}><Icon type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />{isdisLiked?'取消反对':'反对'}<span className="num">{ dislikeNum }</span></span>
                      <span onClick={this.handleReply.bind(this)} ><Icon type="edit" />回复{replies?<span className="num">{ replies.length }</span>:null}</span>               
                      <span onClick={this.handleShare.bind(this,commentid,parentcommentid)} ><Icon type="export" />转发 </span>
                      {
                          forUser
                          ?
                          null
                          :
                          replies
                          ?
                          replies.length
                          ?
                          <span onClick={()=>onShowReplies()} ><Icon type="menu-fold" />{showReplies?'折叠评论':'展开评论'} </span>
                          :
                          null
                          :
                          null                          
                      }
                      {
                          (owncomment && hasDelete)
                          ?
                          <span onClick={this.handleDeleteReply.bind(this,_id,parentcommentid)}><Icon type="close" />删除</span>
                          :
                          null
                      }
                  </div>
               }

               

               
          </div>
          {
            visible
            
            ?
            <CommentsInput {...commentsInputProps}/>
            :
            null
          }
          
        
      </div>
    )
    
  }
}



