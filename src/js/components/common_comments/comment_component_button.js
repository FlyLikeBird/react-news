import React from 'react';
import { Icon, Popover, message } from 'antd';
import CommentsInput from './comments_input';
import TopicItemPopover from '../topic_list/topic_item_popover';
import { parseDate, formatDate } from '../../../utils/translateDate';

var isAllowed = true ;

export default class CommentsComponentButton extends React.Component{
  constructor(){
    super();   
    this.state={
      isLiked:false,
      isdisLiked:false,
      likeUsers:[],
      dislikeUsers:[],
      shareBy:[],
      visible:false,
      isRead:false,
      iconType:'caret-left'     
    }
  }

  handleUserAction(commentid,action,isCancel){ 
    var userid = localStorage.getItem('userid');
    if (userid){
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
      this._setPropsToState(newProps);
  }

  componentDidMount(){
      this._setPropsToState(this.props);
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
    var { onVisible } = this.props;
    if ( onVisible ) onVisible(true, commentid, parentcommentid, this._updateShareByUsers.bind(this))
  }

  _updateShareByUsers(data){
      this.setState({shareBy:data})
  }

  handleMarkIsRead(id){
    var { socket } = this.props;
    socket.emit('markActionMsg',localStorage.getItem('userid'),id);
    this.setState({isRead:!this.state.isRead})
  }

  handleGotoDetail(commentid,parentcommentid){
    var { history, uniquekey, commentType } = this.props;
    fetch(`/api/comment/getCommentPagenum?commentid=${commentid}&parentcommentid=${parentcommentid?parentcommentid:''}&uniquekey=${uniquekey}`)
      .then(response=>response.json())
      .then(json=>{
          var pageNum = json.data;
          if (history){
              if (commentType == 'news') {
                  history.push(`/details/${uniquekey}?pageNum=${pageNum}&commentid=${commentid}&parentcommentid=${parentcommentid}&forTrack=${true}&`)                 
              } else if (commentType =='topic'){
                  history.push(`/topic/${uniquekey}?pageNum=${pageNum}&commentid=${commentid}&parentcommentid=${parentcommentid}&forTrack=${true}&`)
              }
              
          }
      })
  }

  render(){
    var { isLiked, isdisLiked, hide, likeUsers, dislikeUsers, shareBy, isRead, iconType, visible } = this.state;
    var { history, isSub,  uniquekey, fromUser, toUser, commentid, parentcommentid, commentType, showReplies, onShowReplies, socket, forUser, forMsg, replies, owncomment, hasDelete } = this.props;
    //  父评论的id传递到子评论组件
    const commentsInputProps = {
      socket,
      isSub,
      uniquekey,
      commentType,
      fromUser:localStorage.getItem('userid'),
      toUser:fromUser._id,
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
                      <span onClick={this.handleGotoDetail.bind(this,commentid,parentcommentid)} ><span className="text"><Icon type="edit" />回复</span></span>
                      <span onClick={this.handleDelete.bind(this,commentid,parentcommentid)} ><span className="text"><Icon type="close" />删除</span></span>
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
                      <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={likeUsers} history={history} text="赞" />}>
                          <span ref={span=>this.likeDom=span} onClick={this.handleUserAction.bind(this, commentid,'like',isLiked?'true':'')}><span className="text"><Icon type="like" className="motion" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>{isLiked?'取消点赞':'赞成' }<span className="num">{ likeUsers.length  }</span><Icon className="caret" type={iconType}/></span></span>
                      </Popover> 
                      <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={dislikeUsers} history={history} text="踩" />}>
                          <span ref={span=>this.dislikeDom=span} onClick={this.handleUserAction.bind(this, commentid ,'dislike',isdisLiked?'true':'')}><span className="text"><Icon className="motion" type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />{isdisLiked?'取消反对':'反对'}<span className="num">{ dislikeUsers.length }</span><Icon className="caret" type={iconType}/></span></span>
                      </Popover>
                      {
                          isSub && hasDelete
                          ?
                          null
                          :
                          <span onClick={this.handleReply.bind(this)} ><span className="text"><Icon type="edit" />回复{isSub?null:<span className="num">{ replies.length }</span>}</span></span>
                      }
                                     
                      {
                          hasDelete
                          ?
                          null
                          :
                          <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={shareBy} forShare={true} history={history} text="转发" />}><span onClick={this.handleShare.bind(this,commentid,parentcommentid)} ><span className="text"><Icon type="export" />转发 <span className="num">{ shareBy.length }</span><Icon className="caret" type={iconType}/></span></span></Popover>
                      }
                      
                      {                          
                          isSub
                          ?
                          null
                          :
                          replies.length
                          ?
                          <span onClick={()=>onShowReplies()} ><span className="text"><Icon type="menu-fold" />{showReplies?'折叠评论':'展开评论'}</span></span>
                          :
                          null                                                 
                      }
                      {
                          (owncomment && hasDelete)
                          ?
                          <span onClick={this.handleDelete.bind(this,commentid,parentcommentid)}><span className="text"><Icon type="close" />删除</span></span>
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



