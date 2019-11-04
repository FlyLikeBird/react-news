import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Spin, Modal } from 'antd';


import UserListItem from './pc_user_list_item';
import ChatList from './pc_user_chatlist';

export default class UserList extends React.Component{
  constructor(){
    super();
    this.state={     
      list:[],
      visible:false,
      toUser:'',
      chatId:''
    }
  }
  
  _checkUserLoginedAndFollowd(props){
      var { data, socket } = props;
      var users = data.map(item=>item.username);
      socket.emit('checkLogined',users);
      socket.on('checkLoginedResult',(result)=>{
          //console.log(result);
          var filterArr = data.map(item=>{
            item['isLogined'] = result[item.username]?result[item.username]:false;
            return item;
          });
          this.setState({list:filterArr});
          
      });
          
  }

  componentDidMount(){ 
      this._checkUserLoginedAndFollowd(this.props);
  }
  
  handleModalVisible(bool){
    var { socket } = this.props;
    this.setState({visible:bool});
    socket.emit('chattingClosed');

  }

  handleShowChatList(bool,toUser,id){
    this.setState({visible:bool,toUser,chatId:id});
  }


  render(){
    var { list, visible }  = this.state;
    var { socket, history, text } = this.props;
     
    return(

      <div>
          {
              list.length
              ?
              <div className="user-list">
                  {
                      list.map((item,index)=>(
                          <UserListItem 
                              key={index}
                              socket={socket} 
                              history={history} 
                              onShowChatList={this.handleShowChatList.bind(this)} 
                              item={item} 
                          />
                      ))
                  }
 
                  {
                    visible
                    ?        
                    <ChatList socket={socket} visible={this.state.visible} toUser={this.state.toUser} id={this.state.chatId} onModalVisible={this.handleModalVisible.bind(this)}/>
                    :
                    null
                  }
              </div>
              :
              <div>{text}</div>
          }
      </div>
      
    )
  }
}


