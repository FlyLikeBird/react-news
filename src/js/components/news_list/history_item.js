import React from 'react';
import { Button } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';


export default class HistoryItem extends React.Component {
  
  handleRemoveHistory( historyId, e){
      e.stopPropagation();
      var { onDelete } = this.props;
      var userid = localStorage.getItem('userid');
      fetch(`/api/usr/removeHistory?userid=${userid}&uniquekey=${historyId}`)
        .then(response=>response.json())
        .then(data=>{
            var newsItem;
            if (this.container){
                newsItem = this.container;
            }
            if ( newsItem && newsItem.classList){
                newsItem.classList.add('motion')
            }
            setTimeout(()=>{
                if (onDelete) onDelete(historyId);
                newsItem.classList.remove('motion');
            },500)
        })  
  }
  
  translateTimeFormat(viewtime){
    var time = formatDate(parseDate(viewtime))
    //console.log(time);
    var formatArr = time.split(/\s+/);
    //console.log(formatArr);
    return formatArr[0]+'<br/>' + '<span style="color:black">'+formatArr[1]+'</span>';
  }


  
  handleGotoDetail(id){
      var { noLink, history } = this.props;
      if (!noLink && history) {
          history.push(`/details/${id}`)
      }
  }

  render(){
    var { data, hastime, hasImg, forSimple } = this.props;
    var { _id, viewtime, articleId } = data;
    var { auth, newstime, thumbnails, title, type } = articleId;
  
    return (

        
              <div ref={newsItem=>this.container = newsItem} className="news">                   
                  <div style={{color:'#1890ff',margin:'0 20px'}} dangerouslySetInnerHTML={{__html:this.translateTimeFormat(viewtime?viewtime:'')}}></div> 
                      
                  {
                      hasImg && thumbnails
                      ? 
                      <div className="news-img" style={{backgroundImage:`url(${thumbnails[0]})`}}></div>
                      : 
                      null 
                  }
                   <div className="news-body">
                          <div onClick={this.handleGotoDetail.bind(this,articleId._id)}  className="news-title">
                               <span>{title}</span>
                          </div>
                          
                        <div>               
                          <span className="text">发布时间: <span className="mark">{newstime}</span></span>
                          <br />
                          <span className="text">来源: <span className="mark">{auth}</span></span>
                          <span className="text">类型: <span className="mark">{type}</span></span>
                        </div>
                        
                    </div>
                    <Button size="small" className="button" onClick={this.handleRemoveHistory.bind(this, _id)} shape="circle" icon="close"/>
                          
              </div>
              
        
    )
  }
}
