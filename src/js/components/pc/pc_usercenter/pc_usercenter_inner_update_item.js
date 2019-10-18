import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import CommentPopoverUserAvatar from '../../common_comments/comment_popover_useravatar';
import { TopicListItem } from '../pc_topic/pc_topic_list';
import { NewsListItem } from './pc_newslist';
import { formatContent } from '../../../../utils/translateDate';

export default class UpdateInnerItem extends React.Component{
    constructor(){
        super();
        this.state = {
            actionInfo:{}
        }
    }

    componentDidMount(){
        var { uniquekey, actionInfo, forAction } = this.props;
        if (uniquekey && forAction){
            fetch(`/action/getActionContent?contentId=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    //  判断转发的内部动态是评论还是新闻
                    data.text = data.value + (data.text ? '//' + data.text : '');

                    data.translateData = formatContent(data.text);
                    console.log(data);
                    this.setState({actionInfo:data})
                })
        } else {
            this.setState({actionInfo})
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
        var { contentId, contentType, value, text, username, translateData } = actionInfo;
       
        return(
            
            <div onClick={this.handleClick.bind(this)} style={{fontSize:'12px',color:'rgba(0, 0, 0, 0.65)',padding:'10px 20px',backgroundColor:'rgb(249, 249, 249',cursor:'pointer',borderRadius:'4px'}}>
                
                <span style={{fontWeight:'500',color:'#000'}}>{`@${username}:`}</span>
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



