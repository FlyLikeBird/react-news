import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
import TopicListItem  from '../topic_list/topic_list';
import NewsListItem from '../news_list/news_list_item';
import ImgContainer from '../img_container';
import { formatContent } from '../../../utils/translateDate';

export default class UpdateInnerItem extends React.Component{

    handleClick(){
        var { uniquekey, history, noLink } = this.props;
        if (!noLink){
            history.push(`/action/${uniquekey}`)
        }
    }

    render(){
        var { data } = this.props;    
        var { contentId, onModel, value, text, images, isCreated, user } = data;
        var finalText = text ? `${value}//${text}` : value;
        var translateData = formatContent(finalText);
        
        return(
            
            <div className="inner-action" onClick={this.handleClick.bind(this)}>
                
                <span className="title">{`@${user.username}:`}</span>
                <div>
                    <span style={{display:'inline-block',padding:'4px 0'}}>
                        {
                            translateData && translateData.length
                            ?
                            translateData.map((item,index)=>(
                                        <span key={index}>
                                            { item.text ? <span>{item.text}</span> : null}
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
                    </span>
                </div>
                <div>
                    {
                        isCreated && images && images.length
                        ?                           
                        images.map((item,index)=>(
                            <ImgContainer bg={item} key={index} />
                        ))                                   
                        :
                        null
                    }
                </div>
                
                {
                    onModel === 'Article'
                    ?
                    <NewsListItem data={contentId} forSimple={true} hasImg={true} noLink={true}/>
                    :
                    onModel === 'Topic'
                    ?
                    <TopicListItem  noAction={true} forSimple={true}/>
                    :  
                    null                                                  
                } 
            </div>
        )
    }
    
}



