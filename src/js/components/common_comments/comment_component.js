import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar, List, Card, Popover, Modal, Icon, Badge } from 'antd';

import CommentComponentButton from './comment_component_button';
import CommentPopoverUserAvatar from './comment_popover_useravatar';
import NewsListItem from '../news_list/news_list_item';
import TopicListItem  from '../topic_list/topic_list_item';
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

  handleUpdateReplies(replies){
    this.setState({replies});
  }

  handlePreview(boolean,img){
      this.setState({previewVisible:boolean,img})
  }

  handleDownload(url){
    var a = document.createElement('a');
    var event = new MouseEvent('click');
    a.download = url;
    a.href = url;
    a.dispatchEvent(event);
  }

  handleShowReplies(){
    this.setState({showReplies:!this.state.showReplies})
  }

  componentDidMount(){
    var { onSetScrollTop, comment, forUser, forMsg } = this.props;
    var { replies, selected, content, fromUser, replyTo, fromSubTextarea } = comment;
    if (selected &&this.commentDom){        
        var scrollTop = getElementTop(this.commentDom);
        if (onSetScrollTop) {
            setTimeout(()=>{             
              onSetScrollTop(scrollTop);
            },0)
        }
        setTimeout(()=>{
            this.commentDom.classList.remove('selected');
        },3000)
          
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
  }

  render(){
    let { parentcommentid, comment, commentType, isSub, socket, uniquekey, history, forUser, forMsg, msgId, msgRead, onDelete, onVisible, hasDelete, onShowList, onCheckLogin, onUpdateReplies, onSetScrollTop, onUpdateFromSub }= this.props;
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
      showReplies,
      owncomment,
      onCheckLogin,
      onShowReplies:this.handleShowReplies.bind(this),   
      onUpdateReplies:this.handleUpdateReplies.bind(this),
      onUpdateFromSub:onUpdateFromSub
    };
    
    return (

      <div>
          <div ref={comment=>this.commentDom = comment} className={forUser?'comment user':selected ? 'comment selected' :'comment'}>      
                    <div style={{display:'flex',alignItems:'center'}}>
                      <Popover content={<CommentPopoverUserAvatar user={fromUser.username}/>}>
                          <Badge count={ forMsg ? msgRead ? 0 : 1 : 0}><div className="avatar-container"><img src={fromUser.userImage} /></div></Badge>
                      </Popover>
                      <div style={{marginLeft:'10px'}}>
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
                                        <Popover content={<CommentPopoverUserAvatar user={item.user}/>}><span className="popover-content">{`@${item.user}`}</span></Popover>
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
                        //  判断images是否存在因为子评论没有images字段
                        images
                        ?
                        images.length
                        ?
                        images.map((item,index)=>(
                          <div className="img-container"  key={index}>
                            <div className="preview-mask" >
                              <Icon type="eye" onClick={this.handlePreview.bind(this,true,item)} style={{marginRight:'20px'}}/>
                              <Icon type="download" onClick={this.handleDownload.bind(this,item)}/>
                            </div>
                            <img src={item}/>
                          </div>
                        ))
                        :
                        null
                        :
                        null
                      }
                    </div>                   
                    {
                      forUser && onModel =='Article'
                      ?
                      <NewsListItem data={related} hasImg={true} forSimple={true} history={history}/> 
                      : 
                      forUser && onModel == 'Topic'
                      ?
                      <TopicListItem data={related} forSimple={true} history={history}/>
                      :
                      null
                    }                
                    <CommentComponentButton {...buttonProps}/> 
          </div>
                   
          {
              isSub
              ?
              null
              :
              replies && replies.length
              ?
              <div className="subcommentsContainer" style={{display:showReplies ? 'block':'none'}}>
                  {
                      replies.map((item,index)=>(
                          <CommentComponent 
                              socket={socket} 
                              history={history}                              
                              onCheckLogin={onCheckLogin}
                              onDelete={onDelete}
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
              </div>
              :
              null
          }
          
            
      </div>
  
    )
    
  }
}



