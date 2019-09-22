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
      isFollowed:false,
      isSelf:false     
    }
  }

  componentDidMount(){
    var { user } = this.props;
    fetch(`/usr/getUserInfo?user=${user}&localUser=${localStorage.getItem('username')}`)
      .then(response=>response.json())
      .then(json=>{
        var data = json.data; 
        var isSelf = localStorage.getItem('username')=== user ? true : false;
        this.setState({user:data,isSelf})       
        
      })
  }

  componentWillReceiveProps(newProps){
    var { user } = newProps;
    if (this.props.user != user ) {
        fetch(`/usr/getUserInfo?user=${user}&localUser=${localStorage.getItem('username')}`)
          .then(response=>response.json())
          .then(json=>{
            var data = json.data; 
            var isSelf = localStorage.getItem('username')=== user ? true : false;
            this.setState({user:data,isSelf})       
            
           }) 
    }
  }

  handleAddFollow(id){
    fetch(`/usr/addFollow?username=${localStorage.getItem('username')}&follow=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:1});
      })
  }

  handleRemoveFollow(id){
    fetch(`/usr/removeFollow?username=${localStorage.getItem('username')}&follow=${id}`)
      .then(response=>response.json())
      .then(data=>{
        this.setState({isFollowed:0})
      })
  }

  render(){
    
    var { username, userImage, userFollow, userFans, description, level, id, status } = this.state.user;
    var { isSelf } = this.state;
    var totalLevel = formatLevel(level);
    
    const levelStyle = {
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      width:'100px',
      height:'20px',
      backgroundColor:'rgba(24,144,255,.2)',
      borderRadius:'10px'
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
    
    const followContent = status === 0 
                          ?
                          <div onClick={this.handleAddFollow.bind(this,id)}><Icon type="plus" />关注</div>
                          :
                          status === 1
                          ?
                          <div style={{backgroundColor:'#eaeaea',color:'#3e3d3d'}} onClick={this.handleRemoveFollow.bind(this,id)}><Icon type="check" />已关注</div>          
                          :
                          <div style={{backgroundColor:'#eaeaea',color:'#3e3d3d'}} onClick={this.handleAddFollow.bind(this,id)}><Icon type="plus" />互相关注</div>
    return (
      
      <Card className="popover-card" bordered={false}>
          {
              username && id
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
        
                      <div className="user-follow-container" style={{marginTop:'10px',marginLeft:'0'}}>
                        <div className="user-follow">
                          <p><span style={{color:'#000'}} className="ant-text">关注者</span></p>
                          <p><span> {userFollow?userFollow.length:0} </span></p>
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
                              <Link to={`/usercenter/${id}`}><Icon type="idcard"/>我的空间</Link>
                            </div>
            
                          </div>
                          :
                          <div className="user-bottom-container">
                            { followContent }
                            <div>
                              <Link to={`/usercenter/${id}`}><Icon type="idcard"/>TA的空间</Link>
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



