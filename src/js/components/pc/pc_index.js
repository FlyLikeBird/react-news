
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
  loading:()=><Spin size="large"/>
})

const PCSearchIndex = Loadable({
  loader:()=>import('./pc_search/pc_search_index'),
  loading:()=><Spin size="large"/>
})

const PCTopNews = Loadable({
  loader:()=>import('./pc_topnews'),
  loading:()=><Spin size="large"/>
});

export default class PCRouter extends React.Component {
    constructor(){
      super();
      this.state = {
          scrollFunc:null,
          allowReload:true,
          reloading:false,
          isFixed:false
      }
      
    }
  
    _setScrollTop(top){
        var container = this.container;
        if (container&&container.scrollTo){  
            setTimeout(()=>{
                container.scrollTo({top:top,behavior:'smooth'})
            },1000)         
        }
    }

    handleScroll(e){
        var container = this.container;
        var { isFixed, reload, allowReload, reloading } = this.state;
        if (container){        
            var { scrollHeight, scrollTop, clientHeight } = container;
            //  顶部图片定位              
            if (!isFixed){
                if (scrollTop >=180){
                    this.setState({isFixed:true});
                }
            } else {
                if (scrollTop<180){
                    this.setState({isFixed:false});
                }
            }              
            //  自动加载数据逻辑
            //console.log(allowReload);
            if (  allowReload && (scrollHeight - (clientHeight + scrollTop) == 0)  ){                
                this._stopAutoLoad(false, true);              
            }   
        }
    }

    _stopAutoLoad(allowReload, reloading){
        this.setState({allowReload,reloading});
    }

    _resetFixed(){
        this.setState({isFixed:false});
    }

    loadScrollFunc(load){
        if (load) {
            this.setState({scrollFunc:this.handleScroll.bind(this)});
        } else {
            this.setState({scrollFunc:null});
        }       
    }
    
    render(){
        var { msg, socket, user, searchHistory, onUpdateSearchHistory, onLoginVisible, onCheckLogin } = this.props;
        var { scrollFunc, allowReload, reloading, isFixed } = this.state;
        
        return (                      
                <Router>                    
                    <div ref={container=>this.container=container} onScroll={scrollFunc} style={{height:'100%',overflowX:'hidden',overflowY:'scroll'}}>
                        <PCHeader {...this.props} searchHistory={searchHistory} onUpdateSearchHistory={onUpdateSearchHistory}/>
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
                          
                          <Route exact path="/topicIndex" render={props=>{
                              props.onCheckLogin = onCheckLogin;
                              return <PCTopicIndex {...props} />
                            }}/>
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
                            props.onCheckLogin = onCheckLogin;
                            return <PCActionDetail {...props} />
                          }}
                          />
                          
                          <Route exact path="/newsIndex" render={props=>{
                              props.onHandleScroll = this.handleScroll.bind(this);
                              props.onLoadScrollFunc = this.loadScrollFunc.bind(this);
                              props.onStopAutoLoad=this._stopAutoLoad.bind(this);
                              props.onResetFixed = this._resetFixed.bind(this);
                              props.allowReload = allowReload;
                              props.reloading = reloading;
                              props.isFixed = isFixed;
                              return <PCTopNews {...props}/>
                          }}
                          />
                          <Route exact path="/search" render={props=>{
                              props.socket = socket;
                              props.onCheckLogin = onCheckLogin;
                              props.searchHistory = searchHistory;
                              props.onUpdateSearchHistory = onUpdateSearchHistory;
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





