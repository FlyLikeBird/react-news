import React from 'react';

import { Menu, Icon, Tabs, Modal, Card, List, Spin, Badge, Input, Button, Popover, message } from 'antd';
import TopicListItem from '../topic_list/topic_list_item';
import NewsListItem  from '../news_list/news_list_item';
import UpdateItem from '../update_list/update_list_item';
import CollectItem from '../collectComponent/collect_item';
import CommentPopoverUserAvatar from '../popover_user_avatar';
import { parseDate, formatDate, translateType, formatContent } from '../../../utils/translateDate';

const { TextArea } = Input;

export default class ShareModal extends React.Component{
   
    handleShare(){        
        var { onVisible, uniquekey, onModel, forAction, item, isActionPage, onUpdate, commentid, onUpdateShareBy, isSelf } = this.props;
        var userid = localStorage.getItem('userid'); 
        var params = {},fetchParams = '/api/action/share?';       
        if(this.textArea){
            var userInput = this.textArea.textAreaRef.value;
        }       
        //  动态页面的转发逻辑
        if ( forAction && item ){
            var { user, composeAction, isCreated, _id, contentId, value, text } = item; 
                       
            params = {
                userid,
                value:userInput,
                text: composeAction ? `@${user.username}:${value}//${text}` : `@${user.username}:${value}`,
                onModel:'Action',
                contentId:item.onModel==='Action' ? contentId._id : _id,
                actionId:_id,
                isActionPage:isSelf ? 'true': '',
                composeAction:item.onModel ==='Action' ? true :'',
                commentid:commentid?commentid:''
            }
        //  转发新闻/话题/评论的逻辑
        } else {
            var { text } = this.props;
            params = {
                userid,
                onModel,
                contentId:uniquekey,
                actionId:'',
                value:userInput,
                text:text?text:'',
                composeAction:'',
                isActionPage:'',
                commentid:commentid ? commentid : ''
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
                if ( forAction && isSelf){
                    onUpdate(data);
                }  else {
                    if (onUpdateShareBy) onUpdateShareBy(data);
                }       
                if (onVisible) onVisible(false);               
                message.info(`转发${forAction?'动态':translateType(onModel)}成功!`)
            })
         
    }

    render(){      
        var { onModel, item, visible, history, text, translateData, onVisible } = this.props;
        return(      
                <Modal visible={visible} footer={null} onCancel={()=>onVisible(false)} destroyOnClose={true}>
                    <div>
                        <TextArea rows={2} ref={textarea=>this.textArea=textarea}/> 
                        {
                            translateData && translateData.length
                            ?
                            <div style={{padding:'4px 0', fontSize:'12px'}}>
                                {                              
                                    translateData.map((item,index)=>(
                                        <span key={index}>
                                            { item.text ? <span>{item.text}</span> : null }
                                            {
                                                item.user
                                                ?
                                                <Popover placement="bottom" content={<CommentPopoverUserAvatar user={item.user} />}><span style={{color:'#1890ff'}}>{`@${item.user}`}</span></Popover>
                                                :
                                                null
                                            }
                                            
                                        </span>
                                    ))                                    
                                }
                            </div>
                            :
                            text
                            ?
                            <div style={{padding:'4px 0'}}>{text}</div>
                            :
                            null
                        }                                                                                               
                        {   
                            onModel === 'Action'
                            ?
                            <UpdateItem data={item} forSimple={true} noAction={true} noLink={true}/>
                            : 
                            <div>                      
                                {
                                    onModel === 'Article' 
                                    ?
                                    <NewsListItem data={item} forSimple={true} hasImg={true} noLink={true}/>
                                    :
                                    onModel === 'Topic' 
                                    ?
                                    <TopicListItem data={item} noAction={true} forSimple={true}/>
                                    :
                                    onModel === 'Collect'
                                    ?
                                    <CollectItem data={item} forSimple={true}/>
                                    :
                                    null
                                }
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


