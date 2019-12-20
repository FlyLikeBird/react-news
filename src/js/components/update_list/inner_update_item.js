import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import CommentPopoverUserAvatar from '../popover_user_avatar';
import TopicListItem  from '../topic_list/topic_list_item';
import NewsListItem from '../news_list/news_list_item';
import CollectItem from '../collectComponent/collect_item';
import ImgContainer from '../img_container';
import { formatContent } from '../../../utils/translateDate';

export default class UpdateInnerItem extends React.Component{

    handleClick(){
        var { history, data, noLink } = this.props;
        if (noLink) return ;
        if (history) {
            history.push(`/action/${data._id}`)
        }
    }

    render(){
        var { data, noLink, forComment, history } = this.props;    
        var { contentId, onModel, value, text, images, isCreated, user } = data;
        //  当在我的评论功能里，需要将
        var finalText = forComment ? `${value}${text?'//'+text:''}` : text ? `${value}//${text}` : value;
        var translateData = formatContent(finalText);
        // 考虑嵌套动态的情形
        contentId = onModel ==='Action' ? contentId.contentId : contentId;
        return(
            
            <div className="inner-action" onClick={this.handleClick.bind(this)}>
                {

                }
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
                    onModel === 'Article' || ( onModel ==='Action' && data.contentId.onModel === 'Article' )
                    ?
                    <NewsListItem data={contentId} forSimple={true} hasImg={true} noLink={noLink}/>
                    :
                    onModel === 'Topic' || ( onModel ==='Action' && data.contentId.onModel === 'Topic' )
                    ?
                    <TopicListItem  data={contentId} noAction={true} forSimple={true} noLink={noLink}/>
                    :  
                    onModel === 'Collect' || ( onModel === 'Action' && data.contentId.onModel ==='Collect')
                    ?
                    <CollectItem data={contentId} forSimple={true} history={history}/>
                    :
                    null                                                  
                } 
            </div>
        )
    }
    
}



