import React from 'react';
import { Icon, Popover } from 'antd';
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
      visible:false,
      isRead:false,
      iconType:'caret-left'     
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

  componentDidMount(){
      var { isRead } = this.props;
      this.setState({isRead})
  }

  componentWillReceiveProps(newprops){
   let { like, dislike } = newprops;
   this.setState({likeNum:like,dislikeNum:dislike})

  }

  handleReply(){
    var { hasDelete } = this.props;
    if ( hasDelete ) return;
    this.setState({visible:!this.state.visible});
  }

  handleDelete(commentid,parentcommentid){
      var { onDelete } = this.props;
      if( onDelete ) onDelete(true,commentid,parentcommentid);
  }

  handleShare(commentid,parentcommentid){
    if(this.props.onVisible){
      this.props.onVisible(true,commentid,parentcommentid)
    }
  }

  handleMarkIsRead(id){
    var { socket } = this.props;
    socket.emit('markActionMsg',localStorage.getItem('userid'),id);
    this.setState({isRead:!this.state.isRead})
  }

  handleGotoDetail(commentid,parentcommentid){
    var { history, uniquekey } = this.props;
    fetch(`/comment/getCommentPagenum?commentid=${commentid}&parentcommentid=${parentcommentid?parentcommentid:''}&uniquekey=${uniquekey}`)
      .then(response=>response.json())
      .then(json=>{
          var pageNum = json.data;
          if (history){
              console.log(history);
              history.push(`/details/${uniquekey}`,{
                  pageNum,
                  commentid,
                  parentcommentid,
                  forTrack:true
              })
          }
      })
  }

  render(){
    var { isLiked, isdisLiked, likeNum, dislikeNum, hide, isRead, iconType, visible } = this.state;
    var { username, fromUser, toUser, isSub,  commentid, commentType, showReplies, onShowReplies, socket, shareBy, forUser, forMsg, replies, commentid, parentcommentid, fathercommentid, owncomment, hasDelete, grayBg } = this.props;
    var _id = this.props.commentid;
    //  父评论的id传递到子评论组件
    const commentsInputProps = {
      isParentReplyComment:isSub ? false : true,
      socket,
      isSub,
      commentType,
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
                  forUser && !forMsg
                  ?
                  <div>
                      <span onClick={this.handleGotoDetail.bind(this,commentid,parentcommentid)} ><Icon type="edit" />回复</span>
                      <span onClick={this.handleDelete.bind(this,commentid,parentcommentid)} ><Icon type="close" />删除</span>
                  </div>
                  :
                  forMsg
                  ?
                  <div>
                      <span onClick={this.handleGotoDetail.bind(this,commentid,parentcommentid)} ><Icon type="edit" />回复</span>
                      <span onClick={this.handleMarkIsRead.bind(this,_id)} ><Icon type="edit" />{ isRead ? '标为未读':'标为已读'}</span>
                      <span onClick={this.handleDelete.bind(this,_id)} ><Icon type="close" />删除</span>
                  </div>
                  :
                  <div>
                      <Popover content={<div>hello</div>}><span ref={span=>this.likeDom=span} onClick={this.handleUserAction.bind(this,_id,'like',isLiked?'true':'',parentcommentid)}><Icon type="like" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>{isLiked?'取消点赞':'赞成' }<span className="num">{ likeNum  }</span><Icon className="caret" type={iconType}/></span></Popover>
                      <Popover content={<div>hello</div>}><span ref={span=>this.dislikeDom=span} onClick={this.handleUserAction.bind(this,_id,'dislike',isdisLiked?'true':'',parentcommentid)}><Icon type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />{isdisLiked?'取消反对':'反对'}<span className="num">{ dislikeNum }</span><Icon className="caret" type={iconType}/></span></Popover>
                      {
                          isSub && hasDelete
                          ?
                          null
                          :
                          <span onClick={this.handleReply.bind(this)} ><Icon type="edit" />回复{replies?<span className="num">{ replies.length }</span>:null}</span>
                      }
                                     
                      {
                          hasDelete
                          ?
                          null
                          :
                          <span onClick={this.handleShare.bind(this,commentid,parentcommentid)} ><Icon type="export" />转发 <span className="num">{ shareBy.length }</span><Icon className="caret" type={iconType}/></span>
                      }
                      
                      {
                          
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
                          <span onClick={this.handleDelete.bind(this,commentid,parentcommentid)}><Icon type="close" />删除</span>
                          :
                          null
                      }
                  </div>
               }              
          </div>

          <div style={{display:visible?'block':'none'}}>
            <CommentsInput {...commentsInputProps}/>
          </div>
                  
      </div>
    )
    
  }
}



