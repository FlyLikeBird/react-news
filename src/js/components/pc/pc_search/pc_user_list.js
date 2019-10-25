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
              var filterArr = data.map(item=>{
                item['isLogined'] = result[item.username]?result[item.username]:false;
                return item;
              });
              //console.log(filterArr);
              socket.emit('checkIsFollowed',users.filter(item=>item != localStorage.getItem('username')),localStorage.getItem('username'));
              socket.on('checkIsFollowedResult',(result)=>{
                  //console.log(result);
                  var list = filterArr.map(item=>{
                    for(var i=0,len=result.length;i<len;i++){
                      if (item.id === result[i].id) {
                        item['isFollowed'] = result[i].state;
                        break;
                      }
        
                    }
        
                    return item;
                  })
      
                  this.setState({list})
              })
          
          });
      
      
      
  }

  componentDidMount(){
      this._flag = true;   
      this._checkUserLoginedAndFollowd(this.props);
  }
  
  componentWillUnmount(){
      clearTimeout(this.timer);
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
    var { socket, history } = this.props;
     
    return(

      <div>
          {
              list.length
              ?
              <div>
                  <List
                    className="user-list"
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={user => (
                      <List.Item>
                        <List.Item.Meta
                          
                          avatar={<Avatar src={user.userImage} />}
                          
                          description={
                            
                              <UserListItem isSmall={this.props.isSmall} socket={socket} history={history} onShowChatList={this.handleShowChatList.bind(this)} item={user} />
                              
        
                          }
                        />
                      </List.Item>
                    )}
                  />
                  {
                    visible
                    ?        
                    <ChatList socket={socket} visible={this.state.visible} toUser={this.state.toUser} id={this.state.chatId} onModalVisible={this.handleModalVisible.bind(this)}/>
                    :
                    null
                  }
              </div>
              :
              <div>{this.props.text}</div>
          }
      </div>
      
    )
  }
}


