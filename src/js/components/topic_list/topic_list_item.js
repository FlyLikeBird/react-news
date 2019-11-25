import React from 'react';
import { message, Popover, Icon, Button } from 'antd';
import TopicItemPopover from './topic_item_popover';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';

import style from './style.css';

export default class TopicListItem extends React.Component {
    constructor(){
        super();
        this.state = {
            item:{},
            isFollowed:false,
            follows:[],
            shareBy:[],
            followIcon:'caret-left',
            shareIcon:'caret-left'          
        }
    }

    handleFollow(_id,e){
        e.stopPropagation();
        var { onCheckLogin } = this.props;
        var { isFollowed } = this.state; 
        if( onCheckLogin()){
            fetch(`/api/topic/followTopic?topicId=${_id}&userid=${user}&isCancel=${isFollowed?'true':''}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;                
                    this.setState({follows:data,isFollowed:!isFollowed});                    
                })
        } 
    }

    handleRemove(id, e){
        var { onVisible } = this.props;
        if ( onVisible ) {
            onVisible(true,id);
        }
    }

    _onEditTopicItem(data){
        this.setState({item:data});
    }

    handleEdit(id, e){
        var { item } = this.state;
        var { onEditVisible } = this.props;
        if ( onEditVisible ){
            onEditVisible(true, item, this._onEditTopicItem.bind(this))
        }
    }

    _updateShareByUsers(data){
      this.setState({shareBy:data})
    }

    handleClick(id){
        var { forSimple, forDetail, data, history } = this.props;
        if ( !forDetail ) {
            history.push(`/topic/${id}`);
        }
    }

    handleShare(){
        var { onVisible, onCheckLogin } = this.props;
        if (onCheckLogin()){
            if( onVisible )  onVisible(true,this._updateShareByUsers.bind(this))
        }    
    }

    componentWillReceiveProps(newProps){
        //  如果是嵌入动态内的话题内容，则不更新
        var { forSimple, forDetail } = this.props;
        if (forSimple || forDetail) return ;
        var newItem = newProps.data;
        if (this.props.data._id != newProps.data._id){
            this.setState({item:newItem})
        }
              
    }

    componentDidMount(){     
        var { forDetail, forSimple, uniquekey, data } = this.props;
        var userid = localStorage.getItem('userid');
        if (forDetail){
            fetch(`/api/topic/getTopicDetail?topicId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    fetch(`/api/topic/checkTopicIsFollowed?userid=${userid}&topicId=${uniquekey}`)
                        .then(response=>response.json())
                        .then(json=>{
                            var code = json.code;                  
                            if(code ===0){
                                this.setState({item:data[0],isFollowed:true})
                            } else {
                                this.setState({item:data[0],isFollowed:false})
                            }
                        
                        })               
                })          

        } else {
            this.setState({item:data});
        }
         
    }

    handleChangeIcon(type,visible){
        if (visible===true){
            if (type=='follow') {
                this.setState({followIcon:'caret-down'})
            } else {
                this.setState({shareIcon:'caret-down'})
            }
        } else {
            if ( type =='follow'){
                this.setState({followIcon:'caret-left'})
            } else {
                this.setState({shareIcon:'caret-left'})
            }
        }
    }

    render(){
        var {  inline, columns, forSimple, forUser, forDetail, forIndex, forPreview } = this.props;
        var {   isFollowed, item, followIcon, shareIcon, follows, shareBy } = this.state;
        var {  privacy, fromUser, _id, tags, images,  replies, title, description, view } = item;
        

        return (
            <div 
                
                style={{width:100/columns + '%'}} 
                className={inline?style['topic-card-container']+' '+style['inline']:forSimple?style['topic-card-container']+' '+style['simple'] : style['topic-card-container']}>
                    
                    {
                        forSimple
                        ?
                        null
                        :
                        <div className={style.label}><span>{privacy===0?'公开':privacy===1?'有权限':'私密'}</span></div>  
                    }                  
                    <div className={style['topic-card-body']} style={{borderBottom:forPreview?'1px solid #e8e8e8':'none'}}>
                        <div className={style.title} onClick={this.handleClick.bind(this,_id)}>{title}</div>                        
                        {
                            forSimple
                            ?
                            null
                            :
                            <div className={style['user-container']}>
                                发起人：                          
                                <Popover content={<CommentPopoverUserAvatar user={fromUser?fromUser.username:''}/>}>
                                    <span className={style['avatar-container']}>
                                        <img src={fromUser?fromUser.userImage:''} />
                                    </span>
                                </Popover>
                            </div>
                        }
                                               
                        <div>
                            <span className={style.text}>{view}人浏览</span>
                            <span className={style.text}>{replies?replies:0}人回复</span>
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'follow')} content={<TopicItemPopover data={follows} text="关注" />} placement="bottom">
                                    <span className={style.text}>{`${follows.length} 人关注`}<Icon type={followIcon}/></span>
                                </Popover>
                                
                            }
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'shareBy')} content={<TopicItemPopover data={shareBy} text="转发" forShare={true}/>} placement="bottom">
                                    <span className={style.text}>{`${shareBy.length} 人转发`} <Icon type={shareIcon} /></span>
                                </Popover>
                                 
                            }                                                    
                                                   

                        </div>
                        
                        <div className={style['topic-tag-container']}>
                            {   
                                tags && tags.length
                                ?
                                tags.map((item,index)=>(
                                    <span className={style['content-tag']} key={index}>{item.tag}</span>
                                ))
                                :
                                null
                                
                            }
                        </div>
                    
                        <div className={style['desc']}>{description}</div>
                        <div>
                            {    
                                images && images.length
                                ?                             
                                inline  //  内联模式下只显示一张缩略图
                                ?
                                <div className={style['topic-img-container']}  style={{width:columns == 4 ? '100%' : columns == 2 ? '50%' :'33.3%', backgroundImage:`url(${images[0]['filename']})`}}>
                                    
                                </div>
                                :
                                images.map((item,index)=>(
                                    <div key={index} className={style['topic-img-container']} style={{backgroundImage:`url(${item.filename})`}}></div>
                                ))                                                      
                                :
                                null
                                
                            }
                        </div>
                        
                    </div>
                    {                       
                        forIndex
                        ?
                        <div className={style['topic-card-extra']}>                           
                            <div>
                                <span className={style.text}><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                        :
                        forUser
                        ?
                        <div className={style['topic-card-extra']}>                            
                            <div onClick={this.handleEdit.bind(this,_id)}>
                                <span className={style.text}><Icon type="edit" />编辑话题</span>
                            </div>
                            
                            <div onClick={this.handleRemove.bind(this,_id)}>
                                <span className={style.text}><Icon type="close" />删除话题</span>
                            </div>                           
                        </div>
                        :
                        forDetail
                        ?
                        <div className={style['topic-card-extra']}>
                            <div>
                                {
                                    
                                    <div onClick={this.handleFollow.bind(this,_id)}>
                                        {
                                            isFollowed
                                            ?
                                            <span className={style.text}><Icon type="check" />已关注</span>
                                            :
                                            <span className={style.text} style={{color:'#1890ff'}}><Icon type="plus" />关注话题</span>
                                        }
                                    </div>
                                    
                                }
                            </div>
                            <div onClick={this.handleShare.bind(this,_id)}>
                                <span className={style.text}><Icon type="export" />转发话题</span>
                            </div>
                        </div>
                        :
                        forSimple
                        ?
                        null
                        //  关注话题页面
                        :
                        <div className={style['topic-card-extra']}>                           
                            <div>
                                <span className={style.text}><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                    }
             </div>
        )
    }
}