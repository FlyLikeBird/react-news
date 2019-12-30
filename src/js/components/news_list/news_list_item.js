import React from 'react';
import { Button } from 'antd';
import { parseDate, formatDate, translateType } from '../../../utils/translateDate';

import style from './news-list-style.css';
export default class NewsListItem extends React.Component {
  
  markKeyWords(content){
    var { location, forMobile, params } = this.props;
    var result = '';
    if (location && content) {
      var search = location.search;
      var words;
      if (forMobile && params){
          words = params;
      } else {
          words = search.match(/words=(.*)/)[1];
      }
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

  handleGotoDetail(id){
      var { noLink, history } = this.props;
      if (noLink) return;
      if ( history) {
          history.push(`/details/${id}`)
      }
  }

  render(){
    var { data, hastime, hasImg, forSimple, forSearch, hasSearchContent } = this.props;
    var { viewtime, _id, auth, newstime, content, thumbnails, title, type } = data;
    return (

        
              <div ref={newsItem=>this.container = newsItem} onClick={this.handleGotoDetail.bind(this,_id)} className={forSimple?`${style['news']} ${style['forSimple']}`:forSearch ?`${style['news']} ${style['forSearch']}` : style['news']}>
            
                  {
                      hasImg && thumbnails
                      ? 
                      <div className={style['news-img']} style={{backgroundImage:`url(${thumbnails[0]})`}}></div>
                      : 
                      null 
                  }
                   <div className={style['news-body']}>
                          <div className={style['news-title']}>
                               <span>{title}</span>
                          </div>
                          {
                              hasSearchContent 
                              ?
                              <div className={style['news-content']}>
                                <div dangerouslySetInnerHTML={{__html:this.markKeyWords(content)}}></div>
                              </div>
                              :
                              null
                          }
      
                        <div>               
                          <span className={style.text}>发布时间: <span className={style.mark}>{newstime}</span></span>
                          { forSearch ? null : <br /> }
                          <span className={style.text}>来源: <span className={style.mark}>{auth}</span></span>
                          <span className={style.text}>类型: <span className={style.mark}>{type}</span></span>
                        </div>                       
                    </div>                  
              </div>
    )
  }
}
