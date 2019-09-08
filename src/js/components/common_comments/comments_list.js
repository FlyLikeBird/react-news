import React from 'react';
import { Modal } from 'antd';
import CommentComponent from './comment_component';

export default class CommentsList extends React.Component {

  constructor(){
    super();
    this.state = {
      comments:[]
    }
  }
  
  componentDidMount(){
      var { comments } = this.props;
      this.setState({comments});
  }
  
  componentWillReceiveProps(newProps){
      var { comments } = newProps;
      this.setState({comments})
  }

  render(){
    var { comments, visible, commentid ,parentcommentid } = this.state;
    //  shareType 字段表示分享的内容类型 ，toId 字段表示分享的内容标识
    var {  isSub, socket, history, commentid, onUpdateFromSub, forUser, grayBg, onDelete, hasDelete, onVisible, text } = this.props;
    let commentsClassName = isSub ? 'subcommentsContainer':'commentsContainer';
    
    return(
        <div>
          {
              comments.length
              ?
              <div className={commentsClassName}>
                  {
                      comments.map((comment,index)=>(
                        <CommentComponent 
                            socket={socket} 
                            history={history}
                            index={index} 
                            onUpdateFromSub={onUpdateFromSub} 
                            isSub={isSub}
                            comment={comment} 
                            parentcommentid={commentid}
                            onVisible={onVisible}
                            key={index}
                            grayBg={grayBg} 
                            forUser={forUser} 
                            hasDelete={Boolean(hasDelete)}
                            onDelete={onDelete}
                        />
                      ))

                  }                    
              </div>
              :
              <div>{text}</div>
          }
        </div>    
    )
  }
}



