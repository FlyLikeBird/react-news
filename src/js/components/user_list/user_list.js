import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Spin, Modal } from 'antd';

import UserListItem from './user_list_item';
import ChatList from './user_chatlist';

export default class UserList extends React.Component{
  constructor(){
    super();
    this.state={     
      list:[],
      visible:false,
      toUser:'',
      toId:''
    }
  }
  
  _checkUserLoginedAndFollowd(){
      var { data, socket } = this.props;
      var userids = data.map(item=>item._id);
      if (socket){
          socket.emit('checkLogined',userids,localStorage.getItem('userid'));
          socket.on('checkLoginedResult',(logined,followed)=>{
              var filterArr = data.map(item=>{
                item['isLogined'] = logined[item._id]?logined[item._id]:false;
                item['isFollowed'] = followed[item._id];
                return item;
              });
              this.setState({list:filterArr});
          });
      }
          
  }

  componentDidMount(){ 
      this._checkUserLoginedAndFollowd();
  }
  
  handleModalVisible(bool){
    var { socket } = this.props;
    this.setState({visible:bool});
    socket.emit('chattingClosed');

  }

  handleShowChatList(bool, toId, toUser){
    this.setState({visible:bool, toId, toUser});
  }

  render(){
    var { list, visible, toUser, toId }  = this.state;
    var { socket, history, expand, text } = this.props;
     
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
                              expand={expand}
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
                    <ChatList socket={socket} visible={visible} toUser={toUser} toId={toId} onModalVisible={this.handleModalVisible.bind(this)}/>
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


