
import React from 'react';
import ReactDOM from 'react-dom';
import MediaQuery from 'react-responsive';
import { Button } from 'antd';

import PCHeader from './js/components/pc_header';
import PCIndex from './js/components/pc_index';
import PCNewsDetails from './js/components/pc_detail/pc_detail';
import PCUserCenter from './js/components/pc_usercenter/pc_usercenter';
import PCSearchIndex from './js/components/pc_search/pc_search_index';
import PCTagIndex from './js/components/pc_tag/pc_tag_index';
import PCTopNewsIndex from './js/components/pc_topnews_index';
import PCTopicIndex from './js/components/pc_topic/pc_topic_index';
import PCTopicDetail from './js/components/pc_topic/pc_topic_detail';


import MobileIndex from './js/components/mobile_index';
import MobileNewsDetails from './js/components/mobile_detail';
import MobileUserCenter from './js/components/mobile_usercenter';



import { BrowserRouter as Router,  Route, Link, Switch } from 'react-router-dom';

//import 'antd/dist/antd.css';

import './css/pc.css';
import './css/mobile.css';


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

      if (localStorage.getItem('username')){
        var socket = io.connect('http://localhost:8080');
        socket.on('connect',()=>{
           socket.emit('user-login',localStorage.getItem('username'));
           socket.on('receive-message',(msg)=>{
              //console.log(msg);
              this.setState({msg,socket});
           });
           
        })
       
      }
    }
   
    connectSocket(){      
        var socket = io.connect('http://localhost:8080');       
        socket.on('connect',()=>{
           socket.emit('user-login',localStorage.getItem('username'));
           socket.on('receive-message',(msg)=>{
              //console.log(msg);
              this.setState({msg,socket});
           });
        })     
    }

    handleScroll(e){
      var target = e.currentTarget;
      //console.log(target.scrollTop);
      
    }

    _setScrollTop(top){
        var container = this.container;
        if (container){
            console.log(top);
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

          <div>

              <MediaQuery query='(min-device-width:1224px)'>
                <Router>
                  <div>
                    <Switch>
                      <Route exact path="/" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props}/><PCIndex {...props}/></div>}}></Route>
                      <Route 
                          exact 
                          path="/details/:uniquekey" 
                          render={props=>{
                              props.onsocket=this.connectSocket.bind(this);
                              props.socket=socket;
                              props.msg=msg;
                              return  <div className="detail-container" ref={container=>this.container=container} style={{height:bodyHeight}} onScroll={this.handleScroll.bind(this)}>
                                        <PCHeader {...props} />
                                        <PCNewsDetails {...props} setScrollTop={this._setScrollTop.bind(this)}/>
                                      </div>
                              }}>
                      </Route>
                      <Route exact path="/usercenter/:userid" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCUserCenter {...props}/></div>}}></Route>
                      <Route exact path="/search" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCSearchIndex {...props}/></div>}}></Route>
                      <Route exact path="/topNews" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopNewsIndex {...props}/></div>}}></Route>
                      <Route exact path="/topic" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopicIndex {...props}/></div>}}></Route>
                      <Route exact path="/topic/:id" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props} /><PCTopicDetail {...props}/></div>}}></Route>

                      <Route exact path="/:tag" render={(props)=>{props.onsocket=this.connectSocket.bind(this);props.socket=socket;props.msg=msg;return <div><PCHeader {...props}/><PCTagIndex {...props}/></div>}}></Route>
                    </Switch>
                  </div>
                </Router>               
              </MediaQuery>
            
            </div>
          
        )
    }
}


/*

<MediaQuery query='(max-device-width:1224px)'>
                <Router>
                  <div>
                     <Route path="/" component={MobileIndex}></Route>
                     <Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
                     <Route path="/usercenter" component={MobileUserCenter}></Route>
                  </div>
                </Router>
              </MediaQuery>

*/


ReactDOM.render(
    <Root/>,
    document.getElementById('mainContainer')
)

if(module.hot) {
  module.hot.accept();
}






