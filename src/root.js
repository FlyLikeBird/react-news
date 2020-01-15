import React from 'react';
import ReactDOM from 'react-dom';
import MediaQuery from 'react-responsive';
import { Spin, message } from 'antd';
import config from '../config/config';
import PCRouter from './js/components/pc/pc_index';
import MobileRouter from './js/components/mobile/mobile_root';
import LoginContainer from './js/components/login_container';

import 'antd/dist/antd.css';
import './css/pc.common.css';
import './css/mobile.css';

export default class Root extends React.Component {
  constructor(){
      super();
      this.state = {
          user:{},
          msg:{},
          socket:{},
          visible:false,
          searchHistory:[]
      }
  }

  _handleLogined(user){
      if (user){
          var user = user;
          var { userid, username, avatar } = user;
          localStorage.setItem('userid',userid);
          localStorage.setItem('username', username);
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
             socket.emit('user-login',userid);
             socket.on('receive-message',(msg)=>{
                //console.log(msg);
                this.setState({msg,socket,user,visible:false});
             });          
          })     
      } 
  }

  handleLoginOut(isUserPage){
        var { socket, user } = this.state;
        if (isUserPage){
            window.location.href = '/';
        }
        if(socket && user){
          socket.emit('user-loginout',user.userid);
          socket.close();
        }  
        localStorage.removeItem('username');
        localStorage.removeItem('userid');
        localStorage.removeItem('avatar');  
        this.setState({user:{}})    
  }
  
  _checkUserLogin(){
      var { user } = this.state;
      if (user.userid){
         return user.userid;
      } else {
           message.info('请先完成注册和登录操作!',1,()=>{
              this._setLoginVisible(true);
          })
      }
  }

  _setLoginVisible(boolean){  
      this.setState({visible:boolean});
  }

  componentDidMount(){
      this._handleLogined();
      this._updateSearchHistory();
  }
  
  _updateSearchHistory(title, remove){
        var searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];             
        if (remove){
            localStorage.removeItem('searchHistory');
            this.setState({searchHistory:[]});
        } else {
            if (title){
                var pattern = /(^\s*)|(\s*$)/g;
                var title = title.replace(pattern,'');
                if (!searchHistory.map(item=>item.title).includes(title)){
                    searchHistory.push({title})
                }             
                localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
            }      
            this.setState({searchHistory});
        }
  }


  render(){
      var { visible, searchHistory } = this.state;
      return (
          <div style={{textAlign:'center',height:'100%'}}>            
              <MediaQuery query='(min-device-width:640px)'>
                  <PCRouter 
                      {...this.state} 
                      onLoginVisible={this._setLoginVisible.bind(this)} 
                      onLoginOut={this.handleLoginOut.bind(this)} 
                      onCheckLogin={this._checkUserLogin.bind(this)}
                      onUpdateSearchHistory={this._updateSearchHistory.bind(this)}
                  />
              </MediaQuery>              
              <MediaQuery query='(max-device-width:640px)'>
                  <MobileRouter 
                    {...this.state} 
                    onLoginVisible={this._setLoginVisible.bind(this)} 
                    onLoginOut={this.handleLoginOut.bind(this)} 
                    onCheckLogin={this._checkUserLogin.bind(this)}
                    onUpdateSearchHistory={this._updateSearchHistory.bind(this)}
                  />
              </MediaQuery>  
                         
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






