
import React from 'react';
import ReactDOM from 'react-dom';

import MediaQuery from 'react-responsive';
import { Spin } from 'antd';
import config from '../config/config';
import secret from './utils/secret';
import PCRouter from './js/components/pc/pc_index';
import MobileRouter from './js/components/mobile/mobile_root';
import LoginContainer from './js/components/login_container';

export default class Root extends React.Component {
  constructor(){
      super();
      this.state = {
          user:{},
          msg:{},
          socket:{},
          isLoading:true,
          visible:false
      }
  }

  _handleLogined(user){
      if (user){
          var user = user;
          var { userid, username, avatar } = user;
          localStorage.setItem('userid',userid);
          localStorage.setItem('username',username);
          localStorage.setItem('avatar',avatar);
      } else {
          var userid = localStorage.getItem('userid');  
          var username = localStorage.getItem('username');
          var avatar = localStorage.getItem('avatar'); 
          var user = {userid, username, avatar }; 
      }
       
      if ( userid  ){
          var socket = io.connect(`${config.socket}`);
          socket.on('connect',()=>{
             socket.emit('user-login',secret.decrypt(userid));
             socket.on('receive-message',(msg)=>{
                //console.log(msg);
                this.setState({msg,socket,user,isLoading:false,visible:false});
             });          
          })     
      } else {
          this.setState({isLoading:false});
      }
  }

  handleLoginOut(){
        var { socket, user } = this.state;
        if(socket && user){
          socket.emit('user-loginout',user.userid);
          socket.close();
        }    
        localStorage.removeItem('username');
        localStorage.removeItem('userid');
        localStorage.removeItem('avatar');  
        this.setState({user:{}})    
  }
  
  _setLoginVisible(boolean){
      
      this.setState({visible:boolean});
  }

  componentDidMount(){
      this._handleLogined();
  }
   
  render(){
      var { visible, isLoading } = this.state;
      return (
          <div style={{textAlign:'center'}}> 
              {
                  isLoading
                  ?
                  null
                  :
                  <div>
                      <MediaQuery query='(min-device-width:640px)'>
                          <PCRouter {...this.state} onLoginVisible={this._setLoginVisible.bind(this)} onLoginOut={this.handleLoginOut.bind(this)}/>
                      </MediaQuery>
                      <MediaQuery query='(max-device-width:640px)'>
                          <MobileRouter {...this.state}/>
                      </MediaQuery> 
                  </div>
              }           
              
              {
                  visible
                  ?
                  <LoginContainer modalVisible={visible} onLoginVisible={this._setLoginVisible.bind(this)} onLogin={this._handleLogined.bind(this)}/>
                  :
                  null
              }              
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






