import React from 'react';
import { Button, Icon, Popover } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';
import TopicItemPopover from './topic_item_popover';
import CommentPopoverUserAvatar from '../common_comments/comment_popover_useravatar';
export default class TopicListInnerItem extends React.Component {
  
  constructor(){
      super();
      this.state = {
          followIcon:'caret-left',
          shareIcon:'caret-left' 
      }
  }

  handleGotoDetail(id){
      var { noLink, history } = this.props;
      if (!noLink && history) {
          history.push(`/details/${id}`)
      }
  }

  handleChangeIcon(type,visible){
        if (visible===true){
            if (type=='follow') {
                this.setState({followIcon:'caret-down'})
            } else {
                this.setState({shareIcon:'caret-down'})
            }
        } else {
            if ( type =='follow'){
                this.setState({followIcon:'caret-left'})
            } else {
                this.setState({shareIcon:'caret-left'})
            }
        }
  }

  render(){
    var { data, hasImg, forSimple } = this.props;
    var { followIcon, shareIcon } = this.state;
    var { date, view, description, follows, images, shareBy, replies, tags, _id, title, user } = data;
  
    return (

        
              <div ref={newsItem=>this.container = newsItem} onClick={this.handleGotoDetail.bind(this,_id)} className={forSimple?'news forSimple':forSearch ?'news forSearch' : 'news'}>
                  
                  {
                      images && images.length
                      ? 
                      <div className="news-img" style={{backgroundImage:`url(${images[0]})`}}></div>
                      : 
                      <div className="news-img"><div className="default-topic-bg"><span className="icon"><Icon type="number"/></span></div></div>
                  }
                   <div className="news-body">
                        <div className="news-title">
                             <span>{title}</span>
                        </div>
                        <div className="tags-container">
                            {
                               tags && tags.length
                               ?
                               tags.map((item,index)=>(
                                  <span key={index}>{item.tag}</span>
                               ))
                               :
                               null
                            }
                        </div>
                                     
                        <div style={{display:'flex',alignItems:'center'}}>
                            <span className="text">{`发布时间: ${formatDate(parseDate(date))}`}</span>
                            <span className="text">发起人: </span>
                               
                                <Popover content={<CommentPopoverUserAvatar user={user?user.username:''}/>}>
                                      <span className='avatar-container'>
                                          <img src={user?user.userImage:''} />
                                      </span>
                                </Popover>
                            
                        </div>
                         
                        <div style={{display:'flex',alignItems:'center'}}>
                            <span className="text">{view}人浏览</span>
                            <span className="text">{replies?replies:0}人回复</span>                           
                            <Popover onVisibleChange={this.handleChangeIcon.bind(this,'follow')} content={<TopicItemPopover data={follows} text="关注" />} placement="bottom">
                                <span className="text">{`${follows?follows.length:0} 人关注`}<Icon type={followIcon}/></span>
                            </Popover>                       
                            <Popover onVisibleChange={this.handleChangeIcon.bind(this,'shareBy')} content={<TopicItemPopover data={shareBy} text="转发" forShare={true}/>} placement="bottom">
                                <span className="text">{`${shareBy?shareBy.length:0} 人转发`} <Icon type={shareIcon} /></span>
                            </Popover>
                        </div>
                        
                    </div>                   
              </div>        
    )
  }
}
