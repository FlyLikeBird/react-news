import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Form, Button, Spin, Modal, Input } from 'antd';
import { parseDate, formatDate } from '../../../utils/translateDate';

class ChatList extends React.Component{
  constructor(){
    super();
    this.state={
      list:[],
      selfAvatar:'',
      otherAvatar:''
    }
  }

  
  componentDidMount(){
    var { socket, toId } = this.props;
    var userid = localStorage.getItem('userid');
    
    fetch(`/api/usr/getChatList?userid=${userid}&other=${toId}`)
        .then(response=>response.json())
        .then(json=>{
           var data = json.data;
           var { messages, selfAvatar, otherAvatar } = data;
           this.setState({list:messages, selfAvatar, otherAvatar});
           if (this.ulDom){
             this.ulDom.scrollTop = this.ulDom.scrollHeight;
           }
         
        })
    if (socket){
        socket.emit('isChatting', userid, toId );
        socket.on('send-chatList',(msg)=>{
          var { messages } = msg;
          this.setState({list:messages});
          if (this.ulDom){
            this.ulDom.scrollTop = this.ulDom.scrollHeight;
          }
        });
    }   
  }
  
  handleSendMessage(e){
    e.preventDefault();
    var { socket, toUser, toId, form } = this.props;
    var userid = localStorage.getItem('userid');
    form.validateFields(['chat'],(errs,values)=>{
        if(!errs){
            var { chat } = values;
            var data = {
              fromUser:userid,
              toUser:toId,
              value:chat
            }
            socket.emit('send-message',data); 
        }
    })  
      
  }

  handleCheckMessage(rule,value,callback){       
      if (value && value.match(/^\s+$/)){
        callback('请输入合适的内容!');
      } else {
        callback();       
      }      
  }

  render(){
    var { list, selfAvatar, otherAvatar } = this.state;
    var { visible, toUser, onModalVisible, form } = this.props;
    var { getFieldDecorator } = form;
    var userid = localStorage.getItem('userid');

    return(

      <Modal className="chatRecord-container" visible={visible} title={`与${toUser}聊天中`} onCancel={()=>onModalVisible(false)}  destroyOnClose={true} footer={             
                <Form onSubmit={this.handleSendMessage.bind(this)}>
                    <Form.Item hasFeedback>               
                    {
                        getFieldDecorator('chat',{
                            rules:[{
                              required:true,
                              message:'内容不能为空!'
                            },{
                              validator:this.handleCheckMessage.bind(this)
                            }]
                        })(
                            <Input />
                        )
                    }
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" style={{marginTop:'4px'}} htmlType="submit">send</Button>
                    </Form.Item>
                </Form>
                
            }>
                <div>
                    <ul style={{height:'400px',overflow:'scroll',listStyle:'none',padding:'30px 0'}} ref={dom=>this.ulDom = dom}>
                        {
                            list.length
                            ?
                            list.map((item,index)=>(
                                <li key={index} className={item.fromUser==userid?'self':'other'}>
                                    <div className="img-container"><img src={item.fromUser==userid? selfAvatar : otherAvatar} /></div>
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

export default ChatList = Form.create()(ChatList)


