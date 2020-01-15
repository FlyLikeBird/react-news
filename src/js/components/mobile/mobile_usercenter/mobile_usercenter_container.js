import React from 'react';
import { Icon, Badge, Progress, Popover, Steps } from 'antd';
import { formatDate, parseDate } from '../../../../utils/translateDate';
import { levelArr, formatLevel } from '../../../../utils/translateUserLevel';

const { Step } = Steps;
import style from './mobile_usercenter_style.css';

export default class MobileUserContainer extends React.Component {

    handleGotoUserDetail(type,text){
        var { history, isSelf, user } = this.props;
        if (history){
            var params = { text, type, isSelf, currentUser:user._id};
            history.push(`/usercenterDetail`,params);
        } 
    }

    render(){
        var { user, isSelf } = this.props;
        var { username, _id, userImage, userFollows, userFans, level, description, registerTime } = user;
        var level = formatLevel(level);

        const content = (
            <div>
              <p>每次发表评论 <span style={{color:'#1890ff'}}>+5</span> 积分 ,点赞评论 <span style={{color:'#1890ff'}}>+1</span> 积分</p>
              <p>有热门评论 <span style={{color:'#1890ff'}}>+30</span> 积分 </p>
              <Steps progressDot size="small" current={level.levelNum}>
                 {
                      levelArr.map((level,index)=>{
                          return <Step key={index} title={`${level.text}`} description={`需要等级 ${index}`} />
                  })
                 }
              </Steps>,
            </div>
          );

        return (
                   
                <div style={{height:'100%',backgroundColor:'#f7f7f7'}}>                                       
                    <div className={style['header']} style={{backgroundImage:`url(${userImage})`}}></div>
                    <div className={style['info-container']}>
                        <div className={style['avatar-container']} >
                            <div className={style['avatar']} style={{backgroundImage:`url(${userImage})`}}></div>
                            { isSelf ? <span className={style['avatar-button']}><Icon type="setting" theme="filled" style={{color:'#fff'}}/></span> : null }
                        </div>
                        <div className={style['info']}>
                            <div><span className={style.fontStyle}>{username}</span></div>
                            <div><span className={style.text}>创建时间:  {formatDate(parseDate(registerTime))}</span></div>
                            <div><span className={style.text}>用户等级:  <span className={style['user-level']}><span className={style.num}>{level.levelNum}</span><span style={{marginRight:'10px'}}>{ levelArr[level.levelNum].text } <Popover trigger="hover" content={content}><Icon type="question-circle"/></Popover></span></span></span></div>
                            <div><span className={style.text}>签名:  { description }</span></div>                            
                            <div><Progress size="small" percent={level.levelRemain} /></div>                     
                        </div>
                    </div>
                    <div className={style['section-container']}>
                    </div>
                    <div className={style['list']}>
                        <ul>
                            <li onClick={this.handleGotoUserDetail.bind(this,'action', isSelf?'我的动态':'TA的动态')}><Icon type="share-alt" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}动态`}<Icon type="right" className={style['icon']}/></li>
                            <li onClick={this.handleGotoUserDetail.bind(this,'follow', isSelf?'我的关注':'TA的关注')}><Icon type="container" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}关注`}<Icon type="right" className={style['icon']}/></li>
                            <li onClick={this.handleGotoUserDetail.bind(this,'fans', isSelf?'我的粉丝':'TA的粉丝')}><Icon type="usergroup-add" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}粉丝`}<Icon type="right" className={style['icon']}/></li>
                            <li onClick={this.handleGotoUserDetail.bind(this,'collect', isSelf?'我的收藏':'TA的收藏')}><Icon type="book" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}收藏`}<Icon type="right" className={style['icon']}/></li>
                            <li onClick={this.handleGotoUserDetail.bind(this,'topic', isSelf?'我的话题':'TA的话题')}><Icon type="message" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}话题`}<Icon type="right" className={style['icon']}/></li>
                            { isSelf ? <li onClick={this.handleGotoUserDetail.bind(this,'comment', '我的评论')}><Icon type="file-search" style={{color:'#1890ff'}} />我的评论<Icon type="right" className={style['icon']}/></li> : null }
                            { isSelf ? <li onClick={this.handleGotoUserDetail.bind(this,'history', '浏览记录')}><Icon type="file-search" style={{color:'#1890ff'}} />浏览记录<Icon type="right" className={style['icon']}/></li> : null }
                            <li><Icon type="file-search" style={{color:'#1890ff'}} />{ `${isSelf?'我的':'TA的'}信息`}<Icon type="right" className={style['icon']}/></li>
                            

                        </ul>
                    </div>
                </div>
            
        )
    }
}





