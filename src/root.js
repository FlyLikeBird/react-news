
import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { BrowserRouter as Router,  Route, Link, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Button } from 'antd';
import { Spin } from 'antd';

import PCHeader from './js/components/pc/pc_header';
import PCFooter from './js/components/pc/pc_footer';

const PCIndex = Loadable({
  loader:()=>import('./js/components/pc/pc_index'),
  loading:()=><Spin/>,
  timeout:10000
});

const PCTagIndex = Loadable({
  loader:()=>import('./js/components/pc/pc_tag'),
  loading:()=><Spin/>,
  timeout:10000
})

const PCNewsDetails = Loadable({
  loader:()=>import('./js/components/pc/pc_detail'),
  loading:()=><Spin/>,
  timeout:10000
})

const PCUserCenter = Loadable({
  loader:()=>import('./js/components/pc/pc_usercenter'),
  loading:()=><Spin/>,
  timeout:10000
})
console.log(PCUserCenter);
/*
import PCNewsDetails from './js/components/pc_detail/pc_detail';
import PCUserCenter from './js/components/pc_usercenter/pc_usercenter';
import PCSearchIndex from './js/components/pc_search/pc_search_index';
import PCTagIndex from './js/components/pc_tag/pc_tag_index';
import PCTopNewsIndex from './js/components/pc_topnews_index';
import PCTopicIndex from './js/components/pc_topic/pc_topic_index';
import PCTopicDetail from './js/components/pc_topic/pc_topic_detail';
import PCActionContainer from './js/components/pc_action/pc_action_container';

import MobileIndex from './js/components/mobile_index';
*/
import './css/pc.common.css';

export default class Root extends React.Component {
    constructor(){
      super();
      this.state = {
        socket:{},
        msg:{},
        bodyHeight:0
      }
      
    }
    
    componentWillMount(){
      var username = localStorage.getItem('username');     
      if ( username  ){
        var socket = io.connect('http://localhost:8081');
        socket.on('connect',()=>{
           socket.emit('user-login',username);
           socket.on('receive-message',(msg)=>{
              //console.log(msg);
              this.setState({msg});
           });
           this.setState({socket})           
        })
       
      }
    }
   
    connectSocket(){      
        var socket = io.connect('http://localhost:8081');       
        socket.on('connect',()=>{
           socket.emit('user-login',localStorage.getItem('username'));
           socket.on('receive-message',(msg)=>{
              this.setState({msg});
           });
           this.setState({socket})
        })     
    }

    handleScroll(e){
      var target = e.currentTarget;
      //console.log(target.scrollTop);
      
    }

    _setScrollTop(top){
        var container = this.container;
        if (container){
            container.scrollTop = top;
        }
    }

    componentDidMount(){
        var bodyHeight = document.body.offsetHeight;
        this.setState({bodyHeight})
    }

    render(){
        
        var { bodyHeight, socket, msg } = this.state;
        return (

          <div style={{textAlign:'center'}}>
              <MediaQuery query='(min-device-width:1224px)'>
                
                <Router>
                    <div>
                        <PCHeader msg={msg} socket={socket}/>
                        <Switch>
                          <Route exact path="/" component={PCIndex} />
                          <Route exact path="/:tag" component={PCTagIndex} />
                          <Route exact path="/details/:uniquekey" component={PCNewsDetails} />
                          
                          <Route exact path="/usercenter/:userid" render={(props)=>{
                              props.msg = msg;
                              props.socket=socket;
                              return <PCUserCenter {...props}/>
                          }} />
                      
                        {/*<Route exact path="/usercenter/:userid" component={PCUserCenter}/>*/}
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
                             
              </MediaQuery>
                          
            </div>
          
        )
    }
}


ReactDOM.render(
    <Root/>,
    document.getElementById('mainContainer')
)

if(module.hot) {
  module.hot.accept();
}






