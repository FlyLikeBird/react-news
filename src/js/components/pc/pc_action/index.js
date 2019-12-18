import React from 'react';
import {  Row, Col, Spin  } from 'antd';

import UpdateItem from '../../update_list/update_list_item';
import CommentsListContainer from '../../common_comments/comments_list_container';
import ShareModal from '../../shareModal';
import Sidebar from '../../side_bar';

export default class PCActionContainer extends React.Component{
    constructor(){
        super();
        this.state = {
            data:{}, 
            actionInfo:{},         
            shareVisible:false,
            isLoading:true
        }
    }

    _loadActionData(props){
        var uniquekey = props.match.params.id;       
        fetch(`/api/action/getActionContent?contentId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({ data:data && data[0],isLoading:false});
            })
    }

    componentDidMount(){
        this._loadActionData(this.props);        
    }

    handleShareVisible(boolean,option, _updateShareby){
        this._updateShareby = _updateShareby;
        this.setState({shareVisible:boolean,actionInfo:option})
    }

    componentWillUnmount(){
        this._updateShareby = null;
    }

    componentWillReceiveProps(newProps){
        if(this.props.match.params.id != newProps.match.params.id){
            this.setState({isLoading:true});
            this._loadActionData(newProps);
        }
    }

    _updateItem(data){
        this.setState({data});
    }

    render(){
        var uniquekey = this.props.match.params.id;       
        var { history, location, socket, onCheckLogin, onSetScrollTop } = this.props;
        var { isLoading, data, actionInfo, shareVisible } = this.state;
       
        return(
            
            <div>               
                <Row style={{paddingTop:'30px'}}>
                    <Col span={2}></Col>                   
                    <Col span={5}><Sidebar/></Col>
                    <Col span={15}>
                        <div style={{paddingLeft:'50px',textAlign:'left'}}>
                            {
                                isLoading
                                ?
                                <Spin />
                                :
                                <div>
                                    <UpdateItem                               
                                        data={data} 
                                        history={history} 
                                        forSimple={true}
                                        forDetail={true}
                                        socket={socket}
                                        onCheckLogin={onCheckLogin} 
                                        onShareVisible={this.handleShareVisible.bind(this)}
                                    />
                                    <div style={{margin:'20px 0'}}>
                                        <CommentsListContainer 
                                            history={history}
                                            location={location}
                                            socket={socket}
                                            onCheckLogin={onCheckLogin} 
                                            uniquekey={uniquekey} 
                                            onSetScrollTop={onSetScrollTop}
                                            onUpdateItemComments = {this._updateItem.bind(this)} 
                                            commentType="Action" 
                                            warnMsg="还没有人发表过看法呢!请分享您的想法吧" 
                                        />
                                    </div>
                                </div>
                            }
                            
                            {
                                shareVisible
                                ?
                                <ShareModal 
                                    visible={shareVisible} 
                                    actionInfo={actionInfo}                                   
                                    history={history}    
                                    onVisible={this.handleShareVisible.bind(this)} 
                                    onUpdateShareBy={this._updateShareby}
                                    forUserAction={true}
                                    
                                />
                                :
                                null
                            }
                        </div>
                    </Col>                                                 
                    <Col span={2}></Col>
                </Row>                  
            </div>
        )
    }
    
}



