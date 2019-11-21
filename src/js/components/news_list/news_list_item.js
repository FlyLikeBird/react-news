import React from 'react';
import { Button } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';


export default class NewsListItem extends React.Component {
  constructor(){
      super();
      this.state = {
          item:{}
      }
  }
  
  handleRemoveHistory( articleId, e){
      e.stopPropagation();
      var { onDelete } = this.props;
      fetch(`/api/usr/removeHistory?userid=${localStorage.getItem('userid')}&uniquekey=${articleId}`)
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
                if (onDelete) onDelete(articleId);
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


  markKeyWords(content){
    var { location } = this.props;
    var result = '';
    if (location && content) {
      var search = location.search;
      
      var words = search.match(/words=(.*)/)[1];
      
      if (!words.match(/\s+/g)){
          //  单个关键词
          result = content.replace(new RegExp('('+words+')','g'),match=>'<span style="color:#1890ff">'+match+'</span>');
          //p.innerHTML = result;
      } else {
        //  多个关键词
        var multiWords = '';
        words = words.split(/\s+/);
        for(var i=0,len=words.length;i<len;i++){
          multiWords += words[i] + '|'
        }
        multiWords = multiWords.substring(0,multiWords.length-1);
        //console.log(multiWords);
        result = content.replace(new RegExp('('+multiWords+')','g'),match=>'<span style="color:#1890ff">'+match+'</span>');
       // p.innerHTML = result;
      }
      
    }
    return result;
    //console.log(result);
  }

  handleGotoDetail(articleId){
      var { noLink, history } = this.props;
      if ((!noLink) && history) {
          history.push(`/details/${articleId}`)
      }
  }

  render(){
    var { item, hastime, hasImg, forSimple, forSearch, hasSearchContent } = this.props;
    var { viewtime, articleId, auth, newstime, content, thumbnails, title, type } = item;
  
    return (

        
              <div ref={newsItem=>this.container = newsItem} onClick={this.handleGotoDetail.bind(this,articleId)} className={forSimple?'news forSimple':forSearch ?'news forSearch' : 'news'}>
                  { 
                      hastime 
                      ? 
                      <div style={{color:'#1890ff',margin:'0 10px'}} dangerouslySetInnerHTML={{__html:this.translateTimeFormat(viewtime)}}></div> 
                      : 
                      null 
                  }
                  {
                      hasImg && thumbnails
                      ? 
                      <div className="news-img" style={{backgroundImage:`url(${thumbnails[0]})`}}></div>
                      : 
                      null 
                  }
                   <div className="news-body">
                          <div className="news-title">
                               <span>{title}</span>
                          </div>
                          {
                              hasSearchContent 
                              ?
                              <div className="news-content">
                                <div dangerouslySetInnerHTML={{__html:this.markKeyWords(content)}}></div>
                              </div>
                              :
                              null
                          }
      
                        <div>               
                          <span className="text">发布时间: <span className="mark">{newstime}</span></span>
                          { forSearch ? null : <br /> }
                          <span className="text">来源: <span className="mark">{auth}</span></span>
                          <span className="text">类型: <span className="mark">{type}</span></span>
                        </div>
                        
                    </div>
                    {
                          hastime
                          ?
                          <Button size="small" className="button" onClick={this.handleRemoveHistory.bind(this, articleId)} shape="circle" icon="close"/>
                          :
                          null
                    } 
              </div>
              
        
    )
  }
}
