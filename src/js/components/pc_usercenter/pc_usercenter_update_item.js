import React from 'react';
import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card, Popover, Menu, Dropdown  } from 'antd';

import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';
import CommentsInput from '../common_comments/comments_input';
import CommentsList  from '../common_comments/comments_list';

import { TopicListItem } from '../pc_topic/pc_topic_list';
import { NewsListItem } from './pc_newslist';

var isAllowed = true;

export default class UpdateItem extends React.Component{
    
    constructor(){
        super();
        this.state = {
            item:{},
            isLiked:false,
            isdisLiked:false,
            likeNum:0,
            dislikeNum:0,
            contentData:[],
            visible:false,
            replies:[]
        }
    }

    componentDidMount(){
        var { data } = this.props;
        var { actionType, uniquekey, content, like, dislike, shareBy, id } = data;
        var username = localStorage.getItem('username');
        //  加载动态相关的信息
        if (actionType === 'topic'){
            fetch(`/topic/getTopicDetail?topicId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({item:data})
                })
        } else if (actionType === 'news'){
            fetch(`/article/getArticleContent?uniquekey=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data= json.data;
                    this.setState({item:data});
                })
        } else if (actionType === 'collect') {

        }
        //  加载动态的评论
        fetch(`/comment/getcomments?uniquekey=${id}&pageNum=1`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                var replies = data.comments;

                replies = replies.map(item=>{
                            item['owncomment'] = username === item.username ? true : false;
                            item.replies = item.replies.map(reply=>{
                              reply['owncomment'] = reply.fromUser === username ? true : false;
                              return reply;
                            })
                            return item;
                        })
                this.setState({replies})
            })
        //  将content从文本解析成组件结构
        var pattern = /@([^:]+):([^@]+)/g;
        var contentData = []
        var result = pattern.exec(content);
        while(result){              
            contentData.push({
                username:result[1],
                content:result[2]
            })    
            result = pattern.exec(content);
        }   
        this.setState({contentData,likeNum:like,dislikeNum:dislike})  
    }

    handleUserAction(id,action,isCancel){
        var { likeNum, dislikeNum } = this.state;
        fetch('/action/operate?action='+action+'&id='+ id +'&isCancel='+isCancel)
        .then(response=>response.json())
        .then(json=>{ 

            if (action == 'like' && !Boolean(isCancel)) {
              this.setState({isLiked:true,likeNum:++likeNum})
            } else if (action == 'like' && Boolean(isCancel)){
              this.setState({isLiked:false,likeNum:--likeNum})
            } else if (action == 'dislike' && !Boolean(isCancel)){
              this.setState({isdisLiked:true,dislikeNum:++dislikeNum})
            } else if (action == 'dislike' && Boolean(isCancel)){
              this.setState({isdisLiked:false,dislikeNum:--dislikeNum})
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

    handleReplyVisible(){
        this.setState({visible:!this.state.visible})
    }

    handleAddComment(data){
        this.setState({replies:data})
    }

    handleRemove(id){
        if(this.props.onVisible){
            this.props.onVisible(true,id);
        }
    }

    handleComplaint(id){
        window.confirm('别举报了，逻辑我还没写完.....from 阿山')
    }

    handleShareVisible(){
        var { data, onShareVisible } = this.props;
        var { item } = this.state;
        var { uniquekey, value, content, actionType, username } = data;
        var text = value + content;
        if (onShareVisible){
            var option = {
                uniquekey,
                text,
                actionType,
                item,
                value,
                username
            }
            onShareVisible(true,option)
        }
    }

    render(){

        var { item, contentData, isLiked, isdisLiked, likeNum, dislikeNum, visible, replies } = this.state;
        var { data, history, socket, isSelf } = this.props;
        var { actionType, username, avatar, content, value, id, uniquekey, date, like, dislike,  shareBy } = data;
        
        const menu = (
            <Menu>
              <Menu.Item key="0">
                    {
                        isSelf
                        ?
                        <span style={{fontSize:'12px'}} onClick={this.handleRemove.bind(this,id)}>删除动态</span>
                        :
                        <span style={{fontSize:'12px'}} onClick={this.handleComplaint.bind(this,id)}>举报</span>
                    }
              </Menu.Item>
            </Menu>
        )

        return(
            
            <div className="action">
                <div className="operation">
                    <span className="text">{translateType(actionType)}</span>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <span className="ant-dropdown-link button text">
                            <Icon type="setting" />
                        </span>
                    </Dropdown>
                </div>
                <Card className="action-card">
                    
                    <div>
                        <div style={{display:'flex',alignItems:'center'}}>
                            <div className="avatar-container"><img src={avatar} /></div>
                            <div>
                                <div><span style={{color:'#000',fontWeight:'500'}}>{username}</span></div>
                                <span className="text">{`发布于 ${formatDate(parseDate(date))}`}</span>
                            </div>
                        </div>
                        {
                            actionType == 'comment' || actionType == 'action'
                            ?
                            <div style={{margin:'4px 0',fontSize:'12px'}}>
                                <span>{value}</span>
                                {
                                    contentData.length
                                    ?
                                    contentData.map((item,index)=>(
                                        <span key={index}>
                                            <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.username} />}><span style={{color:'#1890ff'}}>{`@${item.username}:`}</span></Popover>
                                            <span>{item.content}</span>
                                        </span>
                                    ))
                                    :
                                    null
                                }
                            </div>
                            :
                            <div style={{margin:'4px 0',fontSize:'12px'}}>
                                <span>{content}</span>
                            </div>
                        }
                        
                             
                        {
                          actionType === 'topic'
                          ?
                          <TopicListItem item={item} noAction={true} history={history} forSimple={true}/>
                          :
                          actionType === 'news'
                          ?
                          <NewsListItem item={item} hasImg={true} />
                          :
                          null
                        }
                    </div>                
                </Card>
                <div className="user-action">
                    <div onClick={this.handleUserAction.bind(this,id,'like',isLiked?'true':'')}>
                        <span className="text" ref={span=>this.likeDom=span}>
                            <Icon type="like" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>
                            {   isLiked?'取消点赞':'点赞' }
                            <span className="num">{ likeNum  }</span>
                        </span>
                
                    </div>
                    <div onClick={this.handleUserAction.bind(this,id,'dislike',isdisLiked?'true':'')}>
                        <span className="text" ref={span=>this.dislikeDom=span}>
                            <Icon type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />
                            {   isdisLiked?'取消反对':'反对'} 
                            <span className="num">{ dislikeNum }</span>
                        </span>
                    </div>
                    <div onClick={this.handleReplyVisible.bind(this)}>
                        <span className="text" >
                            <Icon type="edit" />回复
                            <span>{replies.length}</span>
                        </span>
                    </div>
                    <div onClick={this.handleShareVisible.bind(this,id)}>
                        <span className="text">
                            <Icon type="export" />转发
                            <span>{shareBy.length}</span>
                        </span>
                    </div>
                </div>
                <div style={{display:visible?'block':'none'}}>
                    <CommentsInput  isAddComment={true} uniquekey={id} onAddComment={this.handleAddComment.bind(this)} />
                    <div style={{padding:'4px 10px'}}>
                        <CommentsList isSub={false}  socket={socket} comments={replies}  grayBg={true}/>
                    </div>
                </div>
            </div>
                      
        )
    }
    
}



