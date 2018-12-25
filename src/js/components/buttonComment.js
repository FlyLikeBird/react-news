import React from 'react';

/* 

	example 1
export default class ButtonComment extends React.Component {
	constructor(){
		super();
		this.state = {
			count:0
		}
		
	}

	sendWord(){
		//console.log(this);
		//debugger;
		var newCount = this.state.count + 1;
		//this.setState({count:this.state.count + 1});
		console.log('son');
		console.log(newCount);
		this.setState({count:newCount});
		//console.log('--');
		this.props.getWordCount();
	}

	render(){
		return(
			<button onClick={this.sendWord.bind(this)}>{this.props.buttonName}</button>
		)
	}
}

*/

export default class ButtonComment extends React.Component {
	constructor(){
		super();
		this.state = {
			sendCount:0
		}
		
	}
	
	render(){
		return (
			<div>
				<label>请输入邮箱:</label>
				<input onChange={this.props.handleEmail} />
			</div>
		)
	}
}


