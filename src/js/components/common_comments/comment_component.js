import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar, List, Card, Popover, Modal, Icon, Badge } from 'antd';

import  CommentsList  from './comments_list';
import CommentComponentButton from './comment_component_button';
import CommentPopoverUserAvatar from './comment_popover_useravatar';
import { NewsListItem } from '../pc/pc_usercenter/pc_newslist';
import { TopicListItem } from '../pc/pc_topic/pc_topic_list';

import { parseDate, formatDate, getElementTop, formatContent } from '../../../utils/translateDate';
const { Meta } = Card;

export default class CommentComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      replies:[],
      item:{},
      img:'',
      previewVisible:false,
      showReplies:true,
      translateData:[]
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
    var { setScrollTop, comment, forTrack, forUser, forMsg } = this.props;
    var { replies, selected, content, commentType, uniquekey } = comment;
    var data = formatContent(content);
    if (selected){
        var selectedDom = document.getElementsByClassName('comment selected')[0];
        if (selectedDom){
            var scrollTop = getElementTop(selectedDom);
            if (setScrollTop) setScrollTop(scrollTop);
            setTimeout(()=>{
                selectedDom.classList.remove('selected');
            },3000)
        }   
    }
    if (forTrack) {
      this.setState({showReplies:selected});
    }
    if ( forUser || forMsg ) {
        //  加载评论相关的内容信息，如话题/新闻/动态
        if (commentType === 'topic'){
            fetch(`/topic/getTopicDetail?topicId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({item:data})
                })
        } else if (commentType === 'news'){
            fetch(`/article/getArticleContent?uniquekey=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data= json.data;
                    this.setState({item:data});
                })
        } else if (commentType === 'action') {

        }
    }
    
    this.setState({replies,translateData:data})
  }
  

  componentWillReceiveProps(newProps){
      var { replies, content  } = newProps.comment;
      var data = formatContent(content);
      this.setState({replies,translateData:data});
  }

  render(){
    
    let { username, content, date, _id,  replies, fromUser, toUser, likeUsers, dislikeUsers, commentType, shareBy, selected, isRead, fromSubTextarea, avatar, images, uniquekey, fathercommentid, owncomment} = this.props.comment;
    let { parentcommentid, isSub, socket, history, index, forUser, forMsg, grayBg, onDelete, onVisible, hasDelete, onShowList }= this.props;
    let { previewVisible, img, showReplies, translateData, item  } = this.state;
    let commentDate = formatDate(parseDate(date));
    
    //  有值的情况传值，如果parentcommentid不存在，一定要设置为空字符串
    parentcommentid = parentcommentid ? parentcommentid : fathercommentid ? fathercommentid : '';
    const buttonProps = {
      isSub,
      username,
      forUser,
      forMsg,
      isRead,
      shareBy,
      onDelete,
      onVisible,
      socket,
      likeUsers,
      dislikeUsers,
      uniquekey,
      replies:this.state.replies,
      history,
      hasDelete,
      commentType,
      grayBg,
      owncomment,
      commentid:_id,
      parentcommentid,
      commentDate,
      fromUser:localStorage.getItem('username'),
      toUser:username?username:fromUser,
      showReplies, 
      onShowReplies:this.handleShowReplies.bind(this),   
      onUpdateReplies:this.handleUpdateReplies.bind(this),
      onUpdateFromSub:this.props.onUpdateFromSub
    };
    
    return (

      <Card className={forUser?'comment user':selected ? 'comment selected' :'comment'}>
                <div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      <Popover content={<CommentPopoverUserAvatar user={username?username:fromUser}/>}>
                          <Badge count={forMsg?isRead?0:1:0}><div className="avatar-container"><img src={avatar} /></div></Badge>
                      </Popover>
                      <div style={{marginLeft:'10px'}}>
                          <div><span style={{color:'#000',fontWeight:'500'}}>{username?username:fromUser}</span>{owncomment?<span className="label">用户</span>:null}</div>
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
                            <span>{content}</span>
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
                    
                    {
                      forUser || forMsg ? commentType == 'news' ? 
                      <NewsListItem item={item} hasImg={true} /> 
                      : 
                      commentType == 'topic'
                      ?
                      <TopicListItem item={item} noAction={true} history={history} forSimple={true}/>
                      :
                      null
                      :
                      null
                    }
                    
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
                            comments={this.state.replies}
                            commentType={commentType} 
                            hasDelete={hasDelete} 
                            onVisible={onVisible}
                            onDelete={onDelete}
                            onUpdateFromSub={this.handleUpdateReplies.bind(this)} 
                            grayBg={grayBg}/>
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



