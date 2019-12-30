import React from 'react';

import { List, Avatar, Popover, Steps, Icon, Button, Menu, Dropdown } from 'antd';
import { levelArr, formatLevel } from '../../../utils/translateUserLevel';

const { Step } = Steps;

export default class UserListItem extends React.Component{
  constructor(){
    super();
    this.state={
      isFollowed:0
    }
  }

  componentDidMount(){
    var { item } = this.props;
    var { isFollowed } = item;
    this.setState({isFollowed});
  }
  
  handleAddFollow(id){
    fetch(`/api/usr/addFollow?userid=${localStorage.getItem('userid')}&followId=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:1});
      })
  }

  handleRemoveFollow(id){
    fetch(`/api/usr/removeFollow?userid=${localStorage.getItem('userid')}&followId=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:0})
      })
  }

  handleShowChatList(){
    var { item, onShowChatList } = this.props;
    var { username, _id } = item;
    if ( onShowChatList ) onShowChatList(true, _id, username);
  }

  gotoUsercenter(id){
    var { history } = this.props;
    history.push(`/usercenter/${id}`);
  }

  gotoMobileUsercenter(id){
    var { history, forMobile } = this.props;
    if (history && forMobile){
        history.push(`/usercenter/${id}`);
    }
  }
  
  render(){
    var { item, expand, forMobile } = this.props;
    var  { username, description, level, userImage, userFans, userFollows, isLogined, _id } = item;
    var { isFollowed } = this.state;
  
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
                  <a onClick={this.handleAddFollow.bind(this,_id)}><Icon type="plus"/><span className="ant-text">加关注</span></a>
                  :
                  isFollowed == 1 ?
                  <a onClick={this.handleRemoveFollow.bind(this,_id)}><Icon type="check"/><span className="ant-text">已关注</span></a>
                  :
                  <a onClick={this.handleRemoveFollow.bind(this,_id)}><Icon type="swap"/><span className="ant-text">互相关注</span></a>
                }
              </Menu.Item>
              <Menu.Item key="1">
                <a onClick={this.handleShowChatList.bind(this)}><Icon type="message"/><span className="ant-text">发消息</span></a>
              </Menu.Item>
              <Menu.Item key="2">
                <a onClick={this.gotoUsercenter.bind(this,_id)}><Icon type="idcard"/><span className="ant-text">TA的空间</span></a>
              </Menu.Item>
            </Menu>
      )

    return(
      <div className="user-list-item" onClick={this.gotoMobileUsercenter.bind(this,_id)}>
         <div className="user-img-container">
            <span><img src={userImage} /></span>
         </div> 
         <div className="user-info-container">  
              <div style={{display:'flex',alignItems:'center'}}>
                  <span style={{color:'#000'}}>{username}</span>                            
                  <span className="user-level">
                      <span className="num">{formatLevel(level).levelNum}</span>
                      <span>{ levelArr[formatLevel(level).levelNum].text }</span>
                      <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover>               
                  </span>
                  { 
                      isLogined 
                      ? 
                      <span className="user-level in"><Icon type="sync" spin style={{marginRight:'4px'}}/>在线</span>
                      :
                      <span className="user-level out"><Icon type="disconnect" style={{marginRight:'4px'}}/>离线</span>
                  } 
              </div>          
              <div className="text-container"><span className="ant-text">{description}</span></div>
         </div>
         {
          expand || forMobile
          ?
          null
          :
          <div className="user-follow-container">
              <div>
                <span>关注者</span>
                <div>{userFollows.length}</div>
              </div>
              <div>
                <span>追随者</span>
                <div><span>{userFans.length}</span></div>
              </div>
          </div>
         }
         

         {
           username === localStorage.getItem('username') || forMobile
           ?
           null
           :
           expand 
           ?
           <div className="user-action-container">        
             <Dropdown overlay={menu} >
                <span style={{color:'#1890ff',display:'inline-block',transform:'scale(0.9)'}}>
                  更多操作<Icon type="down" />
                </span>
             </Dropdown>
           </div>
           :
           <div className="user-action-container">
             {
              isFollowed == 0 ?
              <Button onClick={this.handleAddFollow.bind(this,_id)} type="default" size="small"><Icon type="plus"/><span className="ant-text">加关注</span></Button>
              :
              isFollowed == 1 ?
              <Button onClick={this.handleRemoveFollow.bind(this,_id)} type="primary" size="small"><Icon type="check"/><span className="ant-text">已关注</span></Button>
              :
              <Button onClick={this.handleRemoveFollow.bind(this,_id)} type="primary" size="small"><Icon type="swap"/><span className="ant-text">互相关注</span></Button>
             }
             <Button onClick={this.handleShowChatList.bind(this)} type="primary" size="small"><Icon type="message"/><span className="ant-text">发消息</span></Button>
             <Button onClick={this.gotoUsercenter.bind(this,_id)} type="primary" size="small"><Icon type="idcard"/><span className="ant-text">TA的空间</span></Button>
           </div>
          }
                     
      </div>
    )
  }
}


