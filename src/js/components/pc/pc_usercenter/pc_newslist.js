import React from 'react';

import {  List, Avatar, Button, Icon, Card } from 'antd';
import { Link } from 'react-router-dom';

import DeleteModal from '../../deleteModal';
import { parseDate, formatDate, translateType } from '../../../../utils/translateDate';

export class NewsListItem extends React.Component {
  constructor(){
      super();
      this.state = {
          item:{}
      }
  }
  

  handleRemoveHistory(articleId,contentId){
      var { forCollect, collectId } = this.props;

      if (forCollect){
        fetch(`/api/collect/removeCollectContent?collectId=${collectId}&contentId=${contentId}&user=${localStorage.getItem('username')}`)
          .then(response=>response.json())
          .then(json=>{
              var data = json.data;
              if (this.props.onAddCollect){
                this.props.onAddCollect(data);
              }
          })
      } else {
          if(this.props.onVisible){
              this.props.onVisible(true,articleId);
          }
        
      }
      
  }
  
  translateTimeFormat(viewtime){
    var time = formatDate(parseDate(viewtime))
    //console.log(time);
    var formatArr = time.split(/\s+/);
    //console.log(formatArr);
    return formatArr[0]+'<br/>' + '<span style="color:black">'+formatArr[1]+'</span>';
  }

  componentDidMount(){
      var { uniquekey, noFetch, item } = this.props;
      if (uniquekey && !noFetch){
          fetch(`/api/article/getArticleContent?uniquekey=${uniquekey}`)
                .then(response=>response.json())
                .then(json=>{
                    var data= json.data;
                    this.setState({item:data});
                })
      } else {
          this.setState({item})
      }    
  }

  componentWillReceiveProps(newProps){
      var { forSimple } = this.props;
      if ( !forSimple && (this.props.item.articleId != newProps.item.articleId)) {
          this.setState({item:newProps.item});
      }
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
      console.log(noLink);
      if ((!noLink) && history) {

          history.push(`/details/${articleId}`)
      }
  }

  render(){
    var { item } = this.state;
    var { hastime, hasImg, forSimple, forSearch, hasSearchContent } = this.props;
    var { viewtime, articleId, auth, newstime, content, thumbnails, title, type } = item;
  
    return (

        <div onClick={this.handleGotoDetail.bind(this,articleId)} className={forSimple?'news forSimple':forSearch ?'news forSearch' : 'news'}>
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
                  <div className="news-img">
                    <img src={thumbnails[0]} />
                  </div> 
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
                    {
                      hastime
                      ?
                      <Button size="small" className="button" onClick={this.handleRemoveHistory.bind(this,articleId)} shape="circle" icon="close"/>
                      :
                      null
                    }
                    
                    
              </div>
                
        </div>
    )
  }
}

export default class NewsList extends React.Component{
  constructor(){
    super();
    this.state={
      list:[],
      visible:false,
      deleteId:''
    }
  }
 
  componentDidMount(){
      var { data } = this.props;
      this.setState({list:data});
  }

  componentWillReceiveProps(newProps){
    //  搜索页面的新闻列表当页码变化时强制更新
    var { forSearch, data } = this.props;
    if ( forSearch ) {
        this.setState({list:newProps.data});
        return ;
    } 
    if ( data.length != newProps.data.length) {
        this.setState({list:newProps.data})
    }
  }
  
  handleCleanHistory(){
      fetch(`/api/usr/cleanHistory?userid=${localStorage.getItem('userid')}`)
        .then(response=>response.json())
        .then(json=>{
          this.setState({list:[]})
        })
  }

  handleModalVisible(boolean,deleteId){
    this.setState({visible:boolean,deleteId});
  }
  
  handleDelete(){
    var { deleteId, list } = this.state;
    var data = [...list];
    var deleteIndex = 0;
    for(var i=0,len=list.length;i<len;i++){
        if(list[i].articleId === deleteId){
            deleteIndex = i;
            break;
        }
    }
    data.splice(deleteIndex,1);
    this.setState({list:data})
  }

  render(){
    var { hasImg, hastime, hasSearchContent, location, history, text, forSimple, forUser, forSearch } = this.props;
    var { list, visible, deleteId } = this.state;


    return(    
      
      <div style={{textAlign:'left'}}>
          {
              list.length
              ?
              <div>
                {
                    forUser
                    ?
                    <Button size="small" style={{fontSize:'12px'}} onClick={this.handleCleanHistory.bind(this)}>全部删除</Button>
                    :
                    null
                    
                }           
                {
                    
                    list.map((item,index)=>(
                        <NewsListItem 
                            item={item} 
                            key={index}
                            forSimple={forSimple}
                            forSearch={forSearch}
                            history={history}
                            hastime={hastime}
                            hasImg={hasImg}
                            location={location}
                            hasSearchContent={hasSearchContent} 
                            onVisible={this.handleModalVisible.bind(this)}
                        />
                    ))
                    
                }
                {
                    hastime && visible
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={deleteId} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="news"
                        forNews={true}
                    />
                    :
                    null
                }
              </div>
              :
              <div style={{margin:'20px 0'}}>{text}</div> 
          }
      </div>    
      
      
    )
  }
}


