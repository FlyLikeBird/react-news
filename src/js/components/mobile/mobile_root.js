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

})

export default class MobileRouter extends React.Component {
    
    
    render(){
        
        return (
                   
                <Router>
                    <div>
                        <MobileHeader />
                        <Switch>
                            <Route exact path="/" component={MobileIndex} />
                            <Route exact path="/details/:uniquekey" component={MobileDetail} />
                        </Switch>
                        <PCFooter />
                    </div>
                </Router> 
            
        )
    }
}






