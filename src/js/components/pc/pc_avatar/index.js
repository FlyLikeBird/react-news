import  React  from 'react';
import { Card, Icon, Avatar, Input, Modal, Badge, Progress, Popover, Steps } from 'antd';
import ImgContainer from '../../img_container';
import PicturesWall from './pc_usercenter_upload';
import style from './avatar.style.css';
const { Meta } = Card;
const { Step } = Steps;

import { levelArr, formatLevel } from '../../../../utils/translateUserLevel';
import { parseDate, formatDate } from '../../../../utils/translateDate';

export default class PCUserAvatar extends React.Component {
  constructor(props){
    super();
    this.state = {
      visible:false,
      isEdit:false,
      imgUrl:'',
      description:'',
      levelRemain:0,
      levelNum:0
    }
  }

  componentWillMount(){
    var  { user } = this.props;
    var { description, level, userImage } = user;
    var levelObj = formatLevel(level);
    this.setState({description:description,imgUrl:userImage,levelRemain:levelObj.remain,levelNum:levelObj.levelNum})
  }

  handleEdit(){
    this.setState({isEdit:true});
  }

  componentDidUpdate(){
    var inputComponent = this.input;
    if (inputComponent && inputComponent.input){
        inputComponent.input.focus();
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
        this.setState({description:data,isEdit:false});
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

  componentWillUnmount(){
    this.input = null;
  }

  render(){
    var { user, isSelf } = this.props;
    var { username, level, registerTime, userFans, userFollows } = user;
    var { visible, imgUrl, description, isEdit, levelRemain, levelNum  } = this.state;
  
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
                    <Input ref={input=>this.input=input} onBlur={this.handleBlur.bind(this)} onChange={this.handleInputChange.bind(this)} value={description}/>
                    :
                    <span>{description}</span>;

    return (
      <div>
        <div className={style['container']}>
            <ImgContainer bg={imgUrl} single={true} />
            <div style={{display:'flex',alignItems:'flex-start',padding:'20px'}}>
                <div className={style['avatar-container']}><img src={imgUrl} /></div>
               
                <div className={style['info-container']}>
                    <div><span className={style.fontStyle}>{username}</span></div>
                    <div><span className={style.text}>创建时间:  {formatDate(parseDate(registerTime))}</span></div>
                    <div><span className={style.text}>用户等级:  {levelNum}</span></div>
                    <div><span className={style.text}>签名:  { descriptionContent }</span></div>
                    <div className={style['follow']}>
                        <div>
                            <span className={style.fontStyle}>关注者</span>
                            <br/>
                            <span>{userFollows?userFollows.length:0}</span>
                        </div>
                        <div>
                            <span className={style.fontStyle}>追随者</span>
                            <br/>
                            <span>{userFans?userFans.length:0}</span>
                        </div>
                    </div>
                    <div>
                      <div><span className={style['user-level']}><span className={style.num}>{levelNum}</span><span style={{marginRight:'10px'}}>{ levelArr[levelNum].text } <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover></span></span></div>
                      <div><Progress size="small" percent={levelRemain} /></div>
                    </div>
                </div>
            </div>
            {
                isSelf
                ?
                <div className={style['action']}>
                  <div onClick={this.handleChangeAvatar.bind(this)} ><Icon type="picture" /></div>
                  <div onClick={this.handleEdit.bind(this)}><Icon type="edit" /></div>
                </div>
                :
                null
            }
        </div>
        
        
        <Modal className="user-avatar" visible={visible} footer={null} onCancel={this.handleModalCancel.bind(this)} maskClosable={true}>         
            <PicturesWall onModalVisible={this.handleModalCancel.bind(this)} onChangeImgUrl={this.handleChangeImgUrl.bind(this)}/>
        </Modal>

      </div>
    )
  }
}
  
  