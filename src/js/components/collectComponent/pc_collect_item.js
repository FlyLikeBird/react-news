import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Form, Select, Card, Collapse } from 'antd';

import NewsList from '../pc/pc_usercenter/pc_newslist';

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
            isCollected:false
        }
    }

    handleAddIntoCollect(id,uniquekey,e){
        e.stopPropagation();
        var { onShowMsg, onAddCollect } = this.props;
        var userid = localStorage.getItem('userid');
        if (userid){
                  
            fetch(`/collect/addIntoCollect?userid=${userid}&uniquekey=${uniquekey}&id=${id}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if (onAddCollect){
                        onAddCollect(data);
                    }
                    this.setState({className:'add-motion',isCollected:true});
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

    componentDidMount(){
        var { item } = this.props;
        var { isCollected } = item;
        this.setState({isCollected})
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
        fetch(`/collect/removeCollectContent?userid=${localStorage.getItem('userid')}&collectId=${id}&contentId=${contentId}&uniquekey=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                if (onAddCollect){
                    onAddCollect(data);
                }
                this.setState({isCollected:false})
            })
    }

    render(){
        var { isCollected, className } = this.state;
        var { item, uniquekey, forUser } = this.props;
        var { privacy, content, tag, defaultCollect, id, followedBy, shareBy } = item; 

        return (
            
                <div style={{display:'flex',alignItems:'center'}}>
                    <div style={{fontSize:'30px',color:'#ccc',flex:'1'}}><Icon style={{color:'#1890ff'}} className={className} type="folder-add" theme="filled" /></div>
                    <div style={{flex:'7'}}>
                        <span>{tag}</span>
                        <div>
                            <span className="collect-card-text">{privacyObj[privacy]}</span>
                            <span className="collect-card-text">{`${content.length}条内容`}</span>
                            {
                                defaultCollect 
                                ?
                                null
                                :
                                privacy == 2 
                                ?
                                null
                                :
                                <span className="collect-card-text">{`${followedBy.length}人收藏`}</span>
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
                                <span className="collect-card-text">{`${shareBy.length}人分享`}</span>
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
                        <Button size="small" onClick={this.handleRemoveCollect.bind(this,id)} shape="circle" icon="close"/>
                        :
                        null
                    }
                       
                    
                </div>
            
        )
    }
}


export default class CollectItem extends React.Component {
    
    render(){
        var { data, uniquekey, forUser, onVisible, text, onAddCollect, onShowMsg } = this.props;
        
        return(
            
        <div>   
            <Collapse
                 className="collect-card"
                 bordered={false}
                 expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    
            >
                 {   
                     data.length
                     ?
                     data.map((item,index)=>(
                         <Panel 
                            key={index} 
                            header={
                                <PanelHeader 
                                    forUser={forUser} 
                                    onShowMsg={onShowMsg} 
                                    onAddCollect={onAddCollect} 
                                    item={item}
                                    onVisible={onVisible} 
                                    uniquekey={uniquekey}/>
                                }
                        >
                             {
                                 item.content.length
                                 ?
                                 <NewsList data={item.content} collectId={item.id} hasImg  onAddCollect={this.props.onAddCollect}/>
                                 :
                                 <div>还没有收藏任何内容</div>
                             } 
                         </Panel>
                     ))
                     :
                     <div>{text}</div>
                 }
            </Collapse>
            
        </div>   
                    

        )
    }
}

