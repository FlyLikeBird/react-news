import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, Popover, message } from 'antd';
import { TopicListItem } from '../pc/pc_topic/pc_topic_list';
import { NewsListItem } from '../pc/pc_usercenter/pc_newslist';
import UpdateInnerItem from '../pc/pc_usercenter/pc_usercenter_inner_update_item';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
import { parseDate, formatDate, translateType, formatContent } from '../../../utils/translateDate';


const { TextArea } = Input;

export default class ShareModal extends React.Component{
   
    handleShare(){        
        var { onVisible, forUserAction, actionInfo, isActionPage, onUpdate, commentid, parentcommentid, onUpdateShareBy, isSelf } = this.props;
        var userid = localStorage.getItem('userid'); 
        var params = {},fetchParams = '/action/share?';       
        if(this.textArea){
            var value = this.textArea.textAreaRef.value;
        }       
        //  动态页面的转发逻辑
        if ( forUserAction && actionInfo ){
            var { username, contentType, innerAction, hasInnerAction, composeAction, actionId, contentId, text } = actionInfo;             
            params = {
                userid,
                value,
                text:`@${username}:${text}`,
                contentId,
                innerAction:isSelf ? innerAction : actionId,
                contentType,
                actionId,
                isActionPage:isSelf ? 'true': '',
                composeAction: hasInnerAction ? 'true' : '',
                commentid:commentid?commentid:'',
                parentcommentid:parentcommentid?parentcommentid:''
            }
        //  转发新闻/话题/评论的逻辑
        } else {
            var { contentType, text, uniquekey } = this.props;
            params = {
                userid,
                contentType,
                contentId:uniquekey,
                actionId:'',
                innerAction:'',
                value,
                text:text?text:'',
                composeAction:'',
                isActionPage:'',
                commentid:commentid?commentid:'',
                parentcommentid:parentcommentid?parentcommentid:''
            }
        }
        var keys = Object.keys(params);
        for(var i=0,len=keys.length;i<len;i++){
            fetchParams+=`${keys[i]}=${params[keys[i]]}&`
        }        
        fetch(fetchParams)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                if ( forUserAction && isSelf){
                    onUpdate(data);
                }
                
                if (onVisible) onVisible(false);
                if (onUpdateShareBy) onUpdateShareBy(data);
                message.info(`转发${forUserAction?'动态':translateType(contentType)}成功!`)
            })
         
    }

    render(){
        
        var { actionInfo, uniquekey, data, visible, history, forUserAction, onVisible } = this.props;
        var { contentType, hasInnerAction, innerAction, contentId, username, composeAction, value, text } = actionInfo;
       
        return(
       
                <Modal visible={visible} footer={null} onCancel={()=>onVisible(false)}>
                    <div>
                        <TextArea rows={2} ref={textarea=>this.textArea=textarea}/>
                        {
                            forUserAction && !hasInnerAction
                            ?
                            <UpdateInnerItem actionInfo={actionInfo} history={history} noLink={true}/>
                            :
                            forUserAction && hasInnerAction
                            ?
                            <div style={{fontSize:'12px'}}>                                
                                <span style={{display:'inline-block',margin:'4px 0'}}>
                                    {
                                        composeAction 
                                        ?
                                        `@${username}:${text}`
                                        :
                                        `@${username}:${value}`
                                    }
                                </span>
                                <UpdateInnerItem forAction={true} uniquekey={innerAction} history={history} noLink={true}/>
                            </div>
                            
                            :
                            <div>
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
                                                    <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.user} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                                    :
                                                    null
                                                }
                                            </span>
                                        ))
                                        :
                                        <span>{text}</span>
                                        :
                                        null
                                    }
                                </div>
                                <div style={{padding:'10px 20px',backgroundColor:'rgb(249, 249, 249)'}}>
                                    {
                                        contentType === 'news' 
                                        ?
                                        <NewsListItem uniquekey={uniquekey} forSimple={true} hasImg={true} noLink={true}/>
                                        :
                                        contentType === 'topic' 
                                        ?
                                        <TopicListItem uniquekey={uniquekey} noAction={true} forSimple={true}/>
                                        :  
                                        null                                                  
                                    }
                                </div>  
                            </div>
                           
                               

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


