import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar, List, Card, Popover, Modal, Icon, Badge } from 'antd';

import  CommentsList  from './comments_list';
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
      img:'',
      translateData:[],
      previewVisible:false,
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

  componentWillMount(){
    var { onSetScrollTop, comment, forTrack, forUser, forMsg } = this.props;
    var { replies, selected, content, fromUser, toUser, fromSubTextarea, commentType, uniquekey } = comment;
    if (selected){       
        var selectedDom = document.getElementsByClassName('comment selected')[0];
        if (selectedDom){            
            var scrollTop = getElementTop(selectedDom);
            if (onSetScrollTop) {
                setTimeout(()=>{
                  onSetScrollTop(scrollTop);
                },0)
            }
            setTimeout(()=>{
                selectedDom.classList.remove('selected');
            },3000)
        }   
    }

    if (forTrack) {
      this.setState({showReplies:selected});
    }
    var str = fromSubTextarea ? `回复@${toUser.username}:${content}` : `${content}`;
    var translateData = formatContent(str);
    this.setState({replies, translateData})
  }
  
  componentWillReceiveProps(newProps){    
      if (this.props.comment._id != newProps.comment._id){     
          var { replies, toUser, fromSubTextarea, content } = newProps.comment;
          var str = fromSubTextarea ? `回复@${toUser.username}:${content}` : `${content}`;
          var translateData = formatContent(str);  
          this.setState({replies, translateData});
      }   
  }

  render(){
    let { parentcommentid, comment, isSub, socket, history, forUser, forMsg, onDelete, onVisible, hasDelete, onShowList }= this.props;
    let { fromUser, toUser, content, date, _id,  likeUsers, dislikeUsers, commentType, shareBy, selected, isRead, fromSubTextarea, images, uniquekey } = comment;
    var userid = localStorage.getItem('userid');
    let { previewVisible, img, showReplies, replies, translateData  } = this.state;
    let commentDate = formatDate(parseDate(date));
    //  有值的情况传值，如果parentcommentid不存在，一定要设置为空字符串
    parentcommentid = parentcommentid ? parentcommentid : '';
    var owncomment = userid == fromUser._id ? true : false;
    const buttonProps = {
      isSub,
      forUser,
      forMsg,
      isRead,
      onDelete,
      onVisible,
      socket,
      shareBy,
      likeUsers,
      dislikeUsers,
      uniquekey,
      replies,
      history,
      fromUser,
      toUser,
      hasDelete,
      commentType,
      commentid:_id,
      parentcommentid,
      showReplies, 
      onShowReplies:this.handleShowReplies.bind(this),   
      onUpdateReplies:this.handleUpdateReplies.bind(this),
      onUpdateFromSub:this.props.onUpdateFromSub
    };
    
    return (

      <Card className={forUser?'comment user':selected ? 'comment selected' :'comment'}>
                <div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      <Popover content={<CommentPopoverUserAvatar user={fromUser.username}/>}>
                          <Badge count={forMsg?isRead?0:1:0}><div className="avatar-container"><img src={fromUser.userImage} /></div></Badge>
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
                          <span className="comment-button" onClick={()=>onShowList(true,_id,parentcommentid)}>管理评论列表<Icon type="caret-right" /></span>
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
                    {/*
                    {
                      forUser || forMsg ? commentType == 'news' ? 
                      <NewsListItem uniquekey={uniquekey} hasImg={true} forSimple={true}/> 
                      : 
                      commentType == 'topic'
                      ?
                      <TopicListItem uniquekey={uniquekey} history={history} hasLink={true} forSimple={true}/>
                      :
                      null
                      :
                      null
                    }
                  */}
                    
                    <CommentComponentButton {...buttonProps}/> 
                    
                    {
                      forUser
                      ?
                      null
                      :
                      isSub 
                      ?
                      null
                      :
                      <div style={{display:showReplies?'block':'none'}}>
                        <CommentsList
                            isSub={true} 
                            commentid={_id} 
                            comments={replies}
                            commentType={commentType} 
                            hasDelete={hasDelete} 
                            onVisible={onVisible}
                            onDelete={onDelete}
                            onUpdateFromSub={this.handleUpdateReplies.bind(this)} 
                          />
                      </div>                      
                    }
                    <Modal className="no-bg" visible={previewVisible} maskClosable={true} onCancel={()=>this.handlePreview(false)} footer={null}>
                      <img src={img} />
                    </Modal>
                    
                    
                </div>
            
      </Card>
  
    )
    
  }
}



