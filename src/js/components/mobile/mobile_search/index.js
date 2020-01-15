import React from 'react';
import { Form, Input, Select, Icon, message } from 'antd';
import NewsBlock from '../../news_block';
import SearchContent from './mobile_search_content';
import SearchResult from './mobile_search_result';
import style from './mobile_search_style.css';

const arr = [{title:'赵丽颖'},{title:'美国'},{title:'中国'},{title:'拼娃之战'},{title:'个人素质'},{title:'歼20'}];

export default class MobileSearch extends React.Component {
    constructor(){
        super();
        this.state = {
            isLoading:true,
            hasResult:false,
            value:'',
            params:''
        }
    }

    handleSearch(){
      var { history, form, onClose, onUpdateSearchHistory  } = this.props;
      var { value } = this.state;
      if (!value || value.match(/^\s+$/)){
          message.info('关键词不能为空~');
          return ;
      } else {
          // 去掉首尾多余空格
          var pattern = /(^\s*)|(\s*$)/g;              
          var params = value.replace(pattern,'');                                         
          this.setState({hasResult:true, params})
          if (onUpdateSearchHistory) onUpdateSearchHistory(params);        
      }
      
    }

    componentDidMount(){
        setTimeout(()=>{
            var container = this.inputContainer;
            console.log(container);
            if (container){
                container.classList.add(style['motion']);
                var inputdom = container.getElementsByTagName('input')[0];
                //console.log(inputdom);
                inputdom.focus();
            }
        },0)
    }

    handleInputChange(e){
        var value = e.target.value;
        this.setState({value})
    }

    handleTitleSearch(title){
        var { onUpdateSearchHistory } = this.props;
        this.setState({value:title, params:title, hasResult:true});
        if (onUpdateSearchHistory) onUpdateSearchHistory(title);
    }

    handleClearInput(){
        this.setState({value:'', hasResult:false});
    }

    handleClose(){
        var { history } = this.props;
        if (history) history.goBack();
    }

    componentWillUnmount(){
        this.inputContainer = null;
    }

    render() {
        var { history, location, socket, searchHistory, onUpdateSearchHistory } = this.props;
        var { hasResult, params, value } = this.state;
        return (
          <div className={style['search-page']}>
              <div className={style['search-header']}>
                  <span ref={input=>this.inputContainer=input} className={style['search-input']}>
                      <Input 
                         ref={input=>this.input=input} 
                         onChange={this.handleInputChange.bind(this)}
                         value={value}
                         suffix={
                             <span>
                                 { value ? <Icon type="close-circle" theme="filled" style={{color:'#ccc',margin:'0 10px'}} onClick={this.handleClearInput.bind(this)}/> : null}
                                 <Icon type="search" onClick={this.handleSearch.bind(this)}/>                            
                             </span>
                         }
                         onPressEnter={this.handleSearch.bind(this)} 
                       />
                  </span>
                  <span className={style['close-button']} onClick={this.handleClose.bind(this)}>取消</span>
              </div>
              <div className={style['search-body']}>
                  {
                      hasResult
                      ?
                      <SearchResult params={params} history={history} location={location} socket={socket}/>
                      :
                      <SearchContent onSearch={this.handleTitleSearch.bind(this)} searchHistory={searchHistory} onUpdateSearchHistory={onUpdateSearchHistory}/>
                  }
              </div>             
          </div>
            
        )
    }

}










