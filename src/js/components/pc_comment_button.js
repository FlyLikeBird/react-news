import React from 'react';

import { Button, Icon } from 'antd';

export default class CommentButton extends React.Component {
	constructor(){
		super();
		this.state = {
			count:0
		}
	}

	handleClick(e){
		var buttonType= this.props.type;
		this.props.handleButtonType(buttonType);
		var iconDom = document.getElementById('iconAction');
		iconDom.style.display = 'block';
		if (iconDom) {
			iconDom.classList.add('start');
			
		}
		var count = this.state.count  ;
		count++;
		this.setState({count:count});
		
		

		setTimeout(()=>{
			iconDom.classList.remove('start');
			iconDom.style.display = 'none';
		},500)



		
	}

	render(){
		return (
			<Button onClick={this.handleClick.bind(this)}><Icon type={this.props.type} />  {this.props.text}   {this.state.count}</Button>
		)
	}
}