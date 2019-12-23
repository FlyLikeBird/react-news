import React from 'react';
import { message, Popover, Icon, Button } from 'antd';
import TopicItemPopover from './topic_item_popover';
import CommentPopoverUserAvatar from '../popover_user_avatar';
import ImgContainer from '../img_container';

export default class TopicListItem extends React.Component {
    constructor(){
        super();
        this.state = {
            item:{},
            isFollowed:false,
            followIcon:'caret-left',
            shareIcon:'caret-left'          
        }
    }

    handleFollow(_id,e){
        e.stopPropagation();
        var { onCheckLogin } = this.props;
        var { isFollowed } = this.state; 
        var user = onCheckLogin();
        if( user ){
            fetch(`/api/topic/followTopic?topicId=${_id}&userid=${user}&isCancel=${isFollowed?'true':''}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;                
                    this.setState({item:data && data[0],isFollowed:!isFollowed});                    
                })
        } 
    }

    markKeyWords(content){
        var { location, forSearch } = this.props;
        var result = '';
        if (!forSearch){
            return result = content;
        } 
        if (location && content) {         
          var words = location.search.match(/\?words=(.*)/)[1];      
          if (!words.match(/\s+/g)){
              //  单个关键词
              result = content.replace(new RegExp('('+words+')','g'),match=>'<span style="color:#1890ff">'+match+'</span>');
              
          } else {
              //  多个关键词
              var multiWords = '';
              words = words.split(/\s+/);
              for(var i=0,len=words.length;i<len;i++){
                multiWords += words[i] + '|'
              }
              multiWords = multiWords.substring(0,multiWords.length-1);
              //console.log(multiWords);
              result = content.replace(new RegExp('('+multiWords+')','g'),match=>'<span style="color:#1890ff">'+match+'</span>');
            
          }
          
        } 
        return result;
    }

    handleRemove(id, e){
        var { onVisible } = this.props;
        if ( onVisible ) {
            onVisible(true,id);
        }
    }

    handleCollect(id){
        var { onCollectVisible, onCheckLogin } = this.props;
        var userid = onCheckLogin();
        if (userid){
            if ( onCollectVisible ) onCollectVisible(true)
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

    handleClick(id){
        var { forSimple, forDetail, noLink, history } = this.props;
        if (noLink) return;
        if ( history ) {
            history.push(`/topic/${id}`);
        }
    }

    handleShare(){
        var { onVisible, onCheckLogin } = this.props;
        var { item } = this.state;
        if (onCheckLogin()){
            if( onVisible )  onVisible(true, item);
        }    
    }

    componentWillReceiveProps(newProps){
        //  如果是嵌入动态内的话题内容，则不更新
        var { forSimple, forDetail } = this.props;
        if (forSimple) return ;
        // 保证更新该话题的comments字段
        if ( forDetail ) {
            this.setState({item:newProps.data});
        } else if ( this.props.data._id != newProps.data._id) {
            this.setState({item:newProps.data});
        }    
    }

    componentDidMount(){    
        var { data } = this.props;
        var { follows } = data;        
        var userid = localStorage.getItem('userid');
        var isFollowed = follows.map(item=>item.user._id).includes(userid) ? true : false;
        this.setState({item:data, isFollowed });           
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
        var {  inline, columns, forSimple, isSelf, onCheckLogin, history, forUser, forDetail, forSearch, forIndex, forPreview } = this.props;
        var {   isFollowed, item, followIcon, shareIcon } = this.state;
        var {  privacy, user, _id, tags, images, follows, replies, shareBy, title, description, view } = item;
        

        return (
            <div 
                style={{width:100/columns + '%'}} 
                className={inline?'topic-card-container inline':forSimple?'topic-card-container simple' : forSearch ? 'topic-card-container forSearch' : forUser ? 'topic-card-container forUser' : 'topic-card-container'}>
                    
                    {
                        forSimple
                        ?
                        null
                        :
                        <div className='label'><span>{privacy===0?'公开':privacy===1?'有权限':'私密'}</span></div>  
                    }                  
                    <div className='topic-card-body' style={{borderBottom:forPreview?'1px solid #e8e8e8':'none'}}>
                        <div className='title' onClick={this.handleClick.bind(this,_id)}>{title}</div>                        
                        {
                            forSimple
                            ?
                            null
                            :
                            <div className='user-container'>
                                发起人：                          
                                <Popover content={<CommentPopoverUserAvatar history={history} onCheckLogin={onCheckLogin} user={user?user.username:''}/>}>
                                    <span className='avatar-container'>
                                        <img src={user?user.userImage:''} />
                                    </span>
                                </Popover>
                            </div>
                        }
                                               
                        <div>
                            <span className="text">{view}人浏览</span>
                            <span className="text">{replies?replies:0}人回复</span>
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'follow')} content={<TopicItemPopover data={follows} text="关注" />} placement="bottom">
                                    <span className="text">{`${follows?follows.length:0} 人关注`}<Icon type={followIcon}/></span>
                                </Popover>
                                
                            }
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'shareBy')} content={<TopicItemPopover data={shareBy} text="转发" forShare={true}/>} placement="bottom">
                                    <span className="text">{`${shareBy?shareBy.length:0} 人转发`} <Icon type={shareIcon} /></span>
                                </Popover>
                                 
                            }                                                    
                                                   

                        </div>
                        
                        <div className='topic-tag-container'>
                            {   
                                tags && tags.length
                                ?
                                tags.map((item,index)=>(
                                    <span className='content-tag' key={index}>{item.tag}</span>
                                ))
                                :
                                null
                                
                            }
                        </div>
                    
                        <div className='desc' dangerouslySetInnerHTML={{__html:this.markKeyWords(description)}}></div>
                        <div>
                            {    
                                images && images.length
                                ?                             
                                inline  //  内联模式下只显示一张缩略图
                                ?
                                <div className='topic-img-container'  style={{width:columns == 4 ? '100%' : columns == 2 ? '50%' :'33.3%', backgroundImage:`url(${images[0]['filename']})`}}></div>                                   
                                :
                                images.map((item,index)=>(
                                    <ImgContainer key={index} bg={item.filename} />
                                ))                                                      
                                :
                                null                                
                            }
                        </div>
                        
                    </div>
                    {                       
                        forIndex
                        ?
                        <div className='topic-card-extra'>                           
                            <div onClick={this.handleClick.bind(this, _id)}>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                        :
                        forUser && isSelf
                        ?
                        <div className='topic-card-extra'>                            
                            <div onClick={this.handleEdit.bind(this,_id)}>
                                <span className="text"><Icon type="edit" />编辑话题</span>
                            </div>
                            
                            <div onClick={this.handleRemove.bind(this,_id)}>
                                <span className="text"><Icon type="close" />删除话题</span>
                            </div>                           
                        </div>
                        :
                        forDetail
                        ?
                        <div className='topic-card-extra'>
                            <div>
                                {
                                    
                                    <div onClick={this.handleFollow.bind(this,_id)}>
                                        {
                                            isFollowed
                                            ?
                                            <span className="text"><Icon type="check" />已关注</span>
                                            :
                                            <span className="text" style={{color:'#1890ff'}}><Icon type="plus" />关注话题</span>
                                        }
                                    </div>
                                    
                                }
                            </div>
                            <div onClick={this.handleCollect.bind(this,_id)}>
                                <span className="text"><Icon type="star" />收藏话题</span>
                            </div>
                            <div onClick={this.handleShare.bind(this,_id)}>
                                <span className="text"><Icon type="export" />转发话题</span>
                            </div>
                        </div>
                        :
                        forSimple || forPreview
                        ?
                        null
                        //  关注话题页面
                        :
                        <div className='topic-card-extra' >                           
                            <div onClick={this.handleClick.bind(this, _id)}>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                    }
             </div>
        )
    }
}