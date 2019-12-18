import React from 'react';
import { Icon, Popover, message } from 'antd';
import CommentsInput from './comments_input';
import TopicItemPopover from '../topic_list/topic_item_popover';
import { parseDate, formatDate } from '../../../utils/translateDate';

var isAllowed = true ;

export default class CommentComponentButton extends React.Component{
  constructor(){
    super();   
    this.state={
      isLiked:false,
      isdisLiked:false,
      likeUsers:[],
      dislikeUsers:[],
      shareBy:[],
      visible:false,
      iconType:'caret-left'     
    }
  }

  handleUserAction(commentid,action,isCancel){ 
    var { onCheckLogin } = this.props;
    var userid = onCheckLogin();
    if ( userid ){
        fetch('/api/comment/operatecomment?action='+action+'&commentid='+commentid +'&isCancel='+isCancel  +'&userid='+userid)
          .then(response=>response.json())
          .then(json=>{            
            var data = json.data;  
            var { likeUsers, dislikeUsers } = data;         
            if (action == 'like' && !Boolean(isCancel)) {
              this.setState({isLiked:true,likeUsers});
            } else if (action == 'like' && Boolean(isCancel)){
              this.setState({isLiked:false,likeUsers})
            } else if (action == 'dislike' && !Boolean(isCancel)){
              this.setState({isdisLiked:true,dislikeUsers})
            } else if (action == 'dislike' && Boolean(isCancel)){
              this.setState({isdisLiked:false,dislikeUsers})
            }
          })
        //  用户评论后加积分逻辑     
        if ( isAllowed ) {
          if(action === 'like' && !isCancel )
          fetch(`/api/usr/operatecomment?userid=${userid}`)
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
              span.classList.add('addFlash');
              setTimeout(()=>span.classList.remove('addFlash'),500)
          }
        } else if(action == 'dislike'){
          if(this.dislikeDom){
            var span = this.dislikeDom;
            span.classList.add('addFlash');
            setTimeout(()=>span.classList.remove('addFlash'),500)
          }
        }    
    } else {
        message.warning('请先登录之后再操作!')
    } 
     
  }

  _setPropsToState(props){
      var { likeUsers, dislikeUsers, shareBy } = props;
      var userid = localStorage.getItem('userid');
      var isLiked = likeUsers.map(item=>item.user._id).includes(userid), isdisLiked = dislikeUsers.map(item=>item.user._id).includes(userid);
      this.setState({likeUsers,dislikeUsers,shareBy, isLiked,isdisLiked});
  }

  componentWillReceiveProps(newProps){
      if (this.props.commentid != newProps.commentid){
          this._setPropsToState(newProps);
      }    
  }

  componentDidMount(){
      this._setPropsToState(this.props);
  }

  handleReply(){
    var { hasDelete, onCheckLogin } = this.props;
    if ( onCheckLogin()){
        this.setState({visible:!this.state.visible});
    }   
  }

  handleDelete(commentid, parentcommentid){
      var { onDelete, onModel } = this.props;
      if( onDelete ) onDelete(true, commentid, parentcommentid);
  }

  handleDeleteMsg(msgId){
      console.log(msgId);
      var { socket } = this.props;
      socket.emit('deleteMsg',localStorage.getItem('userid'), msgId);
  }

  handleShare(commentid){
    var { onVisible, onCheckLogin } = this.props;
    var userid = onCheckLogin();
    if (userid){
        if ( onVisible ) onVisible(true, commentid, this._updateShareByUsers.bind(this))
    } 
  }

  _updateShareByUsers(data){
      var { shareBy } = data;
      this.setState({shareBy})
  }

  handleMarkIsRead(id){
    var { socket } = this.props;
    socket.emit('markActionMsg',localStorage.getItem('userid'),id);
  }

  handleGotoDetail(commentid,parentcommentid){
    var { history, related, onModel } = this.props;
    fetch(`/api/comment/getCommentPagenum?commentid=${commentid}&parentcommentid=${parentcommentid}&uniquekey=${related._id}`)
      .then(response=>response.json())
      .then(json=>{
          var pageNum = json.data;
          if (history){                          
              if (onModel == 'Article') {                  
                  history.push(`/details/${related._id}?pageNum=${pageNum}&commentid=${commentid}&parentcommentid=${parentcommentid}`)                 
              } else if (onModel =='Topic'){
                  history.push(`/topic/${related._id}?pageNum=${pageNum}&commentid=${commentid}&parentcommentid=${parentcommentid}`)
              } else if (onModel =='Action') {
                  history.push(`/action/${related._id}?pageNum=${pageNum}&commentid=${commentid}&parentcommentid=${parentcommentid}`)

              }
              
          }
      })
  }

  render(){
    var { isLiked, isdisLiked, hide, likeUsers, dislikeUsers, shareBy, isRead, iconType, visible } = this.state;
    var { history, isSub,  uniquekey, fromUser, commentid, parentcommentid, commentType, showReplies, socket, forUser, forMsg, msgId, msgRead, replies, owncomment, onCheckLogin, hasDelete } = this.props;
    //  父评论的id传递到子评论组件
    const commentsInputProps = {
      socket,
      isSub,
      // 评论管理页没有uniquekey/commentType属性，兼容处理
      uniquekey,
      commentType,
      commentid,
      parentcommentid,
      onCheckLogin,
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
                      <span onClick={this.handleGotoDetail.bind(this, commentid, parentcommentid)} ><span className="text"><Icon type="edit" />回复</span></span>
                      <span onClick={this.handleDelete.bind(this,commentid, parentcommentid)} ><span className="text"><Icon type="close" />删除</span></span>
                  </div>
                  :
                  forMsg
                  ?
                  <div>
                      <span onClick={this.handleGotoDetail.bind(this, commentid, parentcommentid)} ><span className="text"><Icon type="edit" />回复</span></span>
                      <span onClick={this.handleMarkIsRead.bind(this, msgId)} ><span className="text"><Icon type="bell" />{ msgRead ? '标为未读':'标为已读'}</span></span>
                      <span onClick={this.handleDeleteMsg.bind(this, msgId)} ><span className="text"><Icon type="close" />删除</span></span>
                  </div>
                  :
                  <div>
                      <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={likeUsers} history={history} text="赞" />}>
                          <span ref={span=>this.likeDom=span} onClick={this.handleUserAction.bind(this, commentid,'like',isLiked?'true':'')}><span className="text"><Icon type="like" className="motion" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>{isLiked?'取消点赞':'赞成' }<span className="num">{ likeUsers.length  }</span><Icon className="caret" type={iconType}/></span></span>
                      </Popover> 
                      <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={dislikeUsers} history={history} text="踩" />}>
                          <span ref={span=>this.dislikeDom=span} onClick={this.handleUserAction.bind(this, commentid ,'dislike',isdisLiked?'true':'')}><span className="text"><Icon className="motion" type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />{isdisLiked?'取消反对':'反对'}<span className="num">{ dislikeUsers.length }</span><Icon className="caret" type={iconType}/></span></span>
                      </Popover>
                      
                      <span onClick={this.handleReply.bind(this)} ><span className="text"><Icon type="edit" />回复{isSub?null:<span className="num">{ replies.length }</span>}</span></span>
                      
                                     
                      {
                          hasDelete
                          ?
                          null
                          :
                          <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={shareBy} forShare={true} history={history} text="转发" />}><span onClick={this.handleShare.bind(this,commentid)} ><span className="text"><Icon type="export" />转发 <span className="num">{ shareBy.length }</span><Icon className="caret" type={iconType}/></span></span></Popover>
                      }
                      
                      {
                          (owncomment && hasDelete)
                          ?
                          <span onClick={this.handleDelete.bind(this,commentid)}><span className="text"><Icon type="close" />删除</span></span>
                          :
                          null
                      }
                  </div>
               }              
          </div>
          {
              forUser
              ?
              null
              :
              <div style={{display:visible?'block':'none'}}>
                  <CommentsInput {...commentsInputProps}/>
              </div>
          }                
      </div>
    )
    
  }
}



