import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Popover, Button } from 'antd';
import TopicList from './pc_topic_list';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const TabPane = Tabs.TabPane;

const { Meta } = Card;


export default class TopicListContainer extends React.Component{
    constructor(){
        super();
        this.state={
            topicList:[],
            tags:[],
            inline:true,
            columns:4
        }
    }

    componentDidMount(){
        
        fetch(`/topic/getAllTopics`)
            .then(response=>response.json())
            .then(json=>{
                var topicList = json.data;
                fetch(`/tag/getAllTags`)
                    .then(response=>response.json())
                    .then(json=>{
                        var tags = json.data;
                       
                        
                        for(var i=0;i<10;i++){
                            topicList.push(topicList[i])
                        }
                        var obj = {};
                        obj.content = {};
                        obj['tag'] = '全部',obj['content'].length = topicList.length;
                        tags.unshift(obj);
                        this.setState({topicList,tags});
                        
                    })                
            })


    }
    
    _loadMoreTopics(){
        var { topicList } = this.state;
        for(var i=0;i<20;i++){
            topicList.push(topicList[Math.floor(Math.random()*10)])
        }
        this.setState({topicList})
    }

    handleChangeShowMode(boolean,columns){
        this.setState({inline:boolean,columns})
    }

    handleChangeTag(_id,index,e){
        var target = e.currentTarget;
        var tagsContainer = this.tagsContainer;
        if (tagsContainer){
            var spans = tagsContainer.childNodes;
            for(var i=0,len=spans.length;i<len;i++){
                spans[i].classList.remove('selected');
            }
            target.classList.add('selected');
            if (_id){
                fetch(`/topic/getTopicsByTag?id=${_id}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({topicList:data});
                    
                })
            } else {
                fetch(`/topic/getAllTopics`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        this.setState({topicList:data})
                    })
            }
        }       
    }

    render(){
        var { topicList, tags, inline, columns } = this.state;
        var { history } = this.props;
        
        return(

            <div>
                
                <div ref={tags=>this.tagsContainer = tags}>
                    {
                        tags.length
                        ?
                        tags.map((item,index)=>(
                            <span className="topic-tag" key={index} onClick={this.handleChangeTag.bind(this,item._id,index)}>
                                {item.tag}
                                <span className="topic-tag-text">{`${item.content.length}条内容`}</span>
                            </span>
                        ))
                        :
                        null
                    }
                </div>
                <div style={{padding:'10px 0'}}>
                    <Popover content={<div>卡片模式</div>}><Button size="small" onClick={this.handleChangeShowMode.bind(this,true,4)}><Icon type="appstore" /></Button></Popover>
                    <Popover content={<div>列表模式</div>}><Button size="small" onClick={this.handleChangeShowMode.bind(this,false,1)}><Icon type="unordered-list" /></Button></Popover>
                    <Popover content={<div>两列模式</div>}><Button size="small" onClick={this.handleChangeShowMode.bind(this,true,2)}><Icon type="column-width" /></Button></Popover>

                </div>
                <TopicList data={topicList} inline={inline} columns={columns} noAction={true} history={history}/>
                <Button onClick={this._loadMoreTopics.bind(this)}>加载更多话题</Button>

            </div>
                       
        )
    }
}


