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
            shareVisible:false
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
        var { history, socket, location, onSetScrollTop, match } = this.props;
        var { item, isLoad, shareVisible } = this.state;
        var  uniquekey  = match.params.id;
        
        return(

            <div>
                {
                    isLoad
                    ?
                    <Spin />
                    :
                    <div>
                        <TopicListItem
                            uniquekey={uniquekey}
                            forDetail={true}
                            onVisible={this.handleShareVisible.bind(this)} 
                            onUpdateItem={this.handleUpdateTopicItem.bind(this)}
                        />
                        
                        <CommentsListContainer 
                            history={history}
                            location={location}
                            socket={socket} 
                            uniquekey={uniquekey} 
                            onSetScrollTop={onSetScrollTop} 
                            commentType="topic" 
                            warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                        />
                
                        {
                            shareVisible
                            ?
                            <ShareModal 
                                visible={shareVisible} 
                                actionInfo={{contentType:'topic'}} 
                                contentType="topic"
                                uniquekey={uniquekey}       
                                onVisible={this.handleShareVisible.bind(this)} 
                                onUpdateShareBy={this.onUpdateShareBy}
                                topicItem={item}
                                
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


