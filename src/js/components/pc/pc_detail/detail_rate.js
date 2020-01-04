import React from 'react';
import { Rate, Button, Tooltip } from 'antd';

const desc = ['肺都气炸了', '一肚子槽要吐', '一般无感', '心情愉悦', '开心的飞起来'];

export default class DetailRate extends React.Component {
  constructor(props){
    super()
    this.state={
      value:3,
      text:'hello'
    }
  }
  
  
  handleChange(value){
    //  value 从1开始计数，num类型
    this.setState({value});
  }

  handleHover(value){
    if(value){
      this.setState({text:desc[value-1]})
    }
  }

  handleClick(){
      var { value } = this.state;
      var { uniquekey, onVisible, onUpdateViewUsers } = this.props;
      fetch(`/api/article/rateArticle?rate=${value}&uniquekey=${uniquekey}&userid=${localStorage.getItem('userid')}`)
          .then(response=>response.json())
          .then(json=>{
              var data = json.data;            
              if (onVisible) onVisible();
              if (onUpdateViewUsers) onUpdateViewUsers(data);
          })
  }

  render(){

    var { value, text } = this.state;
    
    return (
      <div>
        <Tooltip title={text}><span><Rate onHoverChange={this.handleHover.bind(this)} onChange={this.handleChange.bind(this)} value={value} /></span></Tooltip>
        {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
        <div style={{margin:'10px 0'}}><Button type="primary" size="small" onClick={this.handleClick.bind(this)}>发布</Button></div>
      </div>
    )
  }
}
