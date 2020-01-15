import React from 'react';
import { Row, Col, BackTop, Button, Icon, Tooltip, Popover, Modal, Input, Form, Select, Card, Collapse } from 'antd';
import { parseDate, formatDate, translateType, formatContent } from '../../../utils/translateDate';

import CollectContentItem from './collect_content_item';
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
            collectedByUser:false,
            visible:false,
            iconType:'caret-right',
            innerIcon:'caret-left',
            addFlash:''
        }
    }

    componentDidMount(){
        var { data } = this.props;
        var { isCollected, collectedByUser } = data;
        this.setState({item:data, isCollected, collectedByUser});
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
                this.setState({item:data && data[0],isCollected:true});               
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
            var { isCollected, collectedByUser } = newProps.data;
            this.setState({item:newProps.data,isCollected, collectedByUser});
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
                this.setState({item:data && data[0],isCollected:false});
                
            })     
    }

    _updateItem(data){
        this.setState({item:data});
    }

    handleShareCollect(id, e){
        e.stopPropagation();
        var { onShareVisible } = this.props;
        var { item } = this.state;
        if ( onShareVisible ) onShareVisible(true, item, this._updateItem.bind(this));
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
        fetch(`/api/collect/followCollect?collectId=${id}&userid=${userid}&unFollow=${unFollow}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({item:data && data[0], collectedByUser:!this.state.collectedByUser,className:'add-motion'});
                setTimeout(()=>{
                    this.setState({className:''})
                },1000)
            })  
    }

    handleShowContent(e){
        var { visible } = this.state;
        if (visible){
            this.setState({visible:false,iconType:'caret-right'})
        } else {
            this.setState({visible:true,iconType:'caret-down'});
        }
        
    }

    render(){
        var { isSelf, uniquekey, history, forSimple, forUser, forMobile } = this.props;
        var { item, iconType, innerIcon, className, isCollected, collectedByUser, addFlash, motion, visible } = this.state;
        var { tag, defaultCollect, privacy, createtime, followedBy, shareBy, collectItem, _id } = item;
        return(
            <div className={ forSimple ? "collect-container forSimple" : "collect-container"}>
                <div className="collect-header" onClick={this.handleShowContent.bind(this)}>
                    <Icon type={iconType} />
                    <div className="collect-card">
                        <div style={{flex:'1',position:'relative'}}>
                            <span style={{fontSize:'30px',color:'#1890ff'}}><Icon className={className} type="folder-add" theme="filled" /></span>
                            
                                <span ref={rollOut=>this.rollOut=rollOut} className='motion rollOut'><Icon type="file-text" /></span>
                                
                                <span ref={rollIn=>this.rollIn=rollIn} className='motion rollIn'><Icon type="file-text" /></span>
                            
                            
                        </div>
                        <div style={{flex:'7',marginLeft:'20px'}}>
                            <span style={{color:'#000',fontWeight:'500'}}>{tag}</span>
                            <div>
                                <span className="text">{`创建于${formatDate(parseDate(createtime))}`}</span>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <span className="text">{`${privacyObj[privacy]}`}</span>
                                    
                                    <span className="text">{`${collectItem?collectItem.length:0}条内容`}</span>
                                    
                                    {
                                        defaultCollect 
                                        ?
                                        null
                                        :
                                        privacy == 2 
                                        ?
                                        null
                                        :
                                        <Popover trigger={forMobile?'click':'hover'} onVisibleChange={this.handleChangeIcon.bind(this)} autoAdjustOverflow={false} content={<TopicItemPopover data={followedBy} text="收藏" history={history}/>}>
                                            <span className="text">{`${followedBy?followedBy.length:0}人收藏`}<Icon type={innerIcon} /></span>                                           
                                        </Popover>
                                        
                                    }
                                   
                                    {
                                        defaultCollect 
                                        ?
                                        null
                                        :
                                        privacy == 2 
                                        ?
                                        null
                                        :
                                        <Popover trigger={forMobile?'click':'hover'} onVisibleChange={this.handleChangeIcon.bind(this)} autoAdjustOverflow={false} content={<TopicItemPopover data={shareBy} text="转发" forShare={true} history={history}/>}>
                                            <span className="text">{`${shareBy?shareBy.length:0}人转发`}<Icon type={innerIcon} /></span>
                                        </Popover>
                                        
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            forUser || forSimple
                            ?
                            null
                            :
                            <div>
                                {
                                    isCollected
                                    ?
                                    <Button size="small" className="button" onClick={this.handleRemoveContent.bind(this,_id, uniquekey)} shape="circle" icon="check"/> 
                                    :
                                    <Button size="small" className="button"  style={{backgroundColor:'rgb(24, 144, 255)'}} onClick={this.handleAddIntoCollect.bind(this,_id)} shape="circle" icon="plus"/> 
                                }
                                <Button size="small" className="button" style={{backgroundColor:'rgb(24, 144, 255)'}} onClick={this.handleShareCollect.bind(this,_id)} shape="circle" icon="export"/>
                            </div>
                            
                        }
                        
                        {   

                            forUser
                            ?
                            defaultCollect || forSimple
                            ?
                            null
                            :
                            isSelf
                            ?
                            <div>
                                <Button size="small"  className="button" style={{backgroundColor:'rgb(24, 144, 255)'}} onClick={this.handleRemoveCollect.bind(this,_id)} shape="circle" icon="close"/>
                                <Button size="small" className="button" style={{backgroundColor:'rgb(24, 144, 255)'}} onClick={this.handleShareCollect.bind(this,_id)} shape="circle" icon="export"/>
                            </div> 
                            :
                            
                            <div>
                            <Tooltip title={collectedByUser?'取消收藏':'收藏'}>
                                {/*<Icon type="star" className={addFlash} theme={collectedByUser?'filled':'outlined'} style={{color:collectedByUser?'#1890ff':'rgba(0, 0, 0, 0.65)'}} onClick={this.handleFollowCollect.bind(this,_id,collectedByUser?true:'')} />*/}
                                 <Button size="small" style={{backgroundColor:collectedByUser?'#dadada':'#1890ff'}} className="button" onClick={this.handleFollowCollect.bind(this,_id,collectedByUser?true:'')} shape="circle">
                                    <Icon type="star" theme={collectedByUser?'filled':'outlined'} style={{color:'#fff'}}/>
                                 </Button>

                            </Tooltip>
                            <Button size="small" className="button" style={{backgroundColor:'rgb(24, 144, 255)'}} onClick={this.handleShareCollect.bind(this,_id)} shape="circle" icon="export"/>

                            </div>
                            :
                            null
                        }
                       
                    
                    </div>
                </div>
                <div style={{display:visible?'block':'none'}}>
                    {
                        collectItem && collectItem.length
                        ?
                        collectItem.map((item, index)=>(
                            <CollectContentItem data={item} key={index} forSimple={forSimple}/>
                        ))
                        :
                        <div>还没有收藏任何内容</div>

                    }
                </div>
            </div>    

        )
    }
}

