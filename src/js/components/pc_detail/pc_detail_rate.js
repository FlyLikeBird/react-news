import React from 'react';
import { Rate } from 'antd';


const desc = ['肺都气炸了', '一肚子槽要吐', '一般无感', '心情愉悦', '开心的飞起来'];



export default class PCDetailRate extends React.Component {
  constructor(props){
    super()
    this.state={
      value:0,
      disabled:false
    }
  }
  
  
  handleChange(value){
    //  value 从1开始计数，num类型
    //console.log(value);
   
    fetch(`/article/rateArticle?rate=${value}&uniquekey=${this.props.uniquekey}&username=${localStorage.getItem('username')}`)
    this.setState({value,disabled:true});

  }

  render(){

    var value = this.state.value;
    
    return (
      <span>
        <Rate tooltips={desc}  disabled={this.state.disabled} onChange={this.handleChange.bind(this)} value={value} />
        {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
      </span>
    )
  }
}
