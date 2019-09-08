import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal } from 'antd';

import PCNewsImageBlock from '../pc_news_image_block';
import PCDetailRate from './pc_detail_rate';
import CollectContainer from './pc_collect';
import ShareModal from '../common_comments/comment_share_modal';

export default class ArticleAction extends React.Component {
    constructor(props){
        super()
        this.state={   
            collectVisible:false,
            shareVisible:false,
            userCollect:[],
            text:''

        }
    }
    
    componentDidMount(){
        fetch(`/collect/getUserCollect?userid=${localStorage.getItem('userid')}&uniquekey=${this.props.uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data= json.data;
                this.setState({userCollect:data})
            })
    }
    
    
    handleShareVisible(boolean){
        this.setState({shareVisible:boolean})
    }

    handleModalVisible(boolean){
        this.setState({collectVisible:boolean})
    }

    render(){
        var { collectVisible, shareVisible, userCollect, text, translateData } = this.state;
        var { uniquekey, item } = this.props;

        return (
            <div className="article-action-container">
                <Button type="primary" icon="star" size="small" onClick={this.handleModalVisible.bind(this,true)}>收藏此文章</Button>
                <Button type="primary" icon="export" size="small" onClick={this.handleShareVisible.bind(this,true)}>分享至空间</Button>
                <Popover content={<PCDetailRate uniquekey={uniquekey}/>} trigger="hover">
                    <Button type="primary" size="small" icon="smile">看完此文章</Button>
                    
                </Popover>
                <Modal className="collect-container" visible={collectVisible} footer={null} onCancel={this.handleModalVisible.bind(this,false)} maskClosable={true}>
                    <CollectContainer data={userCollect} uniquekey={uniquekey}/>
                </Modal>
                <ShareModal 
                    visible={shareVisible} 
                    toId={uniquekey}         
                    onVisible={this.handleShareVisible.bind(this)} 
                    shareType="news"
                    item={item}
                />
                   
            </div>
        )
        

        
    }
}
