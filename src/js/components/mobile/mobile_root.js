import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import { BrowserRouter as Router,  Route, Link, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Spin } from 'antd';

import MobileHeader from './mobile_header';
import PCFooter from '../pc/pc_footer';

import '../../../css/mobile.css';


const MobileIndex = Loadable({
  loader:()=>import('./mobile_index'),
  loading:()=><Spin size="large"/>
});

const MobileDetail = Loadable({
    loader:()=>import('./mobile_detail'),
    loading:()=><Spin size="large"/>

});

const MobileNewsIndex = Loadable({
    loader:()=>import('./mobile_news'),
    loading:()=><Spin size="large"/>

});


const MobileTopicIndex = Loadable({
    loader:()=>import('./mobile_topic'),
    loading:()=><Spin size="large"/>

});


export default class MobileRouter extends React.Component {
    
    
    render(){
        
        return (
                   
                <Router>
                    <div style={{height:'100%'}}>
                        <MobileHeader />
                        <Switch>
                            <Route exact path="/" component={MobileIndex} />
                            <Route exact path="/details/:uniquekey" component={MobileDetail} />
                            <Route exact path="/news" component={MobileNewsIndex} />
                            <Route exact path="/topicIndex" component={MobileTopicIndex} />
                        </Switch>
                    </div>
                </Router> 
            
        )
    }
}






