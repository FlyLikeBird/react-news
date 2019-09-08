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
            iconType:'caret-left'
        }
    }

    handleFollow(_id,isFollowed,e){
        e.stopPropagation();
        var userid=localStorage.getItem('userid');
        if(userid){
            fetch(`/topic/followTopic?topicId=${_id}&userid=${userid}&isCancel=${isFollowed?'true':''}`)
                .then(response=>response.json())
                .then(json=>{
                    this.setState({isFollowed:!isFollowed})
                })
        } else {
            message.error('请先完成登录后再操作!')
        }
    }

    handleReply(_id,e){
        e.stopPropagation();
        
        if(this.props.onShowReply){
            this.props.onShowReply()
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

    handleLink(id){
        var { history } = this.props;
        history.push(`/topic/${id}`);
    }

    handleShare(id){
        var { onVisible } = this.props;
        if( onVisible ){
            onVisible(true,id)
        }
    }

    componentDidMount(){
        var { forDetail } = this.props;
        var id = this.props.item._id;
        var userid = localStorage.getItem('userid');
        if (userid){
            if(forDetail){
                fetch(`/topic/checkTopicIsFollowed?userid=${userid}&topicId=${id}`)
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

    handlePopoverContent(visible){
        if(visible===true){
            this.setState({iconType:'caret-down'});
        } else {
            this.setState({iconType:'caret-left'});
        }
    }

    render(){
        var { item, inline, columns, forSimple, forUser, forDetail, forIndex, forPreview } = this.props;
        var { shareBy, privacy, sponsor, _id, tag, images, follows, content, title, description, view } = item;
        var { isFollowed, iconType } = this.state;

        return (
            <div 
                style={{width:100/columns + '%'}} 
                className={inline?"topic-card-container inline":forSimple?"topic-card-container simple":"topic-card-container"}>
                    
                    <div className="label"><span>{privacy===0?'公开':privacy===1?'有权限':'私密'}</span></div>                    
                    <div className="topic-card-body" style={{borderBottom:forPreview?'1px solid #e8e8e8':'none'}}>
                        <h3>{title}</h3>                        
                        <div><span className="text" style={{fontSize:'14px',color:'#000'}}>发起人：{sponsor}</span></div>                       
                        <div style={{width:'500px'}}>
                            <span className="text">{view}人浏览</span>
                            <span className="text">{content?content.length:0}人回复</span>
                            <Popover onVisibleChange={this.handlePopoverContent.bind(this)} content={<TopicItemPopover data={follows}/>} placement="bottom">
                                <span className="text">{follows?follows.length:0}人关注 <Icon type={iconType} /></span>
                            </Popover>                                                        
                            <Popover onVisibleChange={this.handlePopoverContent.bind(this)} content={<TopicItemPopover data={shareBy} hasText={true}/>} placement="bottom">
                                <span className="text">{shareBy?shareBy.length:0}人转发 <Icon type={iconType} /></span>
                            </Popover>                        

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
                                <div className="topic-img-container">
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
                            <div style={{display:'inline-block',width:'50%',borderRight:'1px solid rgb(197, 195, 195)'}} onClick={this.handleLink.bind(this,_id)}>
                                <Icon type="edit" />前往话题
                            </div>
                        </div>
                        :
                        forUser
                        ?
                        <div className="topic-card-extra">                            
                            <div style={{display:'inline-block',width:'33%',borderRight:'1px solid rgb(197, 195, 195)'}} onClick={this.handleEdit.bind(this,_id)}>
                                <Icon type="edit" />编辑话题
                            </div>
                            <div style={{display:'inline-block',width:'33%',borderRight:'1px solid rgb(197, 195, 195)'}} onClick={this.handleLink.bind(this,_id)}>
                                <Icon type="arrow-right" />前往话题
                            </div>
                            <div style={{display:'inline-block',width:'33%'}} onClick={this.handleRemove.bind(this,_id)}>
                                <Icon type="close" />删除话题
                            </div>                           
                        </div>
                        :
                        forDetail
                        ?
                        <div className="topic-card-extra">
                            <div style={{display:'inline-block',width:'33%',borderRight:'1px solid rgb(197, 195, 195)'}}>
                                {
                                    
                                    <div onClick={this.handleFollow.bind(this,_id,isFollowed)}>
                                        {
                                            isFollowed
                                            ?
                                            <span style={{color:'#1890ff'}}><Icon type="check" />已关注</span>
                                            :
                                            <span><Icon type="plus" />关注话题</span>
                                        }
                                    </div>
                                    
                                }
                            </div>
                            <div style={{display:'inline-block',width:'33%',borderRight:'1px solid rgb(197, 195, 195)'}} onClick={this.handleReply.bind(this,_id)}>
                                <Icon type="edit" />参与话题
                            </div>
                            <div style={{display:'inline-block',width:'33%'}} onClick={this.handleShare.bind(this,_id)}>
                                <Icon type="export" />转发话题
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
        var { inline, columns } = this.props;

        if(inline){
            var container = this.cardContainer;

            var cardContainers = container.childNodes;
            var cardWidth = container.offsetWidth/columns;
            // 放置每一列的高度数据
            var cardsColHeight = [];

            for(var i=0,len=cardContainers.length;i<len;i++){
                var cardContainer = cardContainers[i];
                if(i<columns){
                    console.log(cardContainer.offsetHeight);
                    cardsColHeight.push(cardContainer.offsetHeight);
                    cardContainer.style.left = i*cardWidth + 'px';
                    cardContainer.style.top = '0px';
                } else {
                    
                    var minHeight = getMinValueOfArr(cardsColHeight);
                    
                    var minHeightIndex = getMinIndexOfArr(cardsColHeight,minHeight);
                    cardContainer.style.left = minHeightIndex * cardWidth + 'px';
                    cardContainer.style.top = minHeight + 'px';
                    cardsColHeight[minHeightIndex] = cardsColHeight[minHeightIndex] + cardContainer.offsetHeight;
                }
            

            }
            var maxHeight = getMaxValueOfArr(cardsColHeight);
            container.style.height = maxHeight + 'px';

            
        }
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


