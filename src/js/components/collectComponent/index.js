import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Form, message, Select, Tabs } from 'antd';
import DeleteModal from '../deleteModal';
import CollectItem from './collect_item';
import CollectForm from './collect_form';

const TabPane = Tabs.TabPane;
const { Option } = Select;

var privacy = {
    '0':'公开的',
    '1':'仅对关注的人可见',
    '2':'私密的仅自己可见'
}

export default class CollectContainer extends React.Component {
    constructor(props){
        super()
        this.state={
            userCollect:[],
            followedCollect:[],
            show:false,
            visible:false
        }
    }
    
    componentDidMount(){
        var { uniquekey } = this.props;
        fetch(`/api/collect/getUserCollect?userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                var data= json.data;
                data = data.map(item=>{
                    var contentIds = item.content.map(item=>item._id);
                    if ( contentIds.includes(uniquekey)){
                        item['isCollected'] = true;
                    } else {
                        item['isCollected'] = false;
                    }
                    return item;
                })
                this.setState({userCollect:data})
            });
    }

    handleCollectShow(){
        this.setState({show:!this.state.show})
    }

    
    handleUpdateCollection(data){
        this.setState({createCollect:data})
    }

    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleDelete(){
        var { deleteId, createCollect } = this.state;
        var data = [...createCollect];
        var deleteIndex = 0;
        for(var i=0,len=createCollect.length;i<len;i++){
            if(createCollect[i].id === deleteId){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({createCollect:data})
    }

    handleChange(activeKey){
        var { match } = this.props;
        var userid = '';
        if( match && match.params.id ){
            userid = match.params.id;
        }
        if(activeKey==1){
            fetch(`/api/collect/getFollowedCollect?userid=${userid}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    var localUser = localStorage.getItem('userid');
                    data = data.map(item=>{
                        var follows = item.followedBy.map(item=>item.userid);
                        if (follows.includes(localUser)){
                            item['userCollected'] = true;
                        }
                        return item;
                    })
                    this.setState({followedCollect:data});
                })
        }
    }
    render(){
        var { show, text, userCollect, followedCollect, value, visible, deleteId } = this.state;
        var { isSelf, uniquekey, onModel, forUser } = this.props;
       
        return(
            
            <div style={{position:'relative',textAlign:'left'}}>
                {
                    isSelf
                    ?
                    <Button type="primary" style={{fontSize:'12px'}} onClick={this.handleCollectShow.bind(this)}>创建收藏夹</Button>
                    :
                    null
                }
                
                <div style={{display:show?'block':'none'}}>
                    <CollectForm onShowForm={this.handleCollectShow.bind(this)} onUpdate={this.handleUpdateCollection.bind(this)}/>
                </div>
                
                <Tabs defaultActiveKey="0" onChange={this.handleChange.bind(this)}>
                    <TabPane tab={isSelf ? "我创建的":"TA创建的"} key="0">
                        {
                            userCollect.length
                            ?
                            userCollect.map((item,index)=>(
                                <CollectItem 
                                    data={item}
                                    key={index}
                                    forUser={forUser}
                                    isSelf={isSelf}
                                    uniquekey={uniquekey}
                                    onModel={onModel}
                                    onAddCollect={this.handleUpdateCollection.bind(this)} 
                                    onVisible={this.handleModalVisible.bind(this)}
                                    
                                />
                            ))
                            :
                            <div>还没有创建收藏夹</div>
                        }
                    </TabPane>
                    
                    {
                        forUser
                        ?
                        <TabPane tab={isSelf?"我收藏的":"TA收藏的"} key="1">
                            {
                                followedCollect.length
                                ?
                                followedCollect.map((item,index)=>(
                                    <CollectItem  
                                        data={item} 
                                        forUser={forUser}
                                        forCollect={true} 
                                        key={index}
                                        isSelf={isSelf}
                                        uniquekey={uniquekey}
                                        onModel={onModel} 
                                        onAddCollect={this.handleUpdateCollection.bind(this)} 
                                        
                                        onVisible={this.handleModalVisible.bind(this)}
                                        
                                    />
                                ))
                                :
                                <span>还没有收藏他人的收藏夹</span>
                            }
                            
                        </TabPane>
                        :
                        null
                    }
                    
                </Tabs> 
                {
                    forUser
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="collect"
                        forNews={true}
                    />
                    :
                    null
                }              
            </div>   
            
                    
                    

        )
    }
}

