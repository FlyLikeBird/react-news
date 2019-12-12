import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, message } from 'antd';
import TopicListItem from '../../topic_list/topic_list_item';
import CommentsInput from '../../common_comments/comments_input';

import ShareModal from '../../shareModal';
import CollectContainer from '../../collectComponent';
import CommentsListContainer from '../../common_comments/comments_list_container';

const { TextArea } = Input;

export default class TopicDetailContainer extends React.Component{
    constructor(){
        super();
        this.state={
            item:{},
            isLoading:true,
            shareVisible:false,
            collectVisible:false
        }
    }

    componentDidMount(){
        var { match } = this.props;
        var  uniquekey  = match.params.id;
        fetch(`/api/topic/getTopicDetail?topicId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({item:data && data[0], isLoading:false});     
            }) 
    }

    handleShareVisible(boolean, item){   
        if (boolean){
            console.log(item);
            this.setState({shareVisible:boolean, item})
        } else {
            this.setState({shareVisible:boolean});
        }          
    }

    handleCollectVisible(boolean){
        this.setState({collectVisible:boolean});
    }

    _updateItem(data){
        this.setState({item:data});
    }

    render(){
        var { history, socket, location, onSetScrollTop, onCheckLogin, match } = this.props;
        var { item, isLoading, shareVisible, replies, collectVisible } = this.state;
        var  uniquekey  = match.params.id;
        return(

            <div>
                {
                    isLoading
                    ?
                    <Spin />
                    :
                    <div>
                        <TopicListItem
                            data={item}
                            uniquekey={uniquekey}
                            forDetail={true}
                            onCheckLogin={onCheckLogin}
                            onVisible={this.handleShareVisible.bind(this)}
                            onCollectVisible={this.handleCollectVisible.bind(this)} 
                        />
                        
                        <Modal visible={collectVisible} footer={null} onCancel={this.handleCollectVisible.bind(this,false)} maskClosable={true} destroyOnClose={true}>                           
                                <CollectContainer uniquekey={uniquekey} isSelf={true} onModel="Topic" user={localStorage.getItem('userid')}/>                
                        </Modal>
                        <div style={{margin:'40px 0'}}>
                            <CommentsListContainer 
                                history={history}
                                location={location}
                                socket={socket}
                                onCheckLogin={onCheckLogin} 
                                uniquekey={uniquekey} 
                                onSetScrollTop={onSetScrollTop} 
                                commentType="Topic" 
                                onUpdateItemComments = {this._updateItem.bind(this)}
                                warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                            />
                        </div>
                
                        {
                            shareVisible
                            ?
                            <ShareModal 
                                visible={shareVisible} 
                                onModel="Topic"
                                uniquekey={uniquekey}       
                                onVisible={this.handleShareVisible.bind(this)} 
                                onUpdateShareBy={this._updateItem.bind(this)}
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


