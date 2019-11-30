
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

const PCTopNews = Loadable({
  loader:()=>import('./pc_topnews'),
  loading:()=><Spin size="large" />
});

import '../../../css/pc.common.css';

export default class PCRouter extends React.Component {
    constructor(){
      super();
      this.state = {
          bodyHeight:0,
          scrollFunc:null,
          reload:false,
          fixPosition:false
      }
      
    }
  
    _setScrollTop(top){
        var container = this.container;
        if (container&&container.scrollTo){         
            container.scrollTo({top:top,behavior:'smooth'})
        }
    }

    handleScroll(e){
        var container = this.container;
        var { bodyHeight, fixPosition, reload } = this.state;
        if (container){        
            var { scrollHeight, scrollTop } = container;
            //  顶部图片定位           
            if ( scrollTop >= 180){
                this.setState({fixPosition:true});
            } else {
                this.setState({fixPosition:false});
            }  
            console.log(bodyHeight);
            console.log(container.scrollHeight);
            //  自动加载数据逻辑
            if (  bodyHeight + container.scrollTop  >= container.scrollHeight ){
                console.log('reload');
                this.setState({reload:true});
                setTimeout(()=>{
                    this.setState({reload:false});
                },500); 
            }   

        }
    }

    loadScrollFunc(){
        this.setState({scrollFunc:this.handleScroll.bind(this)})
    }

    componentDidMount(){
        var bodyHeight = document.body.offsetHeight;
        this.setState({bodyHeight})
    }


    render(){
        var { msg, socket, user, onLoginVisible, onCheckLogin } = this.props;
        var { bodyHeight, scrollFunc, reload, fixPosition } = this.state;

        return (
                       
                <Router>
                    <div ref={container=>this.container=container} onScroll={scrollFunc} style={{height:bodyHeight,overflowX:'hidden',overflowY:'scroll'}}>
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
                          
                          <Route exact path="/topNews" render={props=>{
                              props.onHandleScroll = this.handleScroll.bind(this);
                              props.onLoadScrollFunc = this.loadScrollFunc.bind(this);
                              props.reload = reload;
                              props.fixPosition = fixPosition;
                              return <PCTopNews {...props}/>
                          }}
                          />
                          <Route exact path="/search" render={props=>{
                              props.socket = socket;
                              return <PCSearchIndex {...props}/>
                          }}
                          /> 
                          
                          <Route exact path="/tag/:tag" component={PCTagIndex} />   
                          
                        </Switch>
                        <PCFooter />
                    </div> 
                </Router> 
            
        )
    }
}





