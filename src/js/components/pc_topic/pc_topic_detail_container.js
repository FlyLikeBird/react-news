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
            shareVisible:false,
            isLoad:true
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
                this.setState({item,isLoad:false});
            })
    }

    handleShareVisible(boolean,onUpdateShareBy){
        this.onUpdateShareBy = onUpdateShareBy;
        this.setState({shareVisible:boolean})
    }

    handleUpdateTopicItem(item){
        this.setState({item})
    }

    componentWillUnmount(){
        this.onUpdateShareBy = null
    }

    render(){
        var { history, socket, location } = this.props;
        var { item, isLoad, shareVisible } = this.state;
        var  uniquekey  = this.props.match.params.id;
        
        return(

            <div>
                {
                    isLoad
                    ?
                    <Spin />
                    :
                    <div>
                        <TopicListItem
                            item={item} 
                            forDetail={true}
                            onVisible={this.handleShareVisible.bind(this)} 
                            onUpdateItem={this.handleUpdateTopicItem.bind(this)}
                        />
                        <CommentsListContainer 
                            history={history}
                            location={location}
                            socket={socket} 
                            uniquekey={uniquekey} 
                            forTopic={true} 
                            item={item}
                            commentType="topic" 
                            warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                        />
                        <ShareModal 
                            visible={shareVisible} 
                            toId={uniquekey}         
                            onVisible={this.handleShareVisible.bind(this)} 
                            shareType="topic"
                            onUpdateShareBy={this.onUpdateShareBy}
                            item={item}
                        />
                    </div>                  
                }                
                
            </div>
                               
        )
    }
}


