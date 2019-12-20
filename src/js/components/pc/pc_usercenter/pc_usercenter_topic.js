import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Button } from 'antd';
import TopicList from '../../topic_list/topic_list';
import DeleteModal from '../../deleteModal';
import TopicForm from '../../topic_form';
const TabPane = Tabs.TabPane;

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
            isLoading:true,
            showForm:false
        }
    }

    componentDidMount(){
        var { user } = this.props;
        var promise1 = new Promise((resolve, reject)=>{
            fetch(`/api/topic/getUserTopic?userid=${user}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    resolve(data);
                })
        });
        var promise2 = new Promise((resolve, reject)=>{
            fetch(`/api/topic/getUserFollowTopic?userid=${user}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    resolve(data);
                })
        });
        Promise.all([promise1, promise2])
            .then(([topicList, followTopic])=>{
                this.setState({topicList, followTopic, isLoading:false});
            })
    }
    
    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleEditVisible(boolean,item,_onEditTopicItem){
        this._onEditTopicItem = _onEditTopicItem;
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
        data.splice(deleteIndex,1);
        this.setState({topicList:data})
    }

    handleUpdateList(data){
        this.setState({topicList:data})
    }

    handleFormShow(){
        var { showForm } = this.state;
        this.setState({showForm:!showForm});
    }

    componentWillUnmount(){
        this._onEditTopicItem = null;
    }
    
    render(){
        var { history, isSelf } = this.props;
        var { topicList, followTopic, deleteId, visible, editVisible, editItem, isLoading, showForm } = this.state;

        return(
                    <div style={{textAlign:'left'}}>
                        {
                            isSelf
                            ?
                            <div>
                                <Button type="primary" style={{fontSize:'12px'}} onClick={this.handleFormShow.bind(this)}>创建话题</Button>                               
                                <TopicForm visible={showForm} onVisible={this.handleFormShow.bind(this)} onUpdate={this.handleUpdateList.bind(this)}/>                                                         
                            </div>
                            :
                            null
                        }
                        
                        {
                            isLoading
                            ?
                            <Spin/>
                            :
                            <Tabs defaultActiveKey="0" >                                
                                <TabPane tab={ isSelf ? "我创建的话题":"TA创建的话题"} key="0">                                    
                                        <TopicList 
                                            data={topicList} 
                                            forUser={true}
                                            isSelf={isSelf} 
                                            onVisible={this.handleModalVisible.bind(this)}
                                            onEditVisible={this.handleEditVisible.bind(this)} 
                                            text="还没有创建过话题" 
                                            history={history}
                                        />                                    
                                </TabPane>                                
                                <TabPane tab={ isSelf ? "我关注的话题":"TA关注的话题"} key="1">
                                    <TopicList data={followTopic} text="还没有关注任何话题" history={history} forUser={true} isSelf={false}/>
                                </TabPane>                               
                            </Tabs>
                        }
                        
                        <Modal visible={editVisible} footer={null} onCancel={()=>this.handleEditVisible(false,{})} destroyOnClose={true}>
                            <TopicForm visible={editVisible} forEdit={true} item={editItem} onCloseModal={this.handleEditVisible.bind(this)} onEditTopicItem={this._onEditTopicItem}/>
                        </Modal>
                        <DeleteModal 
                            visible={visible} 
                            onVisible={this.handleModalVisible.bind(this)} 
                            deleteId={deleteId} 
                            onDelete={this.handleDelete.bind(this)}
                            deleteType="Topic"
                        />
                    </div>
                       
        )
    }
}


