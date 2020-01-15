import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar, List, Card, Popover, Modal, Icon, Badge } from 'antd';

import CommentComponentButton from './comment_component_button';
import CommentPopoverUserAvatar from '../popover_user_avatar';
import NewsListItem from '../news_list/news_list_item';
import TopicListItem  from '../topic_list/topic_list_item';
import UpdateInnerItem from '../update_list/inner_update_item';
import ImgContainer from '../img_container';
import { parseDate, formatDate, getElementTop, formatContent } from '../../../utils/translateDate';
const { Meta } = Card;

export default class CommentComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      replies:[],
      translateData:[],
      showReplies:true
    }
  }

  handleUpdateReplies(data){
    var { onUpdateTotalNum, onUpdateItemComments } = this.props;
    var { total, comments, doc } = data;
    this.setState({replies:comments[0].replies});
    if (onUpdateTotalNum) onUpdateTotalNum(total);
    if (onUpdateItemComments) onUpdateItemComments(doc);
  }

  handleShowReplies(){
      var subContainer = this.subContainer;
      var { showReplies } = this.state;
      if (subContainer){
          if (showReplies){
              subContainer.style.transform = 'scale(0)';
              setTimeout(()=>{
                  subContainer.style.display = 'none';
              },300)
          } else {
              subContainer.style.display = 'block';
              setTimeout(()=>{
                  subContainer.style.transform = 'scale(1)';
              },0)
          }
      }
      
      this.setState({showReplies:!this.state.showReplies});
  }

  componentDidMount(){
    var { onSetScrollTop, comment, forUser, forMsg } = this.props;
    var { replies, selected, content, fromUser, replyTo, fromSubTextarea } = comment;
    if (selected &&this.commentDom){    
        this.setState({showReplies:true});    
        var scrollTop = getElementTop(this.commentDom);
        if (onSetScrollTop) {
            setTimeout(()=>{             
              onSetScrollTop(scrollTop);
            },300)
        }
        setTimeout(()=>{
            this.commentDom.classList.remove('selected');
        },4000)
          
    }
    var str = fromSubTextarea ? replyTo ? `回复@${replyTo.fromUser.username}:${content}` : `${content}` : `${content}` ;
    var translateData = formatContent(str);
    this.setState({replies, translateData})
  }
  
  componentWillReceiveProps(newProps){
      var { forMsg, msgId } = this.props;
      if ( forMsg ) {
          if (this.props.msgId != newProps.msgId){
              var { replies, replyTo, fromSubTextarea, content } = newProps.comment;
              var str = fromSubTextarea ? `回复@${replyTo.fromUser.username}:${content}` : `${content}`;
              var translateData = formatContent(str);  
              this.setState({replies, translateData});
          }
      } else if( this.props.comment._id != newProps.comment._id ){
          var { replies, replyTo, fromSubTextarea, content } = newProps.comment;
          var str = fromSubTextarea ? `回复@${replyTo.fromUser.username}:${content}` : `${content}`;
          var translateData = formatContent(str);  
          this.setState({replies, translateData});
      }  
        
  }

  componentWillUnmount(){
      this.commentDom = null;
      this.subContainer = null;
  }

  handleGogoMobileUsercenter(id){
    var { history } = this.props;
    if (history) history.push(`/usercenter/${id}`);
  }
  
  render(){
    let { parentcommentid, comment, commentType, forMobile, isSub, socket, uniquekey, history, forUser, forMsg, msgId, msgRead, onDelete, onVisible, hasDelete, onShowList, onCheckLogin, onUpdateReplies, onSetScrollTop, onUpdateFromSub }= this.props;
    let { fromUser, toUser, content, date, _id,  likeUsers, dislikeUsers, related, onModel, shareBy, selected, isRead, parent, fromSubTextarea, images } = comment;
    var userid = localStorage.getItem('userid');
    let { previewVisible, img, showReplies, replies, translateData  } = this.state;
    let commentDate = formatDate(parseDate(date));
    //  有值的情况传值，如果parentcommentid不存在，一定要设置为空字符串
    parentcommentid = parentcommentid ? parentcommentid : parent ? parent : '';
    var owncomment = userid == fromUser._id ? true : false;
    const buttonProps = {
      isSub,
      forUser,
      forMsg,
      forMobile,
      msgId,
      msgRead,
      onDelete,
      onVisible,
      socket,
      shareBy,
      likeUsers,
      dislikeUsers,
      uniquekey:uniquekey ? uniquekey : related,
      replies,
      history,
      fromUser,
      toUser,
      hasDelete,
      commentType:commentType ? commentType : onModel,
      onModel,
      related,
      commentid: _id,
      parentcommentid,
      owncomment,
      onCheckLogin,  
      onUpdateReplies:this.handleUpdateReplies.bind(this),
      onUpdateFromSub:onUpdateFromSub
    };
    
    return (

      <div>
          <div ref={comment=>this.commentDom = comment} className={forUser?'comment user':selected ? 'comment selected' :'comment'}>      
                    <div className="comment-user-info">
                        {
                            forMobile
                            ?
                            <div className="badge-container" onClick={this.handleGogoMobileUsercenter.bind(this,fromUser._id)}><Badge count={ forMsg ? msgRead ? 0 : 1 : 0}><span className="avatar-container" ><img src={fromUser.userImage} /></span></Badge></div>
                            :
                            <Popover autoAdjustOverflow={false} placement="right" content={<CommentPopoverUserAvatar user={fromUser.username} onCheckLogin={onCheckLogin} history={history}/>}>
                                <div className="badge-container"><Badge count={ forMsg ? msgRead ? 0 : 1 : 0}><span className="avatar-container" ><img src={fromUser.userImage} /></span></Badge></div>
                            </Popover>
                        }
                        
                        <div style={{marginLeft:forUser?'10px':'0'}}>
                            <div><span style={{color:'#000',fontWeight:'500'}}>{fromUser.username}</span>{ owncomment ?<span className="label">用户</span>:null}</div>
                            <span className="text">{`发布于 ${commentDate}`}</span>
                        </div>
                    </div>
                    <div className="comment-content">
                        {
                            translateData.length
                            ?
                            translateData.map((item,index)=>(
                                <span key={index}>
                                    <span>{item.text}</span>
                                    {
                                        item.user
                                        ?
                                        <Popover autoAdjustOverflow={false} placement="top" content={<CommentPopoverUserAvatar user={item.user} history={history} onCheckLogin={onCheckLogin}/>}><span className="popover-content">{`@${item.user}`}</span></Popover>
                                        :
                                        null
                                    }
                                    
                                </span>
                            ))
                            :
                            <span>{ content }</span>
                        }
                        {
                          forUser && !forMsg
                          ?               
                          <span className="comment-button" onClick={()=>onShowList(true, parent?parent:_id)}>管理评论列表<Icon type="caret-right" /></span>
                          :
                          null
                        
                        }
                    </div>
                    <div>
                      {
                        forUser
                        ?
                        null
                        :
                        //  判断images是否存在因为子评论没有images字段
                        images && images.length
                        ?
                        images.map((item,index)=>(
                          <ImgContainer bg={item} key={index} />
                        ))
                        :
                        null
                      }
                    </div>                   
                    {
                      forUser && onModel =='Article'
                      ?
                      <div style={{padding:'20px',backgroundColor:'#f7f7f7'}}><NewsListItem data={related} hasImg={true} forSimple={true} history={history}/></div>
                      : 
                      forUser && onModel == 'Topic'
                      ?
                      <TopicListItem data={related} forSimple={true} history={history}/>
                      :
                      forUser && onModel == 'Action'
                      ?
                      <UpdateInnerItem data={related} history={history} forComment={true}/>
                      :
                      null
                    }                
                    <CommentComponentButton {...buttonProps}/> 
                    {
                        showReplies
                        ?
                        null
                        :
                        <span className="hidden open" onClick={this.handleShowReplies.bind(this)}><Icon type="double-left" style={{transform:'rotate(-90deg) scale(0.8)'}}/><span className="text">展开评论</span></span>
                                             
                    }
          </div>

                 
          {
              isSub
              ?
              null
              :
              replies && replies.length
              ?
              <div ref={subContainer=>this.subContainer=subContainer} className='subcommentsContainer'>
                  {
                      replies.map((item,index)=>(
                          <CommentComponent 
                              socket={socket} 
                              history={history}                              
                              onCheckLogin={onCheckLogin}
                              onDelete={onDelete}
                              onVisible={onVisible}
                              onUpdateFromSub={this.handleUpdateReplies.bind(this)}
                              onSetScrollTop={onSetScrollTop} 
                              isSub={true}
                              hasDelete={hasDelete}
                              uniquekey={uniquekey}
                              parentcommentid={_id}
                              comment={item}
                              key={index}
                              commentType={commentType}                         
                          />
                      ))
                  }
                  <span className="hidden close" onClick={this.handleShowReplies.bind(this)}><Icon type="double-left" style={{transform:'rotate(90deg) scale(0.8)'}}/><span className="text">折叠评论</span></span>
              </div>
              :
              null
          }
          
            
      </div>
  
    )
    
  }
}



