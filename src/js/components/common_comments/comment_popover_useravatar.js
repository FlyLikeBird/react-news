import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Avatar, List, Card, Popover, Icon, Steps } from 'antd';

import { parseDate, formatDate } from '../../../utils/translateDate';
import { levelArr, formatLevel } from '../../../utils/translateUserLevel';

const { Meta } = Card;
const { Step } = Steps;

export default class CommentPopoverUserAvatar extends React.Component{
  constructor(){
    super();
    this.state = {
      user:{},
      followStatus:0   
    }
  }

  _loadUserInfo(props){
      var { user } = props;
      fetch(`/api/usr/getUserInfo?user=${user}`)
        .then(response=>response.json())
        .then(json=>{
          var data = json.data; 
          var { userFollows, userFans } = data;
          var followStatus = 0;
          //  0-未关注 1-已关注 2-互相关注
          var userid = localStorage.getItem('userid');
          if (userFans.includes(userid)){
              if (userFollows.includes(userid)){
                  followStatus = 2;
              } else {
                  followStatus = 1;
              }
          } 
          this.setState({user:data, followStatus})       
          
        })
  }

  componentDidMount(){
      this._loadUserInfo(this.props);
  }

  componentWillReceiveProps(newProps){
    if (this.props.user != newProps.user ) {
        this._loadUserInfo(newProps);
    }
  }

  handleAddFollow(id){
    fetch(`/api/usr/addFollow?userid=${localStorage.getItem('userid')}&followId=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({followStatus:1});
      })
  }

  handleRemoveFollow(id){
    fetch(`/api/usr/removeFollow?userid=${localStorage.getItem('userid')}&followId=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({followStatus:0})
      })
  }

  render(){
    var { user, followStatus } = this.state;
    var { username, userImage, userFollows, userFans, description, level, _id } = user;
    var totalLevel = formatLevel(level);
    
    var isSelf = localStorage.getItem('userid') == _id ? true : false;
    const levelStyle = {
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      backgroundColor:'rgba(24,144,255,.2)',
      borderRadius:'10px',
      transform:'scale(0.8)'
    };

    const content = (
            <div>
              <p>每次发表评论 <span style={{color:'#1890ff'}}>+5</span> 积分 ,点赞评论 <span style={{color:'#1890ff'}}>+1</span> 积分</p>
              <p>有热门评论 <span style={{color:'#1890ff'}}>+30</span> 积分 </p>
              <Steps progressDot size="small" current={totalLevel.levelNum}>
                 {
                  levelArr.map((level,index)=>{

                    return <Step key={index} title={`${level.text}`} description={`需要等级 ${index}`} />
                  })
                 }
              </Steps>,
            </div>
          );
    
    const followContent = followStatus === 0 
                          ?
                          <div onClick={this.handleAddFollow.bind(this,_id)}><Icon type="plus" />关注</div>
                          :
                          followStatus === 1
                          ?
                          <div style={{backgroundColor:'#eaeaea',color:'#3e3d3d'}} onClick={this.handleRemoveFollow.bind(this,_id)}><Icon type="check" />已关注</div>          
                          :
                          <div style={{backgroundColor:'#eaeaea',color:'#3e3d3d'}} onClick={this.handleAddFollow.bind(this,_id)}><Icon type="plus" />互相关注</div>
    return (
      
      <Card className="popover-card" bordered={false}>
          {
              _id
              ?
              <div>
                  <div className="popover-card-imgContainer">
                      <img src={userImage} />
                  </div>
                  <div>
                      <div><h3 style={{margin:'0'}}>{username}</h3></div>
                      <div className="user-level-rightTop">
                          <div><span style={ levelStyle } ><span className="num">{level?totalLevel.levelNum:0}</span><span style={{marginRight:'10px'}} className="ant-text">{ levelArr[level?totalLevel.levelNum:0].text } <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover></span></span></div>           
                      </div>
                      <div className="user-text-container">
                        <span className="ant-text">签名: {description}</span>
                      </div>
        
                      <div className="user-follow-container">
                        <div className="user-follow">
                          <p><span style={{color:'#000'}} className="ant-text">关注者</span></p>
                          <p><span> {userFollows?userFollows.length:0} </span></p>
                        </div>
                        <div className="user-fans">
                          <p><span style={{color:'#000'}} className="ant-text">追随者</span></p>
                          <p><span>{ userFans?userFans.length:0}</span></p>
                        </div>
                      </div>                      
                      {
                          isSelf
                          ?
                          <div className="user-bottom-container">
                          
                            <div>
                              <Link to={`/usercenter/${_id}`}><Icon type="idcard"/>我的空间</Link>
                            </div>
            
                          </div>
                          :
                          <div className="user-bottom-container">
                            { followContent }
                            <div>
                              <Link to={`/usercenter/${_id}`}><Icon type="idcard"/>TA的空间</Link>
                            </div>
            
                          </div>
                      }
                      
                  </div>
              </div>
              :
              <p>该用户不存在!</p>
          }
                   
      </Card>
  
    )
    
  }
}



