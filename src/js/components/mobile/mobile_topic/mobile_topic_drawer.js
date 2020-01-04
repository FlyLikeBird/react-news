import React from 'react';
import ScrollContainer from '../mobile_scroll_container';
import { Icon, Popover, Button, Radio, Spin, Tabs, Modal, Drawer } from 'antd';

export default class MobileTopicDrawer extends React.Component {
    constructor(){
        super();
        this.state = {
            radioValue:1,
            currentIndex:0,
            tags:[]
        }
    }
    componentDidMount(){   
        var { data } = this.props;          
        fetch(`/api/tag/getAllTags`)
            .then(response=>response.json())
            .then(json=>{
                var tags = json.data; 
                var obj = {};
                obj.content = {};
                obj['tag'] = '全部',obj['content'].length = data.length;
                tags.unshift(obj);
                this.setState({tags});                        
            })                
           
    }
    
    
    
    handleChangeTag(_id,index,e){
        var { onUpdate } = this.props;
        var target = e.currentTarget;
        var tagsContainer = this.tagsContainer;
        if (tagsContainer){
            var spans = tagsContainer.childNodes;
            for(var i=0,len=spans.length;i<len;i++){
                spans[i].classList.remove('selected');
            }
            target.classList.add('selected');
            if (_id){
                fetch(`/api/topic/getTopicsByTag?id=${_id}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if (onUpdate) onUpdate(data);                    
                })
            } else {
                fetch(`/api/topic/getAllTopics`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        if (onUpdate) onUpdate(data);
                    })
            }
        }       
    }

    render(){
        var { visible, onVisible, radioValue } = this.props;
        var { tags, currentIndex } = this.state;

        return (            
                <Drawer
                    className="topic-drawer"
                    visible={visible}
                    placement="right"
                    closable={false}
                    onClose={()=>onVisible(false)}
                >                        
                    <div className="tag-container">
                        {
                            tags.length
                            ?
                            tags.map((item,index)=>(
                                <div key={index} className="item">
                                    <span className={currentIndex == index ? "topic-tag selected" : "topic-tag"} onClick={this.handleChangeTag.bind(this,item._id,index)}>
                                        {item.tag}
                                        <span className="topic-tag-text">{`${item.content.length}条内容`}</span>
                                    </span>
                                </div>
                            ))
                            :
                            null
                        }
                    </div>
                         
                   
                </Drawer>
                
        )
    }
}






