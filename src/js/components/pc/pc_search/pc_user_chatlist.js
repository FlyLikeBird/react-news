import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Spin, Modal, Input } from 'antd';
import { parseDate, formatDate } from '../../../../utils/translateDate';

export default class ChatList extends React.Component{
  constructor(){
    super();
    this.state={
      value:'',
      list:[]
    }
  }

  
  componentDidMount(){
    var { socket, toUser, toId } = this.props;
    var userid = localStorage.getItem('userid');
    //console.log(toUser);
    fetch(`/api/usr/getChatList?userid=${userid}&other=${toId}`)
        .then(response=>response.json())
        .then(data=>{
           var list = data.data;
           this.setState({list});
           if (this.ulDom){
             //console.log(this.ulDom);
             this.ulDom.scrollTop = this.ulDom.scrollHeight;
          }

        })
    if (socket){
        socket.emit('isChatting',userid,toId);
        socket.on('send-chatList',(msg)=>{
          console.log(msg);
          this.setState({list:msg});
          if (this.ulDom){
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
    var { value } = this.state;
    var { socket, toUser, toId } = this.props;
    var userid = localStorage.getItem('userid');
    if (!value || value.match(/^\s+$/g)){
      this.setState({value:'请输入合适的聊天内容!'});
      return ;
    }
    var data = {
      fromUser:userid,
      toUser:toId,
      value:value
    }
    socket.emit('send-message',data);  
    this.setState({value:''});  
  }

  render(){
    var { list, value } = this.state;
    var { visible, toUser } = this.props;
    var userid = localStorage.getItem('userid');
    return(

      <Modal className="chatRecord-container" visible={visible} title={`与${toUser}聊天中`} onCancel={()=>this.props.onModalVisible(false)}  destroyOnClose={true} footer={
                
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
                                <li key={index} className={item.fromUser==userid?'self':'other'}>
                                    <div className="img-container"><img src={item.fromUser==userid?item.selfAvatar:item.otherAvatar} /></div>
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


