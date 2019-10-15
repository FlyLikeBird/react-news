import React from 'react';
import { Rate } from 'antd';

const desc = ['肺都气炸了', '一肚子槽要吐', '一般无感', '心情愉悦', '开心的飞起来'];

export default class PCDetailRate extends React.Component {
  constructor(props){
    super()
    this.state={
      value:3
    }
  }
  
  
  handleChange(value){
    //  value 从1开始计数，num类型
    var { uniquekey, onVisible, onUpdateViewUsers } = this.props;
    fetch(`/article/rateArticle?rate=${value}&uniquekey=${uniquekey}&userid=${localStorage.getItem('userid')}`)
        .then(response=>response.json())
        .then(json=>{
            var data = json.data;
            this.setState({value});
            if (onVisible) onVisible();
            if (onUpdateViewUsers) onUpdateViewUsers(data);
        })
  }

  render(){

    var { value } = this.state;
    
    return (
      <span>
        <Rate tooltips={desc}  onChange={this.handleChange.bind(this)} value={value} />
        {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
      </span>
    )
  }
}
