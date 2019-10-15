import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal } from 'antd';

import PCNewsImageBlock from '../pc_news_image_block';
import PCDetailRate from './pc_detail_rate';
import CollectContainer from '../../collectComponent';
import ShareModal from '../../shareModal';
import TopicItemPopover from '../pc_topic/pc_topic_item_popover';

export default class ArticleAction extends React.Component {
    constructor(props){
        super()
        this.state={   
            collectVisible:false,
            shareVisible:false,
            rateVisible:false,
            userCollect:[],
            shareBy:[],
            viewUsers:[],

        }
    }
    
    componentDidMount(){
        var { item } = this.props;
        fetch(`/collect/getUserCollect?userid=${localStorage.getItem('userid')}&uniquekey=${this.props.uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data= json.data;
                this.setState({userCollect:data,shareBy:item.shareBy,viewUsers:item.viewUsers})
            });
        
    }
    
    updateShareBy(data){
        this.setState({shareBy:data});
    }
    
    updateViewUsers(data){
        this.setState({viewUsers:data})
    }

    handleShareVisible(boolean){
        this.setState({shareVisible:boolean})
    }

    handleRateVisible(){
        this.setState({rateVisible:!this.state.rateVisible})
    }

    handleModalVisible(boolean){
        this.setState({collectVisible:boolean})
    }

    render(){
        var { collectVisible, shareVisible, rateVisible, userCollect, shareBy, viewUsers } = this.state;
        var { uniquekey, item, history } = this.props;

        return (
            <div className="article-action-container">
                <Button type="primary" icon="star" size="small" onClick={this.handleModalVisible.bind(this,true)}>收藏此文章</Button>
                <Popover content={<TopicItemPopover data={shareBy} forShare={true} history={history} text="转发"/>}>
                    <Button type="primary" icon="export" size="small" onClick={this.handleShareVisible.bind(this,true)}>分享至空间 <span style={{transform:'scale(0.8)'}}>{shareBy.length}人转发</span></Button>
                </Popover>
                <Popover content={<TopicItemPopover data={viewUsers} history={history} text="发布" forRate={true}/>}> 
                    <Button type="primary" size="small" icon="smile" onClick={this.handleRateVisible.bind(this)}>看完此文章</Button>                  
                </Popover> 
                <Modal className="collect-container" visible={collectVisible} footer={null} onCancel={this.handleModalVisible.bind(this,false)} maskClosable={true}>
                    <CollectContainer data={userCollect} uniquekey={uniquekey}/>
                </Modal>
                <Modal className="score-container" visible={rateVisible} footer={null} onCancel={this.handleRateVisible.bind(this)}>
                    <PCDetailRate uniquekey={uniquekey} onVisible={this.handleRateVisible.bind(this)} onUpdateViewUsers={this.updateViewUsers.bind(this)}/>
                </Modal>
                <ShareModal 
                    visible={shareVisible}
                    contentType="news"
                    uniquekey={uniquekey}      
                    onVisible={this.handleShareVisible.bind(this)} 
                    onUpdateShareBy={this.updateShareBy.bind(this)}
                    actionInfo={{
                        contentType:'news'

                    }}
                />

                   
            </div>
        )
        

        
    }
}
