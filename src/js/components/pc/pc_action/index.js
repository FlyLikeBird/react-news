import React from 'react';
import {  Row, Col, Spin  } from 'antd';

import UpdateItem from '../pc_usercenter/pc_usercenter_update_item';
import CommentsListContainer from '../../common_comments/comments_list_container';

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

    componentDidMount(){
        var uniquekey = this.props.match.params.id;       
        fetch(`/api/action/getActionContent?actionId=${uniquekey}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({data,isLoading:false});
            })
        
    }

    handleShareVisible(boolean,option){
        this.setState({shareVisible:boolean,actionInfo:option})
    }

    render(){
        var uniquekey = this.props.match.params.id;
        
        var { history, location, socket, onSetScrollTop } = this.props;
        var { isLoading, data, actionInfo, shareVisible } = this.state;
       
        return(
            
            <div>               
                <Row style={{paddingTop:'30px'}}>
                    <Col span={2}></Col>                   
                    <Col span={4}>
                    </Col>
                    <Col span={16}>
                        <div>
                            {
                                isLoading
                                ?
                                <Spin />
                                :
                                <UpdateItem                               
                                    data={data} 
                                    history={history} 
                                    forDetail={true}
                                    socket={socket} 
                                    onShareVisible={this.handleShareVisible.bind(this)}
                                />
                            }
                            {
                                shareVisible
                                ?
                                <ShareModal 
                                    visible={shareVisible} 
                                    actionInfo={actionInfo}                                   
                                    history={history}    
                                    onVisible={this.handleShareVisible.bind(this)} 
                                    onUpdate={this.handleUpdateAction.bind(this)}
                                    forUserAction={true}
                                    isSelf={isSelf}
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



