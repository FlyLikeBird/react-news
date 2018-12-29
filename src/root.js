



import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

import PCIndex from './js/components/pc_index';
import PCNewsDetails from './js/components/pc_detail';
import PCUserCenter from './js/components/pc_usercenter';

import MediaQuery from 'react-responsive';
//console.log(MediaQuery);

/*
import MobileIndex from './components/mobile_index';
import MobileNewsDetails from './components/mobile_detail';
import MobileUserCenter from './components/mobile_usercenter';

import Test from './components/test';
import TodoList from './components/todoList';

*/
import {Router,Route,hashHistory} from 'react-router';

import 'antd/dist/antd.css';

import './css/pc.css';
/*
export default class Root extends React.Component {
    render(){
        
        return (
            <div>
              <MediaQuery query='(min-device-width:1224px)'>
                <Router history={hashHistory}>
                  <Route path="/" component={PCIndex}></Route>
                  <Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
                  <Route path="/usercenter" component={PCUserCenter}></Route>
                  <Route path="/test" component={Test}></Route>
                  <Route path="/todo" component={TodoList}></Route>
                </Router>
                
              </MediaQuery>

              <MediaQuery query='(max-device-width:1224px)'>
                <Router history={hashHistory}>
                  <Route path="/" component={MobileIndex}></Route>
                  <Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
                  <Route path="/usercenter" component={MobileUserCenter}></Route>
                </Router>
              </MediaQuery>
            
            </div>
            
            
        )
    }
}
*/

export default class Root extends React.Component {
    render(){
        
        return (
            <div>
              <MediaQuery query='(min-device-width:1224px)'>
                <Router history={hashHistory}>
                  <Route path="/" component={PCIndex}></Route>
                  <Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
                  <Route path="/usercenter" component={PCUserCenter}></Route>
                  
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






