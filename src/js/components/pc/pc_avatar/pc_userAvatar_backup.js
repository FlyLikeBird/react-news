import  React  from 'react';
import { Card, Icon, Avatar, Input, Modal, Badge, Progress, Popover, Steps } from 'antd';

import PicturesWall from './pc_usercenter_upload';

const { Meta } = Card;
const { Step } = Steps;

import { levelArr, formatLevel } from '../../../../utils/translateUserLevel';
import { parseDate, formatDate } from '../../../../utils/translateDate';

export default class PCUserAvatar extends React.Component {
  constructor(props){
    super();
    this.state = {
      visible:false,
      previewVisible:false,
      isEdit:false,
      imgUrl:'',
      description:'',
      levelRemain:0,
      levelNum:0
    }
  }

  componentDidMount(){
    var  { user } = this.props;
    var { description, level, userImage } = user;
    var levelObj = formatLevel(level);
    this.setState({description:description,imgUrl:userImage,levelRemain:levelObj.remain,levelNum:levelObj.levelNum})
  }

  handleEdit(){
    this.setState({isEdit:true});
  }

  componentDidUpdate(){
    var input = this.refs.inputDescription;
    //console.log(input);
    if (input && input.nodeName == 'INPUT'){
      input.focus();
    }
  
  }

  handleInputChange(e){
    var value = e.target.value;
    this.setState({description:value})
  }

  handleBlur(){
    var { description } = this.state;
    fetch(`/api/usr/editSign?userid=${localStorage.getItem('userid')}&description=${description}`)
      .then(response=>response.json())
      .then(json=>{
        var data = json.data;
        console.log(data);
        this.setState({description,isEdit:false});
      })
  }

  handleChangeAvatar(){
    this.setState({visible:true})
  }

  handleModalCancel(){
    this.setState({visible:false,previewVisible:false})
  }

  
  handleChangeImgUrl(imgUrl){
    this.setState({imgUrl})
  }

  handleImgPreview(){
    //console.log('hello');
    this.setState({previewVisible:true})
  }

  handleMouseOver(e){
    //当内部有嵌套结构时处理onmouseover onmouseout事件
    var imgMask = this.refs.maskContainer;
    var inner = e.toElement || e.relatedTarget;
    //console.log(inner);
    if (!imgMask.contains(inner)){

      if ( imgMask.style.opacity == 0) {
       //imgMask.style.display = 'block';
       imgMask.style.opacity = 1;
      } else {
        //imgMask.style.display = 'none';
        imgMask.style.opacity = 0;
      }

    } else {
      return ;
    }  
    
  }

 
  render(){
    var { user } = this.props;
    var { username, level, registertime, userFans, userFollows } = user;
    var { visible, previewVisible, imgUrl, description, isEdit, levelRemain, levelNum  } = this.state;
  
    const levelStyle = {
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      width:'100px',
      height:'20px',
      backgroundColor:'rgba(24,144,255,.2)',
      borderRadius:'10px'
    };

    const userImageMask = {
      position:'absolute',
      top:0,
      bottom:0,
      left:0,
      right:0,
      backgroundColor:'rgba(0,0,0,.3)',
      color:'rgba(255,255,255,.8)',
      lineHeight:'112px',
      textAlign:'center',
      fontSize:'16px',
      opacity :0,
      transition:'all 0.3s ease-out'
    };

    const badgeStyle = {
      color:'rgba(255,255,255,1)',
      backgroundColor:'#1890ff'
    };

    const iconStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: '-15px',      
      marginLeft: '-15px',
      fontSize: '30px'
    }

    const content = (
            <div>
              <p>每次发表评论 <span style={{color:'#1890ff'}}>+5</span> 积分 ,点赞评论 <span style={{color:'#1890ff'}}>+1</span> 积分</p>
              <p>有热门评论 <span style={{color:'#1890ff'}}>+30</span> 积分 </p>
              <Steps progressDot size="small" current={levelNum}>
                 {
                  levelArr.map((level,index)=>{

                    return <Step key={index} title={`${level.text}`} description={`需要等级 ${index}`} />
                  })
                 }
              </Steps>,
            </div>
          );

    const descriptionContent = isEdit ?
                    <span><Input ref="inputDescription" onBlur={this.handleBlur.bind(this)} onChange={this.handleInputChange.bind(this)} value={description}/></span>
                    :
                    <span>{description}</span>;

    return (
      <div>
        <Card className="user-container" cover={<div style={{position:'relative'}}><div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOver.bind(this)}  ref="maskContainer" style={userImageMask}><Icon onClick={this.handleImgPreview.bind(this)} type="eye" style={iconStyle}/></div><img style={{width:'100%'}} src={imgUrl} /></div>}
          actions={
            
            [<Icon onClick={this.handleChangeAvatar.bind(this)} type="picture"/>,<Icon type="edit" onClick={this.handleEdit.bind(this)}/>]
            
          }>
          <Meta
            avatar={<Avatar src={imgUrl} />}
            description={<div className="">
                    <div><span style={{color:'#000',fontWeight:'500'}}>{username}</span></div>
                    <div><span className="ant-text">创建时间:  {formatDate(parseDate(registertime))}</span></div>
                    <div><span className="ant-text">用户等级:  {levelNum}</span></div>
                    <div><span className="ant-text">签名:  { descriptionContent }</span></div>
                    <div className="user-follow-container" style={{marginTop:'20px',marginLeft:'0'}}>
                      <div className="user-follow">
                        <p><span style={{color:'#000'}} className="ant-text">关注者</span></p>
                        <p><span>{userFollows?userFollows.length:0}</span></p>
                      </div>
                      <div className="user-fans">
                        <p><span style={{color:'#000'}} className="ant-text">追随者</span></p>
                        <p><span>{userFans?userFans.length:0}</span></p>
                      </div>
                    </div>
                    <div className="user-level">
                      <div><span style={ levelStyle } ><span className="num">{levelNum}</span><span style={{marginRight:'10px'}} className="ant-text">{ levelArr[levelNum].text } <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover></span></span></div>
                      <div><Progress size="small" percent={levelRemain} /></div>
                    </div>

                    
                    
                  </div>
            }
            
          />
        </Card>
        <Modal className="user-avatar" visible={visible} footer={null} onCancel={this.handleModalCancel.bind(this)} maskClosable={true}>         
            <PicturesWall onModalVisible={this.handleModalCancel.bind(this)} onChangeImgUrl={this.handleChangeImgUrl.bind(this)}/>
        </Modal>

        <Modal className="user-preview" style={{background:'transparent'}} footer={null} visible={this.state.previewVisible} onCancel={this.handleModalCancel.bind(this)} maskClosable={true}>
              <img ref="previewImg" src={this.state.imgUrl} />
        </Modal>
      </div>
    )
  }
}
  
  