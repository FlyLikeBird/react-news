import React from 'react';
import { Row, Col, BackTop, Button, Icon, Tooltip, Popover, Modal, Input, Form, Select, Card, Collapse } from 'antd';

import NewsList from '../news_list/news_list';
import TopicItemPopover from '../topic_list/topic_item_popover';

const { Option } = Select;
const { Meta } = Card;
const { Panel } = Collapse;

var privacyObj = {
    '0':'公开的',
    '1':'仅对关注的人可见',
    '2':'私密的仅自己可见'
}


export default class CollectItem extends React.Component {
    constructor(){
        super();
        this.state = {
            item:{},
            className:'',
            isCollected:false,
            followedBy:[],
            visible:false,
            iconType:'caret-right',
            innerIcon:'caret-left',
            userCollected:false,
            addFlash:''
        }
    }

    componentDidMount(){
        var { data } = this.props;
        var { isCollected, followedBy, userCollected } = data;
        this.setState({item:data,isCollected,followedBy, userCollected});
    }
    
    handleAddIntoCollect(id, e){
        e.stopPropagation();
        var { uniquekey, onModel } = this.props;
        fetch(`/api/collect/addIntoCollect?collectId=${id}&contentId=${uniquekey}&onModel=${onModel}`)
            .then(response=>response.json())
            .then(json=>{            
                var data = json.data;
                var rollIn;
                if (this.rollIn) rollIn = this.rollIn;
                if (rollIn && rollIn.classList) {
                    rollIn.classList.add('addFlash');
                    setTimeout(()=>{
                        rollIn.classList.remove('addFlash');
                    },1000)
                } 
                this.setState({item:data,isCollected:true});               
            })   
        
           
    }

    handleRemoveCollect(id,e){
        e.stopPropagation();
        var { onVisible } = this.props;
        if ( onVisible ) {
            onVisible(true,id);
        }
    }
    
    componentWillReceiveProps(newProps){
        if (this.props.data._id != newProps.data._id){
            var { isCollected, followedBy, userCollected } = newProps.data;
            this.setState({item:newProps.data,isCollected,followedBy, userCollected});
        }
    }
    
    handleRemoveContent(id, uniquekey, e){
        e.stopPropagation();
        fetch(`/api/collect/removeCollectContent?collectId=${id}&contentId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                var rollOut;
                if (this.rollOut) rollOut = this.rollOut;
                if (rollOut && rollOut.classList) {
                    rollOut.classList.add('addFlash');
                    setTimeout(()=>{
                        rollOut.classList.remove('addFlash');
                    },1000)
                } 
                this.setState({item:data,isCollected:false});
                
            })     
    }

    handleChangeIcon(type,visible){
        if (visible===true){
            this.setState({innerIcon:'caret-down'})
        } else {
            this.setState({innerIcon:'caret-left'})
        }
    }

    handleFollowCollect(id, unFollow, e){
        e.stopPropagation();   
        var userid = localStorage.getItem('userid');
        fetch(`/api/collect/followCollect?collectId=${id}&userid=${userid}&unFollow=${unFollow?unFollow:''}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({followedBy:data,userCollected:!this.state.userCollected,className:'add-motion'});
                setTimeout(()=>{
                    this.setState({className:''})
                },1000)
            })
        
    }

    handleShowContent(){
        var { visible } = this.state;
        if (visible){
            this.setState({visible:false,iconType:'caret-right'})
        } else {
            this.setState({visible:true,iconType:'caret-down'});
        }
        
    }

    render(){
        var { forUser, forCollect, isSelf, uniquekey, onAddCollect } = this.props;
        var { item, iconType, innerIcon, className, isCollected, followedBy, userCollected, addFlash, motion, visible } = this.state;
        var { tag, defaultCollect, privacy, content, _id } = item;
        return(
            <div className="collect-container">
                <div className="collect-header" onClick={this.handleShowContent.bind(this)}>
                    <Icon type={iconType} />
                    <div className="collect-card">
                        <span style={{flex:'1',position:'relative'}}>
                            <span style={{fontSize:'30px',color:'#1890ff'}}><Icon className={className} type="folder-add" theme="filled" /></span>
                            
                                <span ref={rollOut=>this.rollOut=rollOut} className='motion rollOut'><Icon type="file-text" /></span>
                                
                                <span ref={rollIn=>this.rollIn=rollIn} className='motion rollIn'><Icon type="file-text" /></span>
                            
                            
                        </span>
                        <div style={{flex:'7'}}>
                            <span>{tag}</span>
                            <div>
                                <span className="text">{privacyObj[privacy]}</span>
                                <span className="text">{`${content?content.length:0}条内容`}</span>
                                {
                                    defaultCollect 
                                    ?
                                    null
                                    :
                                    privacy == 2 
                                    ?
                                    null
                                    :
                                    <Popover onVisibleChange={this.handleChangeIcon.bind(this)} autoAdjustOverflow={false} content={<TopicItemPopover data={followedBy} text="收藏"/>}>
                                        <span className="text">{`${followedBy?followedBy.length:0}人收藏`}<Icon type={innerIcon} /></span>
                                    </Popover>
                                    
                                }
                                
                            </div>
                        </div>
                        {
                            forUser
                            ?
                            null
                            :
                            isCollected
                            ?
                            <Button size="small" className="cancel" onClick={this.handleRemoveContent.bind(this,_id,uniquekey)} shape="circle" icon="check"/> 
                            :
                            <Button size="small" className="add"  onClick={this.handleAddIntoCollect.bind(this,_id)} shape="circle" icon="plus"/> 
                        }
                        
                        {
                            forUser
                            ?
                            defaultCollect
                            ?
                            null
                            :
                            isSelf && !forCollect
                            ?
                            <Button size="small"  onClick={this.handleRemoveCollect.bind(this,_id)} shape="circle" icon="close"/> 
                            :
                            
                            // #fadb14  outlined
                            <Tooltip title={userCollected?'取消收藏':'收藏'}>
                                <Icon type="star" className={addFlash} theme={userCollected?'filled':'outlined'} style={{color:userCollected?'#1890ff':'rgba(0, 0, 0, 0.65)'}} onClick={this.handleFollowCollect.bind(this,_id,userCollected?true:'')} />
                            </Tooltip>
                            
                            :
                            null
                        }
                       
                    
                    </div>
                </div>
                <div style={{display:visible?'block':'none'}}>
                    {
                        content && content.length
                        ?
                        <NewsList data={content} collectId={_id} hasImg={true} forSimple={true} onAddCollect={this.props.onAddCollect}/>
                        :
                        <div>还没有收藏任何内容</div>

                    }
                </div>
            </div>    

        )
    }
}

