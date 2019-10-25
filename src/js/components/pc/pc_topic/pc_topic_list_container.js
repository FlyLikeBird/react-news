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
            columns:4,
            isLoad:true
        }
    }

    componentDidMount(){
        
        fetch(`/api/topic/getAllTopics`)
            .then(response=>response.json())
            .then(json=>{
                var topicList = json.data;
                fetch(`/api/tag/getAllTags`)
                    .then(response=>response.json())
                    .then(json=>{
                        var tags = json.data; 
                        /*                      
                        for(var i=0;i<10;i++){
                            topicList.push(topicList[i])
                        }
                        */
                        var obj = {};
                        obj.content = {};
                        obj['tag'] = '全部',obj['content'].length = topicList.length;
                        tags.unshift(obj);
                        this.setState({topicList,tags,isLoad:false});
                        
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

    handleChangeShowMode(boolean,columns,e){
        var target = e.currentTarget;
        this.setState({inline:boolean,columns});
        var buttonContainer = this.buttonContainer;
        if (buttonContainer){
            var allButtons = buttonContainer.getElementsByTagName('button');
            for(var i=0,len=allButtons.length;i<len;i++){
                allButtons[i].classList.remove('current');
            }
            target.classList.add('current');
        }

    }
    /*
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
                fetch(`/api/topic/getTopicsByTag?id=${_id}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({topicList:data});
                    
                })
            } else {
                fetch(`/api/topic/getAllTopics`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        this.setState({topicList:data})
                    })
            }
        }       
    }
    */
    handleChangeTag(_id){
        var { tags } = this.state;
        fetch(`/api/tag/deleteTag?id=${_id}`)
            .then(response=>response.json())
            .then(json=>{
                var newArr = tags.concat(),deleteIndex = 0;
                for(var i=0,len=tags.length;i<len;i++){
                    if (tags[i]._id === _id){
                        deleteIndex = i;
                        break;
                    }
                }
                newArr.splice(deleteIndex,1);
                this.setState({tags:newArr});
            })
    }

    render(){
        var { topicList, tags, inline, columns, isLoad } = this.state;
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
                <div className="mode-button" ref={button=>this.buttonContainer=button} style={{padding:'10px 0'}}>
                    <Button size="small" className="current" onClick={this.handleChangeShowMode.bind(this,true,4)}><Icon type="appstore" /></Button>
                    <Button size="small" onClick={this.handleChangeShowMode.bind(this,false,1)}><Icon type="unordered-list" /></Button>
                    <Button size="small" onClick={this.handleChangeShowMode.bind(this,true,2)}><Icon type="column-width" /></Button>
                </div>
                {
                    isLoad
                    ?
                    <Spin />
                    :
                    <TopicList data={topicList} inline={inline} forIndex={true} columns={columns} noAction={true} history={history}/>
                }
                
                <Button onClick={this._loadMoreTopics.bind(this)}>加载更多话题</Button>

            </div>
                       
        )
    }
}


