import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Spin, Modal, Input } from 'antd';
import { parseDate, formatDate } from '../../../../utils/translateDate';

export default class ChatList extends React.Component{
  constructor(){
    super();
    this.state={
      value:'',
      list:[],
      visible:false,
      selfAvatar:'',
      otherAvatar:''
    }
  }

  
  componentDidMount(){
    var { socket, toUser } = this.props;
    //console.log(toUser);
    fetch(`/usr/getChatList?username=${localStorage.getItem('username')}&other=${this.props.toUser}`)
      .then(response=>response.json())
      .then(data=>{
        var list = data.data;
        this.setState({list});

        if (this.ulDom){
          //console.log(this.ulDom);
          this.ulDom.scrollTop = this.ulDom.scrollHeight;
       }

      })

    fetch(`/usr/getUserAvatar?user=${localStorage.getItem('username')}&other=${toUser}`)
      .then(response=>response.json())
      .then(json=>{
        var avatar = json.data;
        var { selfAvatar, otherAvatar } = avatar;
        this.setState({selfAvatar,otherAvatar});
      })

    if (!this.props.isSystemMsg){

      socket.emit('isChatting',localStorage.getItem('username'),toUser);
      socket.on('send-chatList',(msg)=>{
        this.setState({list:msg});
        console.log(msg);
        if (this.ulDom){
          //console.log(this.ulDom);
          this.ulDom.scrollTop = this.ulDom.scrollHeight;
        }
      });
    }
  }
  
  

  handleInputChange(e){
    var value = e.target.value;
  
    this.setState({value})
  }

  handleSendMessage(){
    var value = this.state.value;
    var { socket, toUser } = this.props;
    if (!value || value.match(/^\s+$/g)){
      this.setState({value:'请输入合适的聊天内容!'});
      return ;
    }

    var data = {
      fromUser:localStorage.getItem('username'),
      toUser:toUser,
      value:value
    }
    //console.log(data);

    socket.emit('send-message',data);
    
    
    this.setState({value:''});

    
    
  }

  render(){
    var { list, selfAvatar, otherAvatar } = this.state;
    var { visible, toUser } = this.props;

    return(

      <Modal className="chatRecord-container" visible={visible} title={toUser==='React-News平台'?null:`与${this.props.toUser}聊天中`} onOk={()=>this.props.onModalVisible(false)} onCancel={()=>this.props.onModalVisible(false)} footer={
                toUser==='React-News平台'
                ?
                null
                :
                <div style={{textAlign:'left'}}>
                  
                    <input style={{width:'100%','marginBottom':'4px'}} value={this.state.value} onChange={this.handleInputChange.bind(this)} />
                    <Button onClick={this.handleSendMessage.bind(this)}>send</Button>
                </div>
                
            }>
                <div>
                    <ul style={{height:'400px',overflow:'scroll',listStyle:'none',padding:'30px 0'}} ref={dom=>this.ulDom = dom}>
                        {
                            list.length
                            ?
                            list.map((item,index)=>(
                                <li key={index} className={item.fromUser==localStorage.getItem('username')?'self':'other'}>
                                    <div className="img-container"><img src={item.fromUser==localStorage.getItem('username')?selfAvatar:otherAvatar} /></div>
                                    <div className="text-container">
                                       
                                        <span>{item.content}</span>
                                        
                                        <span className='ant-text'>{formatDate(parseDate(item.msgtime))}</span>
                                    </div>

                                </li>
                            ))
                            :
                            null
                        }
                    </ul>
                </div>
            </Modal>
    )
  }
}


