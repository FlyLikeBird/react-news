import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Menu, Dropdown } from 'antd';
import { levelArr, formatLevel } from '../../../../utils/translateUserLevel';

const { Step } = Steps;

export default class UserListItem extends React.Component{
  constructor(){
    super();
    this.state={
      isFollowed:0
    }
  }

  
  
  componentDidMount(){
    var { isFollowed } = this.props.item;
    this.setState({isFollowed});
  }
  
  handleAddFollow(){
    //console.log(this._id);
    var { id } = this.props.item;
    fetch(`/usr/addFollow?username=${localStorage.getItem('username')}&follow=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:1});
      })
  }

  handleRemoveFollow(){
    var { id } = this.props.item;
    fetch(`/usr/removeFollow?username=${localStorage.getItem('username')}&follow=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:0})
      })
  }

  handleShowChatList(){
    //console.log(this);
    var user = this.props.item;
    var { username } = user;

    if (this.props.onShowChatList){
          this.props.onShowChatList(true,username)
    }
    
  }

  gotoUsercenter(id){
    var { history } = this.props;
    console.log(id);
    history.push(`/usercenter/${id}`);
  }

  render(){
    var  { username, description, level, userFans, userFollow, isLogined, id } = this.props.item;
    //console.log(this.props);
    //console.log(id);
    var { isFollowed } = this.state;
    const levelStyle = {
      display:'flex',
      float:'left',
      justifyContent:'space-between',
      alignItems:'center',
      width:'100px',
      height:'20px',
      marginLeft:'4px',
      backgroundColor:'rgba(24,144,255,.2)',
      borderRadius:'10px',
      transform:'scale(0.8)',
      transformOrigin:'left'
    };

    
    const content = (
            <div>
              <p>每次发表评论 <span style={{color:'#1890ff'}}>+5</span> 积分 ,点赞评论 <span style={{color:'#1890ff'}}>+1</span> 积分</p>
              <p>有热门评论 <span style={{color:'#1890ff'}}>+30</span> 积分 </p>
              <Steps progressDot size="small" current={formatLevel(level).levelNum}>
                 {
                  levelArr.map((level,index)=>{

                    return <Step key={index} title={`${level.text}`} description={`需要等级 ${index}`} />
                  })
                 }
              </Steps>,
            </div>
          );

    const menu = (
            <Menu>
              <Menu.Item key="0">
                {
                  isFollowed == 0 ?
                  <a onClick={this.handleAddFollow.bind(this)}><Icon type="plus"/><span className="ant-text">加关注</span></a>
                  :
                  isFollowed == 1 ?
                  <a onClick={this.handleRemoveFollow.bind(this)}><Icon type="check"/><span className="ant-text">已关注</span></a>
                  :
                  <a onClick={this.handleRemoveFollow.bind(this)}><Icon type="swap"/><span className="ant-text">互相关注</span></a>
                }
              </Menu.Item>
              <Menu.Item key="1">
                <a onClick={this.handleShowChatList.bind(this)}><Icon type="message"/><span className="ant-text">发消息</span></a>
              </Menu.Item>
              <Menu.Item key="2">
                <a onClick={this.gotoUsercenter.bind(this,id)}><Icon type="idcard"/><span className="ant-text">TA的空间</span></a>
              </Menu.Item>
            </Menu>
      )

    return(
      <div style={{position:'relative',display:'flex',alignItems:'flex-start'}}>
                
         <div style={{display:'inline-block',textAlign:'left'}}>
           <span style={{color:'#000'}}>{username}</span>
           
           <div style={{display:'inline-block',marginTop:'0',marginRight:'10px'}} className="user-level">
            
              <span style={ levelStyle } >
                <span className="num">{formatLevel(level).levelNum}</span>
                <span style={{marginRight:'10px'}} className="ant-text">{ levelArr[formatLevel(level).levelNum].text } <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover></span>               
              </span>
              {isLogined ? <span className="check-login in"><Icon type="sync" spin style={{marginRight:'4px'}}/>在线</span>:<span className="check-login out"><Icon type="disconnect" style={{marginRight:'4px'}}/>离线</span>}
             
           </div>
           <div><span className="ant-text">{description}</span></div>
         </div>
         {
          this.props.isSmall
          ?
          null
          :
          <div className="user-follow-container">
           <div style={{margin:'0'}} className="user-follow">
             <p><span style={{color:'#000'}} className="ant-text">关注者</span></p>
             <p><span>{userFollow.length}</span></p>
           </div>
           <div style={{margin:'0 25px'}} className="user-fans">
             <p><span style={{color:'#000'}} className="ant-text">追随者</span></p>
             <p><span>{userFans.length}</span></p>
           </div>
          </div>
         }
         

         {
           username === localStorage.getItem('username')
           ?
           null
           :
           this.props.isSmall 
           ?
           <div className="user-action-container">
             
             <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="">
                  更多操作<Icon type="down" />
                </a>
             </Dropdown>
           </div>
           :
           <div className="user-action-container">
             {
              isFollowed == 0 ?
              <Button onClick={this.handleAddFollow.bind(this)} type="default" size="small"><Icon type="plus"/><span className="ant-text">加关注</span></Button>
              :
              isFollowed == 1 ?
              <Button onClick={this.handleRemoveFollow.bind(this)} type="primary" size="small"><Icon type="check"/><span className="ant-text">已关注</span></Button>
              :
              <Button onClick={this.handleAddFollow.bind(this)} type="primary" size="small"><Icon type="swap"/><span className="ant-text">互相关注</span></Button>
             }
             <Button style={{marginLeft:'-10px'}} onClick={this.handleShowChatList.bind(this)} type="primary" size="small"><Icon type="message"/><span className="ant-text">发消息</span></Button>
             <Button style={{marginLeft:'-10px'}} onClick={this.gotoUsercenter.bind(this,id)} type="primary" size="small"><Icon type="idcard"/><span className="ant-text">TA的空间</span></Button>
           </div>
          }
                     
      </div>
    )
  }
}


