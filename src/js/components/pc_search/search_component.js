import React from 'react';


import { Form, Input, Select } from 'antd';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchComponent extends React.Component {
    
    constructor(props) {
      super();
      //console.log(props);
      this.state = {
        type:'news'
      }
      
    }
 
    
    handleSearch(value,e,type=this.state.type){
      //console.log(this);
      var history = this.props.history;
      
      var { validateFields } = this.props.form;
      // 去掉首尾多余空格
      var pattern = /(^\s*)|(\s*$)/g;
      
      validateFields(['search'],(errors,values)=>{
        //console.log(a);console.log(b);
        if ( !errors ) {
            
            var state = {
              value:value
            };
            var param = values.search.replace(pattern,'');
            //if (params.)
            //console.log(param);
            var searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
            
            if (!(searchHistory.find(item=>item.title==param))){
              searchHistory.push({title:param})
            }
            
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

            state.words = param;
                
            history.push(`/search?words=${param}&type=${type}`,state);

           
            if (this.props.onModalVisible){
              this.props.onModalVisible()
            }

        } else {
          return ;
        }
      })
    }


    componentDidMount(){
      var  { setFieldsValue } = this.props.form;
      
      if ( this.props.location ) {

        if(this.props.isSearchPage){

          var search = this.props.location.search;
        
          if(search){
             var value = search.match(/words=(.*)&/)[1];
            
            setFieldsValue({'search':value});
          }
        }
           
      }      
      
      console.log('mounted!');
    }  
    
    
    handleSearchValidator(rule,value,callback){

      if (!value) {
        callback('关键词不能为空!')
      } else if (value.match(/^\s+$/)) {
        callback('请输入合适的关键词!')
      }
      callback()
    }

    handleSelectChange(value){
      
      var words = this.props.form.getFieldValue('search');
      /*
      if (this.props.onChangeSearchType){
        this.props.onChangeSearchType(this.state.type);
      }
      */
      this.setState({type:value});
      this.setState(state=>{
        this.handleSearch(words,null,state.type);
      })
      
      
    }

    render() {
        let {  getFieldDecorator } = this.props.form;
        //console.log(getFieldDecorator);
        const selectBefore = (
                <Select onChange={this.handleSelectChange.bind(this)} defaultValue="新闻" style={{ width: 90 }}>
                  <Option value="news">新闻</Option>
                  <Option value="user">用户</Option>
                </Select>
              );

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
                    className={this.props.isSearchPage ? " ": "search-container"}
                    addonBefore={this.props.isSearchPage ? selectBefore : null}
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









