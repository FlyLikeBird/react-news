import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, message, Popover, Avatar } from 'antd';
import { parseDate, formatDate } from '../../../utils/translateDate';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
import TopicItemPopover from './pc_topic_item_popover';

const { Meta } = Card;

function getMinValueOfArr(arr){
    var min = arr[0];
    for(var i=1,len=arr.length;i<len;i++){
        var temp = arr[i];
        min = temp < min ? temp:min;
    }
    return min;
}

function getMaxValueOfArr(arr){
    var max = arr[0];
    for(var i=1,len=arr.length;i<len;i++){
        var temp = arr[i];
        max = temp < max ? max : temp;
    }
    return max;
}

function getMinIndexOfArr(arr,min){
    var index = 0;
    for(var i=0,len=arr.length;i<len;i++){
        if(arr[i]===min){
            index = i;
            return index;
        }
    }
}

export class TopicListItem extends React.Component {
    constructor(){
        super();
        this.state = {
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
            fetch(`/topic/followTopic?topicId=${_id}&userid=${userid}&isCancel=${isFollowed?'true':''}`)
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

    handleEdit(){
        var { onEditVisible, item } = this.props;
        if ( onEditVisible ){
            onEditVisible(true,item)
        }
    }

    _updateShareByUsers(data){
      this.setState({shareBy:data})
    }

    handleLink(id){
        var { history } = this.props;
        history.push(`/topic/${id}`);
    }

    handleShare(){
        var { onVisible } = this.props;
        if( onVisible ){
            onVisible(true,this._updateShareByUsers.bind(this))
        }
    }

    componentDidMount(){
        var { forDetail, item } = this.props;
        var id = this.props.item._id;
        var userid = localStorage.getItem('userid');
        if (userid){
            if(forDetail){
                fetch(`/topic/checkTopicIsFollowed?userid=${userid}&topicId=${id}`)
                    .then(response=>response.json())
                    .then(json=>{
                        var code = json.code;
                        var { follows, shareBy } = item;
                        if(code ===0){
                            this.setState({isFollowed:true})
                        } else {
                            this.setState({isFollowed:false})
                        }
                        this.setState({follows,shareBy})
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
        var { item, inline, columns, forSimple, forUser, forDetail, forIndex, forPreview } = this.props;
        var {  privacy, username, _id, tag, images,  content, title, description, view } = item;
        var { isFollowed, followIcon, shareIcon, follows, shareBy } = this.state;

        return (
            <div 
                style={{width:100/columns + '%'}} 
                className={inline?"topic-card-container inline":forSimple?"topic-card-container simple":"topic-card-container"}>
                    
                    <div className="label"><span>{privacy===0?'公开':privacy===1?'有权限':'私密'}</span></div>                    
                    <div className="topic-card-body" style={{borderBottom:forPreview?'1px solid #e8e8e8':'none'}}>
                        <h3>{title}</h3>                        
                        <div><span className="text" style={{fontSize:'14px',color:'#000'}}>发起人：{username}</span></div>                       
                        <div style={{width:'500px'}}>
                            <span className="text">{view}人浏览</span>
                            <span className="text">{content?content.length:0}人回复</span>
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
                                images
                                ?                             
                                images.length
                                ?
                                inline
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
                                :
                                null
                                
                            }
                        </div>
                        
                    </div>
                    {                       
                        forIndex
                        ?
                        <div className="topic-card-extra">
                            <div onClick={this.handleLink.bind(this,_id)}>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
                            </div>
                        </div>
                        :
                        forUser
                        ?
                        <div className="topic-card-extra">                            
                            <div onClick={this.handleEdit.bind(this,_id)}>
                                <span className="text"><Icon type="edit" />编辑话题</span>
                            </div>
                            <div onClick={this.handleLink.bind(this,_id)}>
                                <span className="text"><Icon type="arrow-right" />前往话题</span>
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
                        null
                    }
             </div>
        )
    }
}

export default class TopicList extends React.Component{
    constructor(){
        super();
        
    }

    componentDidUpdate(){
        this._sortTopicList(this.props);
    }

    _sortTopicList(props){
        var { inline, columns } = props;
        var container = this.cardContainer;
        if(container){ 
            var cardContainers = container.childNodes;
            var cardWidth = container.offsetWidth/columns;
            // 放置每一列的高度数据
            var cardsColHeight = [];
            if ( inline ) {
                for(var i=0,len=cardContainers.length;i<len;i++){
                    var cardContainer = cardContainers[i];
                    if(i<columns){                   
                        cardsColHeight.push(cardContainer.offsetHeight);
                        cardContainer.style.left = i*cardWidth + 'px';
                        cardContainer.style.top = '0px';
                        cardContainer.style.display = 'inline-block';
                    } else {                    
                        var minHeight = getMinValueOfArr(cardsColHeight);                    
                        var minHeightIndex = getMinIndexOfArr(cardsColHeight,minHeight);
                        cardContainer.style.left = minHeightIndex * cardWidth + 'px';
                        cardContainer.style.top = minHeight + 'px';
                        cardsColHeight[minHeightIndex] = cardsColHeight[minHeightIndex] + cardContainer.offsetHeight;
                    }
                
                }
                
            } else {
                for(var i=0,len=cardContainers.length;i<len;i++){
                    cardContainers[i].style.left = '0px';
                    cardContainers[i].style.top = '0px';
                    cardContainers[i].style.display = 'block';
                }
            }
            var maxHeight = getMaxValueOfArr(cardsColHeight);
            container.style.height = maxHeight + 'px';
                       
        } 
    }

    componentDidMount(){
        this._sortTopicList(this.props);
    }
    
    render(){

        var { data, inline, columns, history, forUser, forDetail, forIndex, onVisible, onEditVisible, text } = this.props;
        
        return(
            <div ref={card=>this.cardContainer=card} style={{position:'relative'}}>
            
                {
                    data.length
                    ?
                    data.map((item,index)=>(
                        <TopicListItem 
                            index={index} 
                            key={index} 
                            item={item}
                            inline={inline}
                            history={history}
                            columns={columns}
                            forDetail={forDetail}
                            forIndex={forIndex}
                            forUser={forUser}
                            onVisible={onVisible}
                            onEditVisible={onEditVisible}
                        />
                    ))
                    :
                    <div style={{padding:'10px 0'}}>{text}</div>
                }
                       
            </div>   
                       
        )
    }
}


