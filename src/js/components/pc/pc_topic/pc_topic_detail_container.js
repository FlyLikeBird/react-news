import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, message } from 'antd';
import { TopicListItem } from './pc_topic_list';
import CommentsInput from '../../common_comments/comments_input';

import ShareModal from '../../shareModal';
import CommentsListContainer from '../../common_comments/comments_list_container';

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
        
        var { location } = this.props;

        var search = location.search.match(/\?id=(.*)/);
        var topicId = '';
        if (search && search[1]) {
            topicId = search[1];
        }
        if (topicId){
            fetch(`/api/topic/getTopicDetail?topicId=${topicId}`)
                .then(response=>response.json())
                .then(json=>{
                    var item =json.data;
                    this.setState({item,isLoad:false});
            })
        }
       
        
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
                            commentType="topic" 
                            warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                        />
                
                        {
                            shareVisible
                            ?
                            <ShareModal 
                                visible={shareVisible} 
                                toId={uniquekey}         
                                onVisible={this.handleShareVisible.bind(this)} 
                                shareType="topic"
                                onUpdateShareBy={this.onUpdateShareBy}
                                item={item}
                            />
                            :
                            null
                        }
                        
                    </div>                  
                }                
                
            </div>
                               
        )
    }
}


