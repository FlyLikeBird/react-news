import React from 'react';
import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card, Popover, Menu, Dropdown  } from 'antd';

import CommentPopoverUserAvatar from '../../common_comments/comment_popover_useravatar';
import { parseDate, formatDate, translateType, formatContent } from '../../../../utils/translateDate';
import CommentsListContainer  from '../../common_comments/comments_list_container';
import TopicItemPopover from '../pc_topic/pc_topic_item_popover';
import { TopicListItem } from '../pc_topic/pc_topic_list';
import { NewsListItem } from './pc_newslist';
import UpdateInnerItem from './pc_usercenter_inner_update_item';

var isAllowed = true;

export default class UpdateItem extends React.Component{
    
    constructor(){
        super();
        this.state = {
            item:{},
            isLiked:false,
            isdisLiked:false,
            likeUsers:[],
            dislikeUsers:[],
            shareBy:[],
            finalText:'',
            translateData:[],
            visible:false,
            likeIconType:'caret-left',
            dislikeIconType:'caret-left',
            shareByIconType:'caret-left'

        }
    }

    _getTranslateData(text){
        var translateData = formatContent(text);
        this.setState({finalText:text,translateData})
    }

    _loadItemData(props){
        var { data } = props;
        var { contentType, contentId, innerAction, text, value, composeAction, likeUsers, dislikeUsers, shareBy, id } = data;
        var userid = localStorage.getItem('userid');
        var translateData,finalText='';
        if( innerAction && !composeAction){
            finalText = value ;
            this._getTranslateData(finalText);
        } else if ( innerAction && composeAction){
            finalText = value + '//' + text;
            this._getTranslateData(finalText);
        //  转发的评论
        } else if(text){
            finalText = value + '//' +text;
            this._getTranslateData(finalText);
        //  转发的新闻或者话题
        } else {
            finalText = value;
            this._getTranslateData(finalText);
        }
        
        var isLiked = likeUsers.map(item=>item.userid).includes(userid),isdisLiked = dislikeUsers.map(item=>item.userid).includes(userid);
        this.setState({likeUsers,dislikeUsers,shareBy,isLiked,isdisLiked});  
    }

    componentDidMount(){
        this._loadItemData(this.props);
    }

    handleUserAction(id,action,isCancel){
        
        fetch('/action/operate?action='+action+'&id='+ id +'&isCancel='+isCancel+'&userid='+localStorage.getItem('userid'))
        .then(response=>response.json())
        .then(json=>{ 
            var data = json.data;
            if (action == 'like' && !Boolean(isCancel)) {
              this.setState({isLiked:true,likeUsers:data});
            } else if (action == 'like' && Boolean(isCancel)){
              this.setState({isLiked:false,likeUsers:data})
            } else if (action == 'dislike' && !Boolean(isCancel)){
              this.setState({isdisLiked:true,dislikeUsers:data})
            } else if (action == 'dislike' && Boolean(isCancel)){
              this.setState({isdisLiked:false,dislikeUsers:data})
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

    handleRemove(id){
        if(this.props.onVisible){
            this.props.onVisible(true,id);
        }
    }

    handleComplaint(id){
        window.confirm('别举报了，逻辑我还没写完.....from 阿山')
    }

    
    componentWillReceiveProps(newProps){
        this._loadItemData(newProps);
    }

    handleShareVisible(){
        var { finalText, translateData } = this.state;
        var { data, onShareVisible } = this.props;
        var { contentType, innerAction, contentId, composeAction, value, text, id, username } = data;
        
        if (onShareVisible){
            var option = {
                contentType,
                contentId,
                innerAction,
                hasInnerAction:innerAction ? true : false,
                actionId:id,
                composeAction,
                value,
                text:finalText,
                username,
                translateData                  
            }
            onShareVisible(true,option)
        }
    }

    render(){

        var { translateData, finalText, isLiked, isdisLiked, likeUsers, dislikeUsers, shareBy, likeIconType, dislikeIconType, shareByIconType, visible, replies } = this.state;
        var { data, history, socket, loaction, forDetail, isSelf } = this.props;
        var { contentType, composeAction, innerAction, images, username, avatar, text, value, id, comments, isCreated, contentId, date } = data;
        
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
                {
                    forDetail
                    ?
                    null
                    :
                    <div className="action-head">
                        <span className="text">{ isCreated ? '发布动态': innerAction ? '转发动态' : `转发${translateType(contentType)}`}</span>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <span className="ant-dropdown-link button text">
                                <Icon type="setting" />
                            </span>
                        </Dropdown>
                    </div>
                }                                  
                <div className="action-body">
                    <div style={{display:'flex',alignItems:'center'}}>
                        <div className="avatar-container"><img src={avatar} /></div>
                        <div>
                            <div><span style={{color:'#000',fontWeight:'500'}}>{username}</span></div>
                            <span className="text">{`发布于 ${formatDate(parseDate(date))}`}</span>
                        </div>
                    </div>
                    {   
                        isCreated
                        ?
                        <div style={{margin:'2px 0'}}>
                            <div>
                                {
                                    translateData.length
                                    ?
                                    translateData.map((item,index)=>(
                                        <span key={index}>
                                            <span>{item.text}</span>
                                            {
                                                item.user
                                                ?
                                                <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.user} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                                :
                                                null
                                            }
                                            
                                        </span>
                                    ))
                                    :
                                    <span>{text}</span>
                                }
                            </div>
                            <div>
                                {
                                    images
                                    ?
                                    images.length
                                    ?
                                    images.map((item,index)=>(
                                        <span className="img-container"><img src={item} /></span>
                                    ))
                                    :
                                    null
                                    :
                                    null
                                }
                            </div>
                        </div>
                        :
                        innerAction  //  说明包含嵌套的动态 -- 二级动态
                        ?
                        <div style={{margin:'2px 0'}}>
                            {
                                translateData.length
                                ?
                                translateData.map((item,index)=>(
                                    <span key={index}>
                                        <span>{item.text}</span>
                                        {
                                            item.user
                                            ?
                                            <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.user} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                            :
                                            null
                                        }
                                        
                                    </span>
                                ))
                                :
                                <span>{ finalText }</span>
                            }
                            <UpdateInnerItem uniquekey={innerAction} forAction={true} history={history} />
                        </div>
                        :  //  说明包含新闻或者话题 -- 一级动态
                        <div style={{margin:'2px 0'}}>
                            {
                                translateData.length
                                ?
                                translateData.map((item,index)=>(
                                    <span key={index}>
                                        <span>{item.text}</span>
                                        {
                                            item.user
                                            ?
                                            <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.user} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                            :
                                            null
                                        }
                                        
                                    </span>
                                ))
                                :
                                <span>{finalText}</span>
                            }
                            <div style={{padding:'10px 20px',backgroundColor:'rgb(249, 249, 249)',borderRadius:'4px'}}>
                                {
                                  contentType === 'topic'
                                  ?
                                  <TopicListItem uniquekey={contentId} noAction={true} history={history} forSimple={true}/>
                                  :
                                  contentType === 'news'
                                  ?
                                  <NewsListItem uniquekey={contentId} hasImg={true} forSimple={true}/>
                                  :
                                  null
                                }
                            </div>
                        </div>
                    }    
                </div>                
                   
                <div className="user-action">                  
                    <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={likeUsers} text="赞"/>}>
                        <span onClick={this.handleUserAction.bind(this,id,'like',isLiked?'true':'')} className="text" ref={span=>this.likeDom=span}>
                            <Icon type="like" theme={isLiked?'filled':'outlined'} style={{color:isLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}}/>
                            {   isLiked?'取消点赞':'点赞' }
                            <span className="num">{ likeUsers.length  }</span>
                            <Icon className="caret" type={likeIconType} />
                        </span>
                    </Popover>
                    <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={dislikeUsers} text="踩"/>}>    
                        <span onClick={this.handleUserAction.bind(this,id,'dislike',isdisLiked?'true':'')} className="text" ref={span=>this.dislikeDom=span}>
                            <Icon type="dislike" theme={isdisLiked?'filled':'outlined'} style={{color:isdisLiked?'#1890ff':'rgba(0, 0, 0, 0.45)'}} />
                            {   isdisLiked?'取消反对':'反对'} 
                            <span className="num">{ dislikeUsers.length }</span>
                            <Icon className="caret" type={dislikeIconType} />
                        </span>
                    </Popover>
                
                    <span onClick={this.handleReplyVisible.bind(this)} className="text" >
                        <Icon type="edit" />回复
                        <span className="num">{comments}</span>
                    </span>
                
                    <Popover autoAdjustOverflow={false} content={<TopicItemPopover data={shareBy} forShare={true} text="转发"/>}>
                        <span onClick={this.handleShareVisible.bind(this,id)} className="text">
                            <Icon type="export" />转发
                            <span>{shareBy.length}</span>
                            <Icon className="caret" type={shareByIconType}/>
                        </span>
                    </Popover>
                </div>

                <div style={{display:forDetail?'block':visible?'block':'none'}}>
                    <CommentsListContainer 
                            history={history}
                            location={location}
                            socket={socket} 
                            uniquekey={id}                             
                            commentType="action" 
                            warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                    />
                </div>                
            </div>
                      
        )
    }
    
}



