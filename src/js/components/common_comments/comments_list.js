import React from 'react';
import { Modal } from 'antd';
import CommentComponent from './comment_component';

export default class CommentsList extends React.Component {

  render(){
    
    var {  comments, isSub, socket, history, commentid, onUpdateFromSub, forUser, forMsg, forTrack, grayBg, onDelete, hasDelete, onVisible, onShowList, onSetScrollTop, warnMsg } = this.props;
    var commentsClassName = isSub ? 'subcommentsContainer':'commentsContainer';
   
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
                            onShowList={onShowList}
                            onSetScrollTop={onSetScrollTop} 
                            isSub={isSub}
                            comment={comment}
                            parentcommentid={commentid}
                            onVisible={onVisible}
                            key={index}
                            grayBg={grayBg} 
                            forUser={forUser}
                            forMsg={forMsg} 
                            forTrack={forTrack}
                            hasDelete={Boolean(hasDelete)}
                            onDelete={onDelete}
                            
                        />
                      ))

                  }                    
              </div>
              :
              <div>{warnMsg}</div>
          }
        </div>    
    )
  }
}



