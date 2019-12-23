import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Popover, Tooltip, Radio, Button } from 'antd';
import TopicList from '../../topic_list/topic_list';

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
            isLoading:true,
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
                        var obj = {};
                        obj.content = {};
                        obj['tag'] = '全部',obj['content'].length = topicList.length;
                        tags.unshift(obj);
                        this.setState({topicList,tags, isLoading:false});
                        
                    })                
            })


    }
    
    _loadMoreTopics(){
        var { topicList } = this.state;
        var arr = [...topicList];
        if (topicList.length<20) return;
        for(var i=0;i<20;i++){
            arr.push(topicList[Math.floor(Math.random()*20)])
        }
        this.setState({topicList:arr})
    }

    handleChangeShowMode(e){
        var value = e.target.value;
        console.log(value);
        if (value=='4'){
            this.setState({columns:4,inline:true})
        } else if (value=='1'){
            this.setState({columns:1, inline:false})
        } else {
            this.setState({columns:2, inline:true})
        }
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
    /*
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
    */
    render(){
        var { topicList, tags, inline, columns, isLoading } = this.state;
        var { history, onCheckLogin } = this.props;
        
        const content = <div>
                            <h3>什么是话题？</h3>
                            <p>话题是由用户发起的就某一主题展开讨论/交流时事热点/分享个人心得的公共空间。</p>
                            <h3>发起话题有什么好处？</h3>
                            <p>作为发起人，你的头像会一直展示在话题页，可能获得更多用户的关注和粉丝数。</p>
                            <h3>如何创建高质量的话题？</h3>
                                <div>
                                    <h4>(1).为避免话题被重复创建，请先查看是否已存在相似话题</h4>
                                    <p>在话题名称输入框内输入关键词即可得出相关话题结果。如话题已经存在，可直接在该话题下参与讨论。</p>
                                </div>
                                <div>
                                    <h4>(2).话题需要一个明确/具体/集中的讨论点</h4>
                                    <p>错误示范：“我最喜欢的作家”“我最喜欢的一部电影”</p>
                                    <p>正确示范：“跟着电影去旅行”“我的港乐情怀”</p>
                                    
                                </div>
                                <div>
                                    <h4>(3).避免发起仅解决个人问题的求助类话题</h4>
                                    <p>错误示范:“22岁的我因为学业问题与父母产生分歧，我该怎么办？”</p>
                                    <p>正确示范:"你是如何与父母沟通的？"</p>
                                </div>
                                <div>
                                    <h4>(4).避免“一句话总结／概括／说明....“这类不利于引发深刻讨论的句型</h4>
                                    <p>错误示范:“一句话证明你看过《红楼梦》“</p>
                                    <p>正确示范:"红楼梦有哪些令你印象深刻的章节"</p>
                                </div>

                        </div>
        return(

            <div>   
                <div>
                    <h2 style={{display:'inline-block',marginRight:'6px'}}>话题中心</h2>
                    <Popover  content={content}>
                        <Icon type="question-circle"/>
                    </Popover>
                </div>            
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
                {/*
                <div className="mode-button" ref={button=>this.buttonContainer=button} style={{padding:'10px 0'}}>
                    <Tooltip title="瀑布模式"><Button size="small" className="current" onClick={this.handleChangeShowMode.bind(this,true,4)}><Icon type="appstore" /></Button></Tooltip>
                    <Tooltip title="卡片模式"><Button size="small" onClick={this.handleChangeShowMode.bind(this,false,1)}><Icon type="unordered-list" /></Button></Tooltip>
                    <Tooltip title="两列模式"><Button size="small" onClick={this.handleChangeShowMode.bind(this,true,2)}><Icon type="column-width" /></Button></Tooltip>
                </div>
                */}
                <div style={{padding:'10px 0'}}>
                    <Radio.Group onChange={this.handleChangeShowMode.bind(this)} defaultValue="4" size="small">
                        <Radio.Button value="4"><Tooltip title="瀑布模式"><Icon type="appstore" /></Tooltip></Radio.Button>
                        <Radio.Button value="1"><Tooltip title="卡片模式"><Icon type="unordered-list" /></Tooltip></Radio.Button>
                        <Radio.Button value="2"><Tooltip title="两列模式"><Icon type="column-width" /></Tooltip></Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{textAlign:'center'}}>
                    {
                        isLoading
                        ?
                        <Spin size="large"/>
                        :
                        <TopicList data={topicList} inline={inline} forIndex={true} columns={columns} onCheckLogin={onCheckLogin} history={history} text="还没有用户发布过话题~"/>
                    }
                    <Button onClick={this._loadMoreTopics.bind(this)}>加载更多话题</Button>
                </div>
                

            </div>
                       
        )
    }
}


