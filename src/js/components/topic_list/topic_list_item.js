import React from 'react';
import { message, Popover } from 'antd';

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
        var { isFollowed } = this.state;
        var userid=localStorage.getItem('userid');
        if(userid){
            fetch(`/api/topic/followTopic?topicId=${_id}&userid=${userid}&isCancel=${isFollowed?'true':''}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;                
                    this.setState({follows:data,isFollowed:!isFollowed});                    
                })
        } else {
            message.error('请先完成登录后再操作!')
        }
    }

    handleRemove(id){
        var { onVisible } = this.props;
        if ( onVisible ) {
            onVisible(true,id);
        }
    }

    _onEditTopicItem(data){
        this.setState({item:data});
    }

    handleEdit(){
        var { onEditVisible, item } = this.props;
        if ( onEditVisible ){
            onEditVisible(true,item,this._onEditTopicItem.bind(this))
        }
    }

    _updateShareByUsers(data){
      this.setState({shareBy:data})
    }

    handleClick(id){
        var { forSimple, forDetail, history } = this.props;
        if ( !forDetail ) {
            history.push(`/topic/${id}`);
        }
    }

    handleShare(){
        var { onVisible } = this.props;
        if( onVisible ){
            onVisible(true,this._updateShareByUsers.bind(this))
        }
    }

    componentWillReceiveProps(newProps){
        //  如果是嵌入动态内的话题内容，则不更新
        var { forSimple } = this.props;
        if (!forSimple){
            var newItem = newProps.data;
            if (this.props.data._id != newProps.data._id){
                this.setState({item:newItem})
            }
        }        
    }

    componentDidMount(){
        
        var { forDetail, forSimple, uniquekey, data } = this.props;
        var userid = localStorage.getItem('userid');
        if (data && !uniquekey) {
            var { follows, shareBy } = data;
            this.setState({item:data,follows,shareBy});

        } else if( uniquekey ){
            fetch(`/api/topic/getTopicDetail?topicId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var item = json.data;
                    var { follows, shareBy } = item;
                    this.setState({item,follows,shareBy});
                });
            if (forDetail){
                fetch(`/api/topic/checkTopicIsFollowed?userid=${userid}&topicId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var code = json.code;                  
                    if(code ===0){
                        this.setState({isFollowed:true})
                    } else {
                        this.setState({isFollowed:false})
                    }
                
                })
            
            }
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
        var {  item, isFollowed, followIcon, shareIcon, follows, shareBy } = this.state;
        var {  privacy, username, _id, tag, images,  replies, title, description, view } = item;
        

        return (
            <div 
                onClick={this.handleClick.bind(this,_id)}
                style={{width:100/columns + '%'}} 
                className={inline?"topic-card-container inline":forSimple?"topic-card-container simple":"topic-card-container"}>
                    
                    <div className="label"><span>{privacy===0?'公开':privacy===1?'有权限':'私密'}</span></div>                    
                    <div className="topic-card-body" style={{borderBottom:forPreview?'1px solid #e8e8e8':'none'}}>
                        <h3>{title}</h3>                        
                        <div><span className="text" style={{fontSize:'14px',color:'#000'}}>发起人：{username}</span></div>                       
                        <div style={{width:'500px'}}>
                            <span className="text">{view}人浏览</span>
                            <span className="text">{replies?replies:0}人回复</span>
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'follow')} content={<TopicItemPopover data={follows} text="关注" />} placement="bottom">
                                    <span className="text">{`${follows.length} 人关注`}<Icon type={followIcon}/></span>
                                </Popover>
                                
                            }
                            {
                                forIndex
                                ?
                                null
                                :
                                <Popover onVisibleChange={this.handleChangeIcon.bind(this,'shareBy')} content={<TopicItemPopover data={shareBy} text="转发" forShare={true}/>} placement="bottom">
                                    <span className="text">{`${shareBy.length} 人转发`} <Icon type={shareIcon} /></span>
                                </Popover>
                                 
                            }                                                    
                                                   

                        </div>
                        
                        <div className="topic-tag-container">
                            {   
                                tag
                                ?
                                tag.length
                                ?
                                tag.map((item,index)=>(
                                    <span className={inline?'content-tag inline':forSimple?'content-tag inline':forUser?'content-tag inline':'content-tag'} key={index}>{item}</span>
                                ))
                                :
                                null
                                :
                                null
                            }
                        </div>
                    
                        <p className="desc">{description}</p>
                        <div>
                            {    
                                images && images.length
                                ?                             
                                inline  //  内联模式下只显示一张缩略图
                                ?
                                <div className="topic-img-container" style={{width:columns == 4 ? '100%' : columns == 2 ? '50%' :'33%'}}>
                                    <img src={images[0]['filename']} />
                                </div>
                                :
                                images.map((item,index)=>(
                                    <div key={index} className="topic-img-container">
                                        <img src={item['filename']} />
                                    </div>
                                ))                                                      
                                :
                                null
                                
                            }
                        </div>
                        
                    </div>
                    {                       
                        forIndex
                        ?
                        <div className="topic-card-extra">                           
                            <div>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                        :
                        forUser
                        ?
                        <div className="topic-card-extra">                            
                            <div onClick={this.handleEdit.bind(this)}>
                                <span className="text"><Icon type="edit" />编辑话题</span>
                            </div>
                            
                            <div onClick={this.handleRemove.bind(this,_id)}>
                                <span className="text"><Icon type="close" />删除话题</span>
                            </div>                           
                        </div>
                        :
                        forDetail
                        ?
                        <div className="topic-card-extra">
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
                            <div onClick={this.handleShare.bind(this,_id)}>
                                <span className="text"><Icon type="export" />转发话题</span>
                            </div>
                        </div>
                        :
                        forSimple
                        ?
                        null
                        //  关注话题页面
                        :
                        <div className="topic-card-extra">                           
                            <div>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
                            </div>                   
                        </div>
                    }
             </div>
        )
    }
}