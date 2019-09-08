import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, message } from 'antd';
import { TopicListItem } from './pc_topic_list';
import CommentsInput from '../common_comments/comments_input';
import TopicItemContent from './pc_topic_item_content';
import ShareModal from '../common_comments/comment_share_modal';
import CommentsListContainer from '../common_comments/comments_list_container';

const { TextArea } = Input;
export default class TopicDetailContainer extends React.Component{
    constructor(){
        super();
        this.state={
            item:{},
            visible:false,
            shareVisible:false
        }
    }

    componentDidMount(){
        var { match } = this.props;
        var topicId = match.params.id;
        //console.log(match);
        fetch(`/topic/getTopicDetail?topicId=${topicId}`)
            .then(response=>response.json())
            .then(json=>{
                var item =json.data;
                this.setState({item});
            })
    }

    handleReplyVisible(){
        
        this.setState({visible:!this.state.visible});
    }
    
    handleShareVisible(boolean){
        this.setState({shareVisible:boolean})
    }

    render(){
        var { item,  visible, shareVisible } = this.state;
        var  uniquekey  = this.props.match.params.id;
        //console.log(isUpdate);
        return(

            <div>
                <TopicListItem item={item} checkFollow={true} onVisible={this.handleShareVisible.bind(this)} onShowReply={this.handleReplyVisible.bind(this)}/>
                <div style={{display:visible?'block':'none'}}>
                    <CommentsInput  isAddComment={true} uniquekey={uniquekey} onShowReply={this.handleReplyVisible.bind(this)}/>
                </div>
                
                <CommentsListContainer uniquekey={uniquekey} hasCommentInput={false} text="还没有人发表过看法呢!请分享您的想法吧" shareType="topic"/>
                <ShareModal 
                    visible={shareVisible} 
                    toId={uniquekey}         
                    onVisible={this.handleShareVisible.bind(this)} 
                    shareType="topic"
                    item={item}
                />
            </div>
            
            
                       
        )
    }
}


