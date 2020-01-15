import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Spin, Form, message, Select, Tabs } from 'antd';
import DeleteModal from '../deleteModal';
import CollectItem from './collect_item';
import CollectForm from './collect_form';

import ShareModal from '../ShareModal';

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
            visible:false,
            shareVisible:false,
            collectItem:{},
            isLoading:true
        }
    }
    
    _checkIsCollected(data){
        var { uniquekey } = this.props;
        var userid = localStorage.getItem('userid');
        var arr = data.map(item=>{
                    var contentIds = item.collectItem.map(item=>item.contentId._id);
                    var follows = item.followedBy.map(item=>item.user._id);
                    item['isCollected'] = contentIds.includes(uniquekey) ? true : false;
                    item['collectedByUser'] = follows.includes(userid) ? true : false;                    
                    return item;
                });
        return arr;
    }

    componentDidMount(){
        var { uniquekey, user } = this.props;
        var promise1 = new Promise((resolve, reject)=>{
            fetch(`/api/collect/getUserCollect?userid=${user}`)
            .then(response=>response.json())
            .then(json=>{
                var data= json.data;
                data = this._checkIsCollected(data);
                resolve(data);
            });
        });
        var promise2 = new Promise((resolve, reject)=>{
            fetch(`/api/collect/getFollowedCollect?userid=${user}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    data = this._checkIsCollected(data);
                    resolve(data);
                })
        });
        Promise.all([promise1, promise2])
            .then(([userCollect, followedCollect])=>{
                this.setState({userCollect, followedCollect, isLoading:false});
            })
        
    }

    handleCollectShow(){
        this.setState({show:!this.state.show})
    }

    handleUpdateUserCollect(data){
        this.setState({userCollect:data})
    }

    handleModalVisible(boolean,deleteId){
        this.setState({visible:boolean,deleteId})
    }

    handleShareVisible(boolean, collectItem, updateItem){
        this._updateItem = updateItem;
        this.setState({shareVisible:boolean, collectItem});
    }

    handleDelete(){
        var { deleteId, userCollect } = this.state;
        var data = [...userCollect], deleteIndex = 0;
        for(var i=0,len=data.length;i<len;i++){
            if (data[i]._id === deleteId){
                deleteIndex = i;
            }
        }
        data.splice(deleteIndex,1);
        this.setState({userCollect:data});
    }
    
    componentWillUnmount(){
        this._updateItem = null;
    }

    render(){
        var { show, isLoading, userCollect, followedCollect, value, visible, shareVisible, collectItem, deleteId } = this.state;
        var { isSelf, uniquekey, onModel, history, forUser, forMobile } = this.props;
        
        return(
            
            <div style={{position:'relative',textAlign:'left',minHeight:'200px'}}>
                {
                    isSelf
                    ?
                    <Button type="primary" style={{fontSize:'12px'}} onClick={this.handleCollectShow.bind(this)}>创建收藏夹</Button>
                    :
                    null
                }
                
                <div style={{display:show?'block':'none'}}>
                    <CollectForm onShowForm={this.handleCollectShow.bind(this)} onUpdate={this.handleUpdateUserCollect.bind(this)}/>
                </div>
                {
                    isLoading
                    ?
                    <Spin className="spin" size="large"/>
                    :
                    <Tabs defaultActiveKey="0">
                        <TabPane tab={isSelf ? "我创建的":"TA创建的"} key="0">
                            {
                                userCollect.length
                                ?
                                userCollect.map((item,index)=>(
                                    <CollectItem 
                                        data={item}
                                        key={index}
                                        forUser={forUser}
                                        forMobile={forMobile}
                                        isSelf={isSelf}
                                        history={history}
                                        uniquekey={uniquekey}
                                        onModel={onModel}
                                        onVisible={this.handleModalVisible.bind(this)}
                                        onShareVisible={this.handleShareVisible.bind(this)}
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
                                            forMobile={forMobile}
                                            key={index}
                                            history={history}
                                            isSelf={false}
                                            uniquekey={uniquekey}
                                            onModel={onModel}                                             
                                            onVisible={this.handleModalVisible.bind(this)}
                                            onShareVisible={this.handleShareVisible.bind(this)}                                           
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
                }
                 
                {
                    forUser
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="Collect"
                    />
                    :
                    null
                }  
                {
                    shareVisible
                    ?
                    <ShareModal 
                        visible={shareVisible} 
                        item={collectItem}
                        onModel="Collect"
                        uniquekey={collectItem._id}    
                        onVisible={this.handleShareVisible.bind(this)} 
                        onUpdateShareBy={this._updateItem}
                        isSelf={isSelf}
                    />
                    :
                    null
                }            
            </div>   
            
                    
                    

        )
    }
}

