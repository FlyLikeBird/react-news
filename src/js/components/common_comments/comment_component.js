import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar, List, Card, Popover, Modal, Icon } from 'antd';


import  CommentsList  from './comments_list';
import CommentComponentButton from './comment_component_button';
import CommentPopoverUserAvatar from './comment_popover_useravatar';
import { parseDate, formatDate, getElementTop } from '../../../utils/translateDate';
const { Meta } = Card;

export default class CommentComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      replies:[],
      content:'',
      img:'',
      previewVisible:false,
      showReplies:true
    }
  }

  handleUpdateReplies(replies){
    //onsole.log(replies);
    this.setState({replies});
    
  }

  formatContent(content,fromSubTextarea,toUser){
    var str = content;
    var match = content.match(/@([^@]+)/g);
    if(!match){
      if(fromSubTextarea){
          return `回复<span style="color:#1890ff">@${toUser}</span>:`+str;
      } else {
          return str;
      }
    }
    for(var i=0,len=match.length;i<len;i++){
      str = str.replace(match[i],'<span style="color:#1890ff">'+match[i]+'</span>')
    }
    if(fromSubTextarea){
        return `回复<span style="color:#1890ff">@${toUser}</span>:`+str;

    } else {
        return str;
    }
    
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
    var { setScrollTop, comment, forTrack } = this.props;
    let { replies, selected } = comment;
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
    this.setState({replies})
  }
  
  componentWillReceiveProps(newProps){
      var { replies } = newProps.comment;
      this.setState({replies});
  }

  render(){
    
    let { username, content, date, _id, like, dislike, replies, fromUser, toUser, selected, fromSubTextarea, avatar, images, uniquekey, newstime, auth, type, title, thumbnail, fathercommentid, owncomment} = this.props.comment;

    let { parentcommentid, isSub, socket, history, index, forUser, grayBg, onDelete, onVisible, hasDelete, onShowList }= this.props;
    let { previewVisible, img, showReplies  } = this.state;
    let commentDate = formatDate(parseDate(date));
    
    //  有值的情况传值，如果parentcommentid不存在，一定要设置为空字符串
    parentcommentid = parentcommentid ? parentcommentid : fathercommentid ? fathercommentid : '';
    const buttonProps = {
      isSub,
      username,
      forUser,
      onDelete,
      onVisible,
      socket,
      uniquekey,
      replies:this.state.replies,
      history,
      hasDelete,
      grayBg,
      owncomment,
      commentid:_id,
      parentcommentid,
      like,
      dislike,
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
                      <Popover content={<CommentPopoverUserAvatar user={username?username:fromUser}/>}><div className="avatar-container"><img src={avatar} /></div></Popover>
                      <div>
                          <div><span style={{color:'#000',fontWeight:'500'}}>{username?username:fromUser}</span>{owncomment?<span className="label">用户</span>:null}</div>
                          <span className="text">{`发布于 ${commentDate}`}</span>
                      </div>
                    </div>
                    <div className="comment-content">
                        <span dangerouslySetInnerHTML={{__html:this.formatContent(content,fromSubTextarea,toUser)}}></span>
                        {
                          forUser
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
                      forUser
                      ?
                      <div className="comment-article">
                        <div style={{display:'flex',alignItems:'center'}}>
                                <div className="article-img"><img src={thumbnail} /></div> 
                                <div >
                                    <h4><Link style={{color:'rgba(0, 0, 0, 0.85)'}} to={`/details/${uniquekey}`}>{title}</Link></h4>
                                    <div>
                                        <span className="text">发布时间: <span className="mark">{newstime}</span></span>
                                        <span className="text">来源: <span className="mark">{auth}</span></span>
                                        <span className="text">类型: <span className="mark">{type}</span></span>
                                    </div>
                                    {this.props.isSelfUser?<div style={actionStyle}><a onClick={this.handleRemoveComment.bind(this,item.commentId,item.subCommentId)}>删除</a></div> : null}
                                </div>
                            </div>
                      </div>
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



