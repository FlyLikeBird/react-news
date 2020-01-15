import React from 'react';
import ScrollContainer from '../mobile_scroll_container';
import { Icon, Popover, Button, Radio, Spin, Tabs, Modal, Drawer } from 'antd';
import TopicForm from '../../topic_form';
import TopicList from '../../topic_list/topic_list';
import MobileTopicDrawer from './mobile_topic_drawer';
const TabPane = Tabs.TabPane;
export default class MobileTopicIndex extends React.Component {
    constructor(){
        super();
        this.state={
            allTopics:[],
            addTopics:[],
            myTopics:[],
            followTopics:[],
            currentTag:'全部',
            radioValue:1,
            inline:true,
            columns:2,
            isLoading:true,
            formVisible:false,
            drawerVisible:false,
            buttonVisible:true,
            autoLoad:false,
            canScroll:true,
            scrollFunc:null
        }
    }

    componentDidMount(){  
        fetch(`/api/topic/getAllTopics`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({allTopics:data, addTopics:data, scrollFunc:this._loadMoreTopics.bind(this), isLoading:false});
            })           
    }
    
    _loadMoreTopics(){
        var { allTopics, addTopics } = this.state;
        this.setState({autoLoad:true, canScroll:false});
        setTimeout(()=>{
            var arr = allTopics.concat(addTopics);
            this.setState({allTopics:arr,autoLoad:false});
        },500);
        setTimeout(()=>{
            this.setState({canScroll:true});
        },2000)       
    }

    handleChangeTab(activeKey){
        var { onCheckLogin } = this.props;
        var userid = onCheckLogin();
        if (userid){
            if (activeKey=='my-topic'){
                fetch(`/api/topic/getUserTopic?userid=${userid}`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        this.setState({myTopics:data, buttonVisible:false, scrollFunc:null});
                    })
            } else if (activeKey=='follow-topic'){
                fetch(`/api/topic/getUserFollowTopic?userid=${userid}`)
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        this.setState({followTopics:data, buttonVisible:false, scrollFunc:null});
                    })
            } else {
                this.setState({buttonVisible:true, scrollFunc:this._loadMoreTopics.bind(this)});
            }
        }
        
    }
    
    handleChangeShowMode(e){
        var { onUpdateLayout } = this.props;
        var value = e.target.value;
        if (value=='1'){
            this.setState({radioValue:value, columns:2,inline:true});
        } else if (value=='2'){
            this.setState({radioValue:value, columns:1,inline:false});
        } 
    }
    
    handleDrawerVisible(boolean){
        this.setState({drawerVisible:boolean});
    }

    handleFormVisible(boolean){
        this.setState({formVisible:boolean});
    }

    updateTopicList(data){
        this.setState({allTopics:data});
    }

    render(){
        var { history, onCheckLogin } = this.props;
        var { isLoading, allTopics, myTopics, followTopics, currentTag, radioValue, inline, columns, formVisible, drawerVisible, buttonVisible, autoLoad, canScroll, scrollFunc } = this.state;
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

                        </div>;
        return (
            <ScrollContainer onScrollToBottom={scrollFunc} autoLoad={autoLoad} canScroll={canScroll}> 
                <div style={{display:'flex',alignItems:'center',padding:'10px'}}>
                    <h2 style={{display:'inline-block',margin:'0',marginRight:'6px'}}>话题中心</h2>
                    <Popover  content={content}>
                        <Icon type="question-circle"/>
                    </Popover>
                    <span style={{margin:'0'}} className="topic-tag">{currentTag}</span>
                </div>
                <div style={{textAlign:'center'}}>
                    <div className="view-button-container" style={{textAlign:'left',padding:'0 10px'}}>
                        <Radio.Group onChange={this.handleChangeShowMode.bind(this)} value={radioValue} size="small">
                            <Radio.Button value="1"><Icon type="column-width" /></Radio.Button>
                            <Radio.Button value="2"><Icon type="ordered-list" /></Radio.Button>                                
                        </Radio.Group>
                    </div>
                {
                    isLoading
                    ?
                    <Spin/>
                    :
                    <div>
                        <Tabs defaultActiveKey="all-topic" onChange={this.handleChangeTab.bind(this)}>
                            <TabPane tab="话题广场" key="all-topic">
                                <TopicList data={allTopics} inline={inline} forIndex={true} columns={columns} onCheckLogin={onCheckLogin} history={history} text="还没有用户发布过话题~"/> 
                            </TabPane> 
                            <TabPane tab="我创建的话题" key="my-topic">
                                <TopicList data={allTopics} inline={inline} forIndex={true} columns={columns} onCheckLogin={onCheckLogin} history={history} text="还没有用户发布过话题~"/>
                            </TabPane> 
                            <TabPane tab="我关注的话题" key="follow-topic">
                                <div>followedtopics</div>
                            </TabPane>  
                        </Tabs>
                        
                        <MobileTopicDrawer visible={drawerVisible} data={allTopics} onUpdateData={this.updateTopicList.bind(this)} onVisible={this.handleDrawerVisible.bind(this)} />
                            
                        {
                            buttonVisible
                            ?
                            <div onClick={this.handleDrawerVisible.bind(this,true)} className="sort-button-container">
                                <Icon type="unordered-list" />
                            </div>
                            :
                            null
                        }  
                        <div onClick={this.handleFormVisible.bind(this)} className="topic-form-container">
                            <Icon type="plus" />
                        </div>
                        {
                            formVisible
                            ?
                            <Modal visible={formVisible} footer={null} onCancel={this.handleFormVisible.bind(this,false)} destroyOnClose={true}>
                                <TopicForm visible={formVisible} onVisible={this.handleFormVisible.bind(this)} onUpdate={this.updateTopicList.bind(this)} forTopic={true}/>
                            </Modal>
                            :
                            null
                        }
                    </div>
                }
                </div>          
            </ScrollContainer>    
            
            
        )
    }
}






