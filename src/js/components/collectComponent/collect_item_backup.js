import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Form, Select, Card, Collapse } from 'antd';

import NewsList from '../pc/pc_usercenter/pc_newslist';
import TopicItemPopover from '../pc/pc_topic/pc_topic_item_popover';

const { Option } = Select;
const { Meta } = Card;
const { Panel } = Collapse;

var privacyObj = {
    '0':'公开的',
    '1':'仅对关注的人可见',
    '2':'私密的仅自己可见'
}

class PanelHeader extends React.Component {

    constructor(){
        super();
        this.state = {
            className:'',
            item:{},
            isCollected:false,
            followedBy:[],
            iconType:'caret-left'
        }
    }

    handleAddIntoCollect(id,uniquekey,e){
        e.stopPropagation();
        var { onShowMsg, onAddCollect } = this.props;
        var userid = localStorage.getItem('userid');
        if (userid){                 
            fetch(`/api/collect/addIntoCollect?userid=${userid}&uniquekey=${uniquekey}&id=${id}`)
                .then(response=>response.json())
                .then(json=>{
                    /*
                    var data = json.data;
                    if (onAddCollect){
                        onAddCollect(data);
                    }
                    this.setState({className:'add-motion',isCollected:true});
                    setTimeout(()=>{
                        this.setState({className:''})
                    },1000)
                    */
                    var data = json.data;
                    this.setState({item:data,className:'add-motion',isCollected:true});
                    setTimeout(()=>{
                        this.setState({className:''})
                    },1000)

                })   
        }        
    }

    handleRemoveCollect(id,e){
        e.stopPropagation();
        var { onVisible } = this.props;
        if ( onVisible ) {
            onVisible(true,id);
        }
    }

    componentWillReceiveProps(newProps){
        if (this.props.item.id != newProps.item.id){
            this.setState({item:newProps.item});
        }
    }

    componentDidMount(){       
        var { item } = this.props;
        console.log(item);
        var { isCollected, followedBy } = item;
        this.setState({item, isCollected,followedBy})
    }

    handleRemoveContent(id,e){
        e.stopPropagation();
        var { item, uniquekey, onAddCollect } = this.props;
        var { content } = item;
        var contentId = '';
        for(var i=0,len=content.length;i<len;i++){
            if ( content[i].articleId === uniquekey){
                contentId = content[i].id;
            }
        }
        fetch(`/api/collect/removeCollectContent?userid=${localStorage.getItem('userid')}&collectId=${id}&contentId=${contentId}&uniquekey=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                if (onAddCollect){
                    onAddCollect(data);
                }
                this.setState({isCollected:false})
            })
    }

    handleChangeIcon(type,visible){
        if (visible===true){
            this.setState({iconType:'caret-down'})
        } else {
            this.setState({iconType:'caret-left'})
        }
    }

    handleFollowCollect(id){
        var userid = localStorage.getItem('userid');
        fetch(`/api/collect/followCollect?collectId=${id}&userid=${userid}`)
            .then(response=>response.json())
            .then(json=>{

            })
    }

    render(){
        var { isCollected, className, iconType, followedBy,item } = this.state;
        var { uniquekey, forUser, isSelf } = this.props;
        var { privacy, content, tag, defaultCollect, id } = item; 
        
        return (
            
                <div style={{display:'flex',alignItems:'center',marginLeft:'20px',width:'100%'}}>

                    <div style={{fontSize:'30px',color:'#ccc',flex:'1'}}><Icon style={{color:'#1890ff'}} className={className} type="folder-add" theme="filled" /></div>
                    <div style={{flex:'7'}}>
                        <span>{tag}</span>
                        <div>
                            <span className="collect-card-text">{privacyObj[privacy]}</span>
                            <span className="collect-card-text">{`${content?content.length:0}条内容`}</span>
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
                                    <span className="collect-card-text">{`${followedBy.length}人收藏`}<Icon type={iconType} /></span>
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
                        <Button size="small" className="cancel" onClick={this.handleRemoveContent.bind(this,id)} shape="circle" icon="check"/> 
                        :
                        <Button size="small" className="add"  onClick={this.handleAddIntoCollect.bind(this,id,uniquekey)} shape="circle" icon="plus"/> 
                    }
                    
                    {
                        forUser
                        ?
                        defaultCollect
                        ?
                        null
                        :
                        isSelf
                        ?
                        <Button size="small" onClick={this.handleRemoveCollect.bind(this,id)} shape="circle" icon="close"/>
                        :
                        <Button size="small" onClick={this.handleFollowCollect.bind(this,id)} shape="circle" icon="export"/>
                        :
                        null
                    }
                       
                    
                </div>
            
        )
    }
}

export default class CollectItem extends React.Component {
    
    render(){
        var { data, uniquekey, forUser, onVisible, text, isSelf, onAddCollect, onShowMsg } = this.props;
        
        return(
            
        <div>
            {
                data.length
                ?
                <Collapse
                 className="collect-card"
                 bordered={false}
                 expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    
                >
                    {                        
                     
                         data.map((item,index)=>(
                        
                             <Panel 
                                key={index} 
                                header={
                                    <PanelHeader 
                                        forUser={forUser} 
                                        onShowMsg={onShowMsg} 
                                        onAddCollect={onAddCollect} 
                                        item={item}
                                        isSelf={isSelf}
                                        onVisible={onVisible} 
                                        uniquekey={uniquekey}/>
                                    }
                            >
                                {
                                    item.content.length
                                    ?
                                    <NewsList data={item.content} collectId={item.id} hasImg={true} forSimple={true} onAddCollect={this.props.onAddCollect}/>
                                    :
                                    <div>还没有收藏任何内容</div>

                                }
                                 
                             </Panel>
                        
                         ))
                    }
                       
                </Collapse>
                :
                <span>{text}</span>
            }            
            
        </div>   
                    

        )
    }
}

