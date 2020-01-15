import React from 'react';
import { Menu, Spin, Tabs, Input, Button, Icon, Modal } from 'antd';
import CollectContainer from '../../collectComponent';
import DetailRate from '../../pc/pc_detail/detail_rate';
import style from './mobile_comment_style.css';
export default class ArticleComment extends React.Component {
    
    constructor(){
        super();
        this.state = {
            collectVisible:false,
            shareVisible:false,
            rateVisible:false
        }
    }

    handleCollectVisible(boolean){
        var { user , onCheckLogin } = this.props;
        var userid = onCheckLogin();
        if (userid){
            this.setState({collectVisible:boolean});
        }   
    }

    handleRateVisible(boolean){
        var { onCheckLogin } = this.props;
        var userid = onCheckLogin();
        if (userid){
            this.setState({rateVisible:boolean});
        }
    }

    render(){
        var { uniquekey, onVisible, user } = this.props;
        var { collectVisible, shareVisible, rateVisible } = this.state;
        return (

                <div className={style['button-container']}>
                    <Button onClick={this.handleCollectVisible.bind(this,true)} shape="circle"><Icon type="star" /></Button>
                    <Button onClick={this.handleRateVisible.bind(this,true)} shape="circle"><Icon type="smile" /></Button>
                    <Button onClick={()=>onVisible(true)} shape="circle"><Icon type="export" /></Button>
                    
                    {
                        collectVisible
                        ?
                        <Modal visible={collectVisible} footer={null} onCancel={this.handleCollectVisible.bind(this,false)} maskClosable={true}>                    
                            <CollectContainer uniquekey={uniquekey} isSelf={true} onModel="Article" user={user&&user.userid}/>                        
                        </Modal> 
                        :
                        null
                    }
                    {
                        rateVisible
                        ?
                        <Modal className="score-container" visible={rateVisible} footer={null} onCancel={this.handleRateVisible.bind(this,false)}>
                            <DetailRate uniquekey={uniquekey} onVisible={this.handleRateVisible.bind(this)} />
                        </Modal>
                        :
                        null
                    }
                </div>
                
               
                   
        )
    }
}






