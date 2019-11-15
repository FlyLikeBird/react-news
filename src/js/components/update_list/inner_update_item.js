import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
import TopicListItem  from '../topic_list/topic_list';
import NewsListItem from '../news_list/news_list';
import { formatContent } from '../../../utils/translateDate';

export default class UpdateInnerItem extends React.Component{
    constructor(){
        super();
        this.state = {
            actionInfo:{}
        }
    }

    componentDidMount(){
        var { uniquekey, actionInfo, noFetch } = this.props;
        if (noFetch){
            this.setState({actionInfo});
        } else if ( uniquekey && !noFetch){
        
            fetch(`/api/action/getActionContent?contentId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    //  判断转发的内部动态是评论还是新闻
                    data.text = data.value + (data.text ? '//' + data.text : '');
                    data.translateData = formatContent(data.text);
                    this.setState({actionInfo:data})
                })
        }
        
    }

    handleClick(){
        var { uniquekey, history, noLink } = this.props;
        if (!noLink){
            history.push(`/action/${uniquekey}`)
        }
    }

    render(){
        var { actionInfo } = this.state;       
        var { contentId, contentType, value, text, images, username, translateData } = actionInfo;
       
        return(
            
            <div className="inner-action" onClick={this.handleClick.bind(this)}>
                
                <span className="title">{`@${username}:`}</span>
                <div>
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
                        <span>{text}</span>
                    }
                </div>
                <div>
                    {
                        images && images.length
                        ?                           
                        images.map((item,index)=>(
                            <span key={index} className="img-container"><img src={item} /></span>
                        ))                                   
                        :
                        null
                    }
                </div>
                
                {
                    contentType === 'news'
                    ?
                    <NewsListItem uniquekey={contentId} forSimple={true} hasImg={true} noLink={true}/>
                    :
                    contentType === 'topic'
                    ?
                    <TopicListItem uniquekey={contentId} noAction={true} forSimple={true}/>
                    :  
                    null                                                  
                } 
            </div>
        )
    }
    
}



