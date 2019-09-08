import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Button } from 'antd';
import TopicForm from './pc_topic_form';
import TopicList from './pc_topic_list';
import DeleteModal from '../pc_usercenter/pc_usercenter_delete_modal';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const TabPane = Tabs.TabPane;

const { Meta } = Card;


export default class PCUsercenterTopic extends React.Component{
    constructor(){
        super();
        this.state={
            topicList:[],
            followTopic:[],
            editVisible:false,
            deleteId:'',
            visible:false,
            editItem:{},
            showForm:false
        }
    }

    componentDidMount(){
        fetch(`/topic/getUserTopic?userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({topicList:data})
            })
        fetch(`/topic/getUserFollowTopic?userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({followTopic:data})
            })
    }
    
    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleEditVisible(boolean,item){
        this.setState({editVisible:boolean,editItem:item})
    }

    handleDelete(){
        var { deleteId, topicList } = this.state;
        var data = [...topicList];
        var deleteIndex = 0;
        for(var i=0,len=topicList.length;i<len;i++){
            if(topicList[i]._id === deleteId){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({topicList:data})
    }

    handleUpdateList(data){
        this.setState({topicList:data})
    }

    handleFormShow(boolean){
        this.setState({showForm:boolean})
    }

    render(){
        var { history } = this.props;
        var { topicList, followTopic, deleteId, visible, editVisible, editItem, showForm } = this.state;

        return(
                    <div style={{paddingLeft:'10px',textAlign:'left'}}>
                        <div>
                            <Button type="primary" style={{margin:'20px 0'}} onClick={()=>this.setState({showForm:!showForm})}>创建话题</Button>
                            <TopicForm visible={showForm} onVisible={this.handleFormShow.bind(this)} onUpdate={this.handleUpdateList.bind(this)}/>
                        </div>
                        
                        <Tabs defaultActiveKey="0" >                                
                                <TabPane tab="创建的话题" key="0">                                    
                                    <TopicList 
                                        data={topicList} 
                                        forUser={true} 
                                        onVisible={this.handleModalVisible.bind(this)}
                                        onEditVisible={this.handleEditVisible.bind(this)} 
                                        text="还没有创建过话题" 
                                        history={history}
                                    />
                                </TabPane>
                                
                                <TabPane tab="关注的话题" key="1">
                                    <TopicList data={followTopic} text="还没有关注任何话题" history={history}/>
                                </TabPane>
                               
                        </Tabs>
                        <Modal visible={editVisible} footer={null} onCancel={()=>this.handleEditVisible(false,{})} destroyOnClose={true}>
                            <TopicForm visible={editVisible} forEdit={true} item={editItem}/>
                        </Modal>
                        <DeleteModal 
                            visible={visible} 
                            onVisible={this.handleModalVisible.bind(this)} 
                            deleteId={deleteId} 
                            onDelete={this.handleDelete.bind(this)}
                            deleteType="topic"
    
                        />
                    </div>
                       
        )
    }
}


