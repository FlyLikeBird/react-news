import React from 'react';
import { Form, Input, Select, Icon, message } from 'antd';

import style from './search.style.css';
const FormItem = Form.Item;

class SearchComponent extends React.Component {
    
    handleSearch(){
      var { history, form, onClose, onUpdateSearchHistory  } = this.props;
      var { validateFields } = form;
      // 去掉首尾多余空格
      var pattern = /(^\s*)|(\s*$)/g;
      validateFields(['search'],(errors,values)=>{
          if ( !errors ) {
              var value = values.search;
              var state = {value};
              var param = value.replace(pattern,'');                                         
              history.push(`/search?words=${param}`);
              if (onClose) onClose();
              if (onUpdateSearchHistory) onUpdateSearchHistory(param); 
          } 
      })
    }


    componentDidMount(){
      var { form, forSearch, location } = this.props;
      var  { setFieldsValue } = form;
      if ( forSearch && location && location.search ) {   
          var match = location.search.match(/\?words=(.+)/); 
          setFieldsValue({'search':match[1]});
      }           
      var inputContainer = this.inputContainer;
      if (inputContainer){
          var inputDom = inputContainer.input;
          inputDom.setAttribute('autocomplete', 'off');
      }
    }      
    
    handleSearchValidator(rule,value,callback){
      if (!value) {
        callback('关键词不能为空!')
      } else if (value.match(/^\s+$/)) {
        callback('请输入合适的关键词!')
      }
      callback()
    }

    componentWillUnmount(){
      this.inputContainer = null;
    }

    render() {
        var { forSearch, form } = this.props;
        var {  getFieldDecorator } = form;
        
        return (
          <Form>           
            <FormItem>
              {
                getFieldDecorator('search',{
                  rules:[{
                    validator:this.handleSearchValidator.bind(this)
                  }]
                })(
                  
                  <Input 
                    placeholder="请输入查询关键词"
                    className={forSearch ? '':style['search-input']}
                    allowClear
                    ref={input=>this.inputContainer=input}
                    suffix={
                        <Icon type="search" onClick={this.handleSearch.bind(this)}/>
                    }
                    onPressEnter={this.handleSearch.bind(this)}                
                  />
                  

                )           
                  
              }             
            </FormItem>
          </Form>
            
        )
    }

}

export default SearchComponent = Form.create()(SearchComponent)









