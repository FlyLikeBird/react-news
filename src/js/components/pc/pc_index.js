
import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import { BrowserRouter as Router,  Route, Link, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Spin } from 'antd';
import config from '../../../../config/config';
import PCHeader from './pc_header';
import PCFooter from './pc_footer';

const PCNewsContainer = Loadable({
  loader:()=>import('./pc_news_container'),
  loading:()=><Spin size="large"/>
});

const PCTagIndex = Loadable({
  loader:()=>import('./pc_tag'),
  loading:()=><Spin size="large"/>
});

const PCUserCenter = Loadable({
  loader:()=>import('./pc_usercenter/index'),
  loading:()=><Spin size="large"/>
});

const PCTopicIndex = Loadable({
  loader:()=>import('./pc_topic'),
  loading:()=><Spin size="large"/>
});

const PCTopicDetail = Loadable({
  loader:()=>import('./pc_topic/pc_topic_detail'),
  loading:()=><Spin size="large"/>
});

const PCNewsDetail = Loadable({
  loader:()=>import('./pc_detail'),
  loading:()=><Spin size="large"/>
});

const PCActionDetail = Loadable({
  loader:()=>import('./pc_action'),
  loading:()=><Spin size="large" />
})

const PCSearchIndex = Loadable({
  loader:()=>import('./pc_search/pc_search_index'),
  loading:()=><Spin size="large" />
})

import '../../../css/pc.common.css';

export default class PCRouter extends React.Component {
    constructor(){
      super();
      this.state = {
        bodyHeight:0
      }
      
    }
  
    _setScrollTop(top){
        var container = this.container;
        console.log(top);
        if (container&&container.scrollTo){         
            container.scrollTo({top:top,behavior:'smooth'})
        }
    }

    componentDidMount(){
        var bodyHeight = document.body.offsetHeight;
        this.setState({bodyHeight})
    }

    render(){
        var { msg, socket, user, onLoginVisible, onCheckLogin } = this.props;
        var { bodyHeight } = this.state;
        return (

                         
                <Router>
                    <div ref={container=>this.container=container} style={{height:bodyHeight,overflowX:'hidden',overflowY:'scroll'}}>
                        <PCHeader {...this.props}/>
                        <Switch>
                          <Route exact path="/" component={PCNewsContainer} />                          
                          <Route exact path="/usercenter/:id" render={(props)=>{
                              props.socket = socket;
                              props.onCheckLogin = onCheckLogin;
                              props.msg = msg;
                              return <PCUserCenter {...props} />
                            }} 
                          /> 
                          <Route exact path="/details/:uniquekey" render={props=>{
                              props.user = user;
                              props.onCheckLogin = onCheckLogin;
                              props.onSetScrollTop = this._setScrollTop.bind(this);
                              props.socket = socket;
                              return <PCNewsDetail {...props} />
                            }} 
                          />
                          
                          <Route exact path="/topicIndex" component={PCTopicIndex} />
                          <Route exact path="/topic/:id" render={props=>{
                            props.onSetScrollTop = this._setScrollTop.bind(this);
                            props.onCheckLogin = onCheckLogin;
                            props.socket = socket;
                            return <PCTopicDetail {...props} />
                          }}
                          />
                          <Route exact path="/action/:id" render={props=>{
                            props.onSetScrollTop = this._setScrollTop.bind(this);
                            props.socket = socket;
                            return <PCActionDetail {...props} />
                          }}
                          />
                          <Route exact path="/search" render={props=>{
                              props.socket = socket;
                              return <PCSearchIndex {...props}/>
                          }} 
                          />
                          <Route exact path="/tag/:tag" component={PCTagIndex} />   
                          
                        {/*
                          <Route exact path="/" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props}/><PCIndex {...props}/></div>}}></Route>
                          
                          <Route exact path="/usercenter/:userid" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCUserCenter {...props}/></div>}}></Route>
                          <Route exact path="/search" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCSearchIndex {...props}/></div>}}></Route>
                          <Route exact path="/topNews" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopNewsIndex {...props}/></div>}}></Route>
                          <Route exact path="/topic" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopicIndex {...props}/></div>}}></Route>
                          <Route exact path="/topic/:id" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopicDetail {...props}/></div>}}></Route>
                          <Route exact path="/action/:id" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCActionContainer {...props} /></div>}}></Route>
                          <Route exact path="/:tag" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props}/><PCTagIndex {...props}/></div>}}></Route>
                          */}
                        </Switch>
                        <PCFooter />
                    </div> 
                </Router> 
            
        )
    }
}





