import React from 'react';
import { findDOMNode } from 'react-dom';
import { Pagination, Select, Spin } from 'antd';
import CommentsList  from './comments_list';
import CommentsInput from './comments_input';
import ShareModal from './comment_share_modal';

const { Option, OptGroup } = Select;

export default class CommentsListContainer extends React.Component{
  constructor(){
    super();
    this.state={
      comments:[],
      order:'time',
      total:0,
      value:'time',
      visible:false,
      text:'',
      translateData:[],
      isLoad:true    
    }
  }

  componentDidMount(){
    this._loadComments()
  }

  _loadComments(num=1,order='time'){
    //console.log(order);
    var { uniquekey, pageNum } = this.props;
    var finalPageNum = num;
    if (pageNum) finalPageNum = pageNum;
    var username = localStorage.getItem('username');
    //console.log(uniquekey);
    if (uniquekey){

      fetch(`/comment/getcomments?uniquekey=${uniquekey}&pageNum=${finalPageNum}&orderBy=${order}`)
      .then(response=>response.json())
      .then(data=>{
        var data = data.data;
        var { comments, total } = data;
  
        for(var i=0;i<comments.length;i++){
              if (comments[i].replies.length){
                comments[i].replies.sort((a,b)=>{
                   var time1 = Date.parse(a.date),time2 = Date.parse(b.date);
                    return time2 - time1;
                })
              }
              
        }       
        comments = comments.map(item=>{
            item['owncomment'] = username === item.username ? true : false;
            item.replies = item.replies.map(reply=>{
              reply['owncomment'] = reply.fromUser === username ? true : false;
              return reply;
            })
            return item;
        })
        
        this.setState({comments,total,isLoad:false});
      })
    }
    
    
 }

handlePageChange(num){
    this.setState({isLoad:true});
    this._loadComments(num,this.state.order);
}


handleSelectChange(value){
  //console.log(value);
  this.setState({order:value,isLoad:true});
  this.setState((state)=>{
    this._loadComments(1,state.order);
  })
 
}

handleAddComment(list){
  this.setState({comments:list,total:list.length})
}

handleShareVisible(boolean,commentid,parentcommentid){
    if (boolean === true){

      fetch(`/comment/getCommentInfo?commentid=${commentid}&parentcommentid=${parentcommentid?parentcommentid:''}`)
      .then(response=>response.json())
      .then(json=>{
          var text= json.data;
          var data = [];
          var pattern = /@([^:]+):([^@]+)/g;
          var result = pattern.exec(text);
          while(result){              
              data.push({
                username:result[1],
                content:result[2]
              });              
              result = pattern.exec(text);
          }     
              
          this.setState({visible:boolean,text,translateData:data})
      })    
    } else {
      this.setState({visible:boolean})
    }
}

render(){
  var { socket, uniquekey, hasCommentInput, text, shareType, history } = this.props;
  var { comments, total, value, visible, text, translateData, isLoad } = this.state;
  const dropdownStyle = {
    width:'160px',
    fontSize:'12px'
  }

  return (
      <div style={{paddingTop:'40px'}}>
        <div>            
            {
                comments.length 
                ?
                <div>
                    <span style={{fontSize:'12px'}}>{`共${total}条评论`}</span>
                    <Select className="filter" onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={value}  dropdownMatchSelectWidth={false}>
                      <OptGroup label="按时间">
                        <Option value="time">从近到远</Option>
                        <Option value="timeInvert">从远到近</Option>
                      </OptGroup>
                      <OptGroup label="按热度">
                        <Option value="hot">从高到低</Option>
                        <Option value="hotInvert">从低到高</Option>
                      </OptGroup>
                    </Select> 
                </div>     
                :
                null
            }     
        </div>
        

        {
          hasCommentInput
          ?
          <CommentsInput isAddComment socket={socket} uniquekey={uniquekey} onAddComment={this.handleAddComment.bind(this)}/>
          :
          null
        }
        {
           isLoad
           ?
           <Spin/>
           :
           <CommentsList isSub={false}  socket={socket} history={history} comments={comments} onVisible={this.handleShareVisible.bind(this)} text="还没有用户评论呢!快来抢沙发吧～" />
        }  
        
         
        {
          comments.length
          ?
          <Pagination style={{padding:'20px 0'}} size="small" showQuickJumper defaultPageSize={10} total={total} onChange={this.handlePageChange.bind(this)}/>
          :
          null
        }
        
        {
          visible
          ?
          <ShareModal 
              visible={visible} 
              toId={uniquekey}         
              onVisible={this.handleShareVisible.bind(this)} 
              text={text}
              data={translateData}
              shareType={shareType}
          />
          :
          null
        }
        
          
        
      </div>
      
      
    )
     
  }

}



