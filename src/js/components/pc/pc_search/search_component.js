import React from 'react';


import { Form, Input, Select } from 'antd';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchComponent extends React.Component {
    
    handleSearch(value){
      var { history, form } = this.props;
      var { validateFields } = form;
      // 去掉首尾多余空格
      var pattern = /(^\s*)|(\s*$)/g;
      var userid = localStorage.getItem('userid');
      validateFields(['search'],(errors,values)=>{
        //console.log(a);console.log(b);
        if ( !errors ) {
            
            var state = {
              value:value
            };
            var param = values.search.replace(pattern,'');
            
            var searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
            
            if (!(searchHistory.find(item=>item.title==param))){
              searchHistory.push({title:param})
            }
            
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

            state.words = param;
                
            history.push(`/search?words=${param}`,state);

           
            if (this.props.onModalVisible){
              this.props.onModalVisible()
            }

        } else {
          return ;
        }
      })
    }


    componentDidMount(){
      var { form, location } = this.props;
      var  { setFieldsValue } = form;
      if ( location && location.search) {          
          var value = location.search.match(/words=(.*)/)[1]; 
          //console.log(value);          
          setFieldsValue({'search':value});
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

    render() {
        var {  getFieldDecorator } = this.props.form;
        
        return (
          <Form>           
            <FormItem>
              {
                getFieldDecorator('search',{
                  rules:[{
                    validator:this.handleSearchValidator.bind(this)
                  }]
                })(
                  <Search 
                    //onBlur = {()=>{setTimeout(this.handleBlur.bind(this),0)}}
                    className={this.props.isSearchPage ? "": "search-input"}
                    placeholder="请输入查询关键词"
                    onSearch={this.handleSearch.bind(this)}                
                  />
                )           
                  
              }             
            </FormItem>
          </Form>
            
        )
    }

}

export default SearchComponent = Form.create()(SearchComponent)









