import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal } from 'antd';

import PCDetailRate from './pc_detail_rate';
import ShareModal from '../../shareModal';
import TopicItemPopover from '../../topic_list/topic_item_popover';

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
            rateCaret:'caret-down',
            shareByCaret:'caret-down',

            collectLoaded:false,
            CollectContainer:null

        }
    }
    
    componentDidMount(){
        var { item } = this.props;
        
        
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

    handleCollectVisible(boolean){
        var { collectLoaded } = this.state;
        var { onCheckLogin } = this.props;
        if ( onCheckLogin()){
            if(!collectLoaded){
                import('../../collectComponent').then(CollectContainer=>{
                    this.setState({CollectContainer:CollectContainer.default, collectLoaded:true})
                })
            }
            this.setState({collectVisible:boolean})
        }  
    }

    handleChangeCaret(type,visible){
        if (type==='rateCaret'){
            if(visible){
                this.setState({rateCaret:'caret-left'})
            } else {
                this.setState({rateCaret:'caret-down'})
            }
        } else if (type === 'shareByCaret'){
            if(visible){
                this.setState({shareByCaret:'caret-left'})
            } else {
                this.setState({shareByCaret:'caret-down'})
            }
        }
        
    }

    render(){
        var { collectVisible, shareVisible, rateVisible, userCollect, shareBy, viewUsers, rateCaret, shareByCaret, CollectContainer } = this.state;
        var { uniquekey, item, history } = this.props;

        return (
            <div className="article-action-container">
                <div><Button type="primary" icon="star" size="small" onClick={this.handleCollectVisible.bind(this)}>收藏此文章</Button></div>
                <div>
                    <Button className="left" type="primary" icon="export" size="small" onClick={this.handleShareVisible.bind(this,true)}>分享至空间</Button>
                    <Popover autoAdjustOverflow={false} placement="bottom" onVisibleChange={this.handleChangeCaret.bind(this,'shareByCaret')} content={<TopicItemPopover data={shareBy} forShare={true} history={history} text="转发"/>}>
                        <Button className="right" type="primary" size="small"><span>{shareBy.length}人转发 <Icon type={shareByCaret} /></span></Button>
                    </Popover>
                </div>
                <div>
                    <Button className="left" type="primary" size="small" icon="smile" onClick={this.handleRateVisible.bind(this)}>看完此文章</Button>
                    <span className="line"></span>
                    <Popover autoAdjustOverflow={false} placement="bottom" onVisibleChange={this.handleChangeCaret.bind(this,'rateCaret')} content={<TopicItemPopover data={viewUsers} history={history} text="发布" forRate={true}/>}>
                        <Button type="primary" size="small" icon={rateCaret} className="right"></Button>
                    </Popover>
                </div>   
                
                <Modal visible={collectVisible} footer={null} onCancel={this.handleCollectVisible.bind(this,false)} maskClosable={true}>
                    { 
                        CollectContainer
                        ?
                        <CollectContainer data={userCollect} uniquekey={uniquekey} isSelf={true}/>
                        :
                        null
                    }
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
