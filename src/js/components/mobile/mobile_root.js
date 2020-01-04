import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import { BrowserRouter as Router,  Route, Link, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Spin } from 'antd';

import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';

import MobileSearch from './mobile_search';

const MobileIndex = Loadable({
  loader:()=>import('./mobile_index'),
  loading:()=><Spin size="large" className="spin"/>
});
const MobileNewsDetail = Loadable({
    loader:()=>import('./mobile_news_detail'),
    loading:()=><Spin size="large" className="spin"/>
});
const MobileNewsIndex = Loadable({
    loader:()=>import('./mobile_news'),
    loading:()=><Spin size="large" className="spin"/>
});
const MobileTopicIndex = Loadable({
    loader:()=>import('./mobile_topic'),
    loading:()=><Spin size="large" className="spin"/>
});
const MobileMessage = Loadable({
    loader:()=>import('./mobile_message'),
    loading:()=><Spin size="large" className="spin"/>
});
const MobileUsercenter = Loadable({
    loader:()=>import('./mobile_usercenter'),
    loading:()=><Spin size="large" className="spin"/>
});
const UserOperationDetail = Loadable({
    loader:()=>import('./user_operation_detail'),
    loading:()=><Spin size="large" className="spin"/>
});


export default class MobileRouter extends React.Component {
    constructor(){
        super();
        this.state = {
            current:'/'
        }
    }

    onLink(link){
        this.setState({current:link});
    }

    render(){
        var { msg, user, socket, searchHistory, onUpdateSearchHistory, onCheckLogin, onLoginOut } = this.props;
        var { current } = this.state;
        return (
                   
                <Router>
                    <div className="mobile-container">
                        <MobileHeader user={user} searchHistory={searchHistory} onUpdateSearchHistory={onUpdateSearchHistory} onLoginOut={onLoginOut}/>
                        <Switch>
                            <Route exact path="/" render={props=>{
                                props.onLink = this.onLink.bind(this);
                                return <MobileIndex {...props}/>
                            }} />
                            <Route exact path="/details/:uniquekey" render={props=>{
                                props.user = user;
                                props.socket = socket;
                                props.onCheckLogin = onCheckLogin;
                                return <MobileNewsDetail {...props} />
                            }}/>
                        
                            <Route exact path="/newsIndex" component={MobileNewsIndex} />
                            <Route exact path="/topicIndex" render={props=>{
                                props.onCheckLogin = onCheckLogin;
                                return <MobileTopicIndex {...props} />
                            }} />
                            <Route exact path="/message" render={props=>{
                                props.user = user;
                                props.msg = msg;
                                props.socket = socket;
                                return <MobileMessage {...props}/>
                            }}/>
                        
                            <Route exact path="/search" render={props=>{
                                props.user = user;
                                props.socket = socket;
                                props.searchHistory = searchHistory;
                                props.onUpdateSearchHistory = onUpdateSearchHistory;
                                return <MobileSearch {...props} />
                            }}/>
                            <Route exact path="/usercenter/:id" render={props=>{
                                props.socket = socket;
                               
                                return <MobileUsercenter {...props} />
                            }}/>
                            <Route exact path="/usercenterDetail" render={props=>{
                                props.socket = socket;
                                props.onCheckLogin = onCheckLogin;
                                return <UserOperationDetail {...props} />
                            }}/>
                        </Switch>
                        <MobileFooter msg={msg} current={current} onLink={this.onLink.bind(this)} onCheckLogin={onCheckLogin}/>
                    </div>
                </Router> 
            
        )
    }
}






