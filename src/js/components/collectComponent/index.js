import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Form, Select, Tabs } from 'antd';
import DeleteModal from '../deleteModal';
import CollectItem from './pc_collect_item';

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
            createCollect:[],
            addCollect:[],
            text:'',
            value:'',
            privacy:0,
            error:false,
            show:false,
            visible:false
        }
    }
    
    componentDidMount(){

        var { data } = this.props;
        this.setState({createCollect:data})
    }

    handleCollectShow(){
        this.setState({show:!this.state.show})
    }

    cancel(){     
        this.setState({show:false,value:'',text:''})
    }

    checkName(e){
        var value = e.target.value;
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
            regSpace = /\s+/;

        if ( regEn.test(value) || regCn.test(value) || regSpace.test(value)) {
            this.setState({value,text:'收藏夹名称请不要包含特殊格式字符!',error:true});

        } else {
            this.setState({value,text:'',error:false})
        }
    }

    createCollect(){
        
        var { value, error, privacy } = this.state
        if ( error){
            console.log('error');
            return ;
        } else {
            if ( !value ) {
                this.setState({error:true,text:'收藏夹名称不能为空!'})
            } else {
                fetch(`/collect/createCollect?userid=${localStorage.getItem('userid')}&tag=${value}&privacy=${privacy}`)
                .then(response=>response.json())
                .then(json=>{
                    var responCode = json.code;
                    if (responCode===0){
                        this.setState({text:json.message})
                    } else {
                        var data = json.data;
                        this.setState({createCollect:data});
                        this.cancel();
                    }
                })
            }
            
        }
    }

    handleSelect(value){
        this.setState({privacy:value})
    }

    handleUpdateCollection(data){
        this.setState({createCollect:data})
    }

    handleShowMsg(msg){
        this.setState({text:msg});
        setTimeout(()=>{
            this.setState({text:''})
        },2000)
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

    render(){
        var { show, text, createCollect, addCollect, value, visible, deleteId } = this.state;
        var { isSelf, uniquekey, forUser } = this.props;
        
        return(
            
            <div style={{position:'relative',textAlign:'left'}}>
                <Button type="primary" onClick={this.handleCollectShow.bind(this)}>创建收藏夹</Button>
                <div style={{display:show?'block':'none'}}>
                    
                    <Form layout="inline">
                        <Form.Item>
                            <Input size="small" value={value} onChange={this.checkName.bind(this)} allowClear placeholder="请输入收藏夹名称"/>
                        </Form.Item>
                        <Form.Item>
                            <Select size="small" defaultValue={0} onSelect={this.handleSelect.bind(this)} dropdownMatchSelectWidth={false}>
                                <Option value={0}>公开的</Option>
                                <Option value={1}>仅对关注的人可见</Option>
                                <Option value={2}>私密的仅自己可见</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size="small" style={{marginRight:'4px'}} onClick={this.createCollect.bind(this)}>确定</Button>
                            <Button size="small" onClick={this.cancel.bind(this)}>取消</Button>
                        </Form.Item>
                        
                    </Form>
                </div>
                <span style={{fontSize:'12px',color:'#f5222d',position:'absolute',left:'110px',top:'10px'}}>{text}</span>
                <Tabs defaultActiveKey="0">
                    <TabPane tab="我创建的" key="0">
                        <CollectItem  
                            data={createCollect} 
                            forUser={forUser} 
                            uniquekey={uniquekey} 
                            onAddCollect={this.handleUpdateCollection.bind(this)} 
                            onShowMsg={this.handleShowMsg.bind(this)}
                            onVisible={this.handleModalVisible.bind(this)}
                            text="还没有创建收藏夹"
                        />
                    </TabPane>
                    {
                        forUser
                        ?
                        <TabPane tab="我收藏的" key="1">
                            <CollectItem  
                                data={addCollect} 
                                forUser={forUser} 
                                uniquekey={uniquekey} 
                                onAddCollect={this.handleUpdateCollection.bind(this)} 
                                onShowMsg={this.handleShowMsg.bind(this)}
                                onVisible={this.handleModalVisible.bind(this)}
                                text="还没有收藏他人的收藏夹"
                            />
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

