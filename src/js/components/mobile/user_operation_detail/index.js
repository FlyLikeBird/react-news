import React from 'react';
import { Icon, Badge, Progress, Popover, Steps } from 'antd';

import style from './usercenter_detail_style.css';

export default class UserOperationDetail extends React.Component {
    constructor(){
        super();
        this.state = {
            props:{},
            Component:function(){return null}
        }
    }

    _loadComponent(props){
        var { location, history, socket, onCheckLogin } = props;
        var params = location && location.state;
        var { type, currentUser, isSelf } = params;
        switch(type){
            case 'action':
                import('../../update_list/update_list').then(component=>{
                    var props = { isSelf, history, onCheckLogin, user:currentUser};
                    this.setState({Component:component.default,props});
                });
                break;
            case 'follow':
                import('./mobile_follow').then(component=>{
                    var props = {currentUser, isSelf, text:'follow', history, socket};
                    this.setState({Component:component.default,props});
                });
                break;
            case 'fans':
                import('./mobile_follow').then(component=>{
                    var props = {currentUser, isSelf, text:'fans', history, socket};
                    this.setState({Component:component.default,props});
                });
                break;
            case 'collect':
                import('../../collectComponent').then(component=>{
                    var props = { history, forUser:true, user:currentUser, isSelf, forMobile:true};
                    this.setState({Component:component.default,props});
                });
                break;
            case 'topic':
                import('./mobile_topic').then(component=>{
                    var props = { history, isSelf, user:currentUser };
                    this.setState({Component:component.default,props});
                });
                break;
            case 'comment':
                import('./mobile_comments').then(component=>{
                    var props = { history, forUser:true, user:currentUser, isSelf};
                    this.setState({Component:component.default,props});
                });
                break;
            case 'history':
                import('./mobile_history').then(component=>{
                    var props = { history, text:"暂时没有浏览任何文章", hastime:true, hasImg:true, location, user:currentUser };
                    this.setState({Component:component.default,props});
                });
                break;
        }     
    }

    componentDidMount(){
        this._loadComponent(this.props);
    }

    handleGoBack(){
        var { history } = this.props;
        if (history) history.goBack();
    }

    render(){
        var { location } = this.props;
        var { Component, props } = this.state;
        var params = location && location.state;
        var { type, text } = params;
        return (
                   
                <div className={style['container']}> 
                    <div className={style['header']}>
                        <span onClick={this.handleGoBack.bind(this)}><Icon type="left" />{ text }</span>
                    </div>
                    <div className={style['content']}>                                      
                        <Component {...props}/>
                    </div>
                </div>
            
        )
    }
}





