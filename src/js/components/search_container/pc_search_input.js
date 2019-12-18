import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Popover, Card } from 'antd';
import SearchComponent from './search_component';

import style from './search.style.css';
const arr = [{title:'赵丽颖'},{title:'美国'},{title:'中国'},{title:'拼娃之战'},{title:'个人素质'},{title:'歼20'}];

export default class SearchInput extends React.Component {

    constructor(props) {
      super();
      this.state = {
        visible:false,
        iconType:'search'
      }
    }

    handleRemoveHistory(){
        var { onUpdateSearchHistory } = this.props;
        if (onUpdateSearchHistory) onUpdateSearchHistory(null, true);
    }
    
    handleGotoSearch(title){
      var { history, onUpdateSearchHistory } = this.props;       
      history.push(`/search?words=${title}`);
      if (onUpdateSearchHistory) onUpdateSearchHistory(title);
      this._closeSearchInput();
    }

    handleButtonMouseOver(){
        this.setState({visible:true,iconType:'close'});
    }

    _closeSearchInput(){
        this.setState({visible:false, iconType:'search'});
    }

    handleMouseOut(e){
      e.stopPropagation();
      var target = e.currentTarget;
      var inner = e.toElement || e.relatedTarget;
      if (!target.contains(inner)){
          this.setState({visible:false,iconType:'search'});
          if (this.input) this.input.classList.remove('click');
      }
    }

    handleVisibleChange(visible){
        console.log(visible);
        if (visible){          
            setTimeout(()=>{  
                var searchContainer = document.getElementsByClassName(style['search-container'])[0];
                var spanDom = searchContainer.getElementsByClassName(style['search-input'])[0];
                var input = spanDom.childNodes[0];
                this.input = input;  
                this.spanDom = spanDom;                   
                if (input && input.focus){
                    input.focus();
                    spanDom.classList.add(style['click']);
                }
            },200)
            
        } else {
            setTimeout(()=>{
                var input = this.input;
                var spanDom = this.spanDom;
                if (input && input.blur){
                    input.blur();
                    spanDom.classList.remove(style['click']);
                }
            },500)
        }
    }

    componentWillUnmount(){
        this.input = null;
        this.spanDom = null;
    }

    render() {
        var { iconType, visible, searchList } = this.state;
        var { onUpdateSearchHistory, searchHistory } = this.props;
        return (
            <Popover  
              //visible={visible}
              trigger="click"
              autoAdjustOverflow={false}
              placement="bottom"
              onVisibleChange={this.handleVisibleChange.bind(this)}
              content={
                <div className={style["search-container"]} onMouseOut={this.handleMouseOut.bind(this)}>
                    <SearchComponent {...this.props} onClose={this._closeSearchInput.bind(this)} onUpdateSearchHistory={onUpdateSearchHistory} />
                    <div>
                      <div className={style["tags"]}>
                          <span className={style.text}>热门搜索</span>
                          <ul>
                            {
                              arr.map((item,index)=>(
                                <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><span>{item.title}</span></li>
                              ))
                            }
                          </ul>
                      </div>
                      <div className={style["tags"]}>
                          <span className={style.text}>搜索历史</span>
                          <span className={`${style["button"]} ${style["text"]}`} onClick={this.handleRemoveHistory.bind(this)}>删除历史</span>
                          <ul>
                            { 
                              searchHistory && searchHistory.length
                              ?
                              searchHistory.map((item,index)=>(
                                <li key={index} onClick={this.handleGotoSearch.bind(this,item.title)}><span>{item.title}</span></li>
                              ))
                              :
                              '暂无搜索历史!'
                              
                            }
                          </ul>
                      </div>
                    </div>
                </div>
            }>
                <Button type="primary" size="small" shape="circle" icon={iconType} />
            </Popover>
        )
    }

    
}










