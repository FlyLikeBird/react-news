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
            actionInfo:{},
            translateData:[]
        }
    }

    componentDidMount(){
        var { uniquekey } = this.props;
        fetch(`/action/getActionContent?contentId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                var translateData = formatContent(data.value+'//'+data.text);
                this.setState({actionInfo:data,translateData});
            })
    }

    handleClick(){
        var { uniquekey, history, noLink } = this.props;
        if (!noLink){
            history.push(`/action/${uniquekey}`)
        }
    }

    render(){
        var { uniquekey } = this.props;
        var { actionInfo, translateData } = this.state;
        var { contentId, contentType, text, username } = actionInfo;
       
       
        return(
            
            <div onClick={this.handleClick.bind(this)} style={{color:'rgba(0, 0, 0, 0.65)',padding:'10px 20px',backgroundColor:'rgb(249, 249, 249',cursor:'pointer',borderRadius:'4px'}}>
                
                <span style={{fontWeight:'500',color:'#000'}}>{`@${username}:`}</span>
                <div>
                    {
                        translateData.length
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



