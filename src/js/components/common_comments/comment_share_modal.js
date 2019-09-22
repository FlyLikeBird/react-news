import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, Popover } from 'antd';
import { TopicListItem } from '../pc_topic/pc_topic_list';
import { NewsListItem } from '../pc_usercenter/pc_newslist';
import CommentPopoverUserAvatar from './comment_popover_useravatar';


const { TextArea } = Input;

export default class ShareModal extends React.Component{
    constructor(){
        super();
        this.state={
            item:{}
        }
    }

    handleShare(){        
        var { toId, text, shareType, onVisible, data, onUpdate, forUserAction, isSelf } = this.props;
        var userid = localStorage.getItem('userid');        
        if(this.textArea){
            var value = this.textArea.textAreaRef.value;
        }       
        if (userid){

            fetch(`/action/share?userid=${userid}&content=${text?text:''}&uniquekey=${toId}&actionType=${shareType}&value=${value}&forUserAction=${forUserAction?forUserAction:''}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if (forUserAction && isSelf){
                        onUpdate(data);
                    }
                    onVisible(false);
                })
        } else {
            message.error('请先登录!')
        }       
    }

    checkPopoverUsername(username){
        var str=username;
        if( username.match(/:$/)){
            str = username.substring(0,username.length-1)
        }
        return str;
    }

    render(){
        
        var { shareType, text, data, visible, item, onVisible } = this.props;
        
        return(

            
                <Modal visible={visible} footer={null} onCancel={()=>onVisible(false)}>
                    <div>
                        <TextArea rows={2} ref={textarea=>this.textArea=textarea}/>
                        <div style={{margin:'4px 0',fontSize:'12px'}}>
                            
                            {
                                data
                                ?
                                data.length
                                ?
                                data.map((item,index)=>(
                                    <span key={index}>
                                        { item.text ? <span>{item.text}</span> : null}
                                        {
                                            item.user
                                            ?
                                            <Popover placement="bottom" content={<CommentPopoverUserAvatar user={this.checkPopoverUsername(item.user)} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                            :
                                            null
                                        }
                                    </span>
                                ))
                                :
                                null
                                :
                                null
                            }
                        </div>
                        {
                            shareType === 'news' || shareType === 'action'
                            ?
                            <NewsListItem item={item} hasImg={true} noLink={true}/>
                            :
                            shareType === 'topic'
                            ?
                            <TopicListItem item={item} noAction={true} forSimple={true}/>
                            :
                            null
                        }               
                        <div style={{padding:'10px 0'}}>
                            <Button size="small" style={{fontSize:'12px',marginRight:'4px'}} type="primary" onClick={this.handleShare.bind(this)}>转发</Button>
                            <Button size="small" style={{fontSize:'12px'}} onClick={()=>onVisible(false)}>取消</Button>
                        </div>
                    </div>
                </Modal>
                                      
        )
    }
}


