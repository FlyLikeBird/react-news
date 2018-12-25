import React from 'react';
import ButtonComment from './buttonComment';
/*

  example 1

export default class DaddyComponent extends React.Component {
	constructor(){
		super();
		this.state = {
			sendCount:0
		}
		
	}
	
	sendWord(){
		console.log(this.refs);
		//console.log(this === this.refs);
		this.refs.getWordButton.sendWord()
	}
	
	getWordCount(){
		//console.log('daddy');
		//console.log(this.refs.getWordButton.state.count);
		this.setState({sendCount:this.refs.getWordButton.state.count })
		//this.setState({sendCount:this.state.sendCount+1});
	}
	
	render(){
		return (
			<div>
				
				
				<ButtonComment ref="getWordButton" getWordCount={this.getWordCount.bind(this)} buttonName="通过子组件产生"/>
				<br/>
				<button onClick={this.sendWord.bind(this)}>通过父组件产生</button>
				<p>
					父子组件共产生  { this.state.sendCount }
				</p>
			</div>
		)
	}
}

*/

var App = React.createClass({
	render:function(){
		return <div>test</div>
	}
})

console.log(App);
console.log('--');
export default class DaddyComponent extends React.Component {
	constructor(){
		super();
		this.state = {
			email:'',
			content:{
				x:1,
				y:2
			}
		}
		
	}
	
	componentWillMount(){
		console.log('will');
		var result = ()=>{return 'ashan'};
		console.log(result());
	}

	handleEmail(e){
		var email = e.target.value;
		this.setState({email:email});
	}
	
	handleClick(){
		this.setState({content:{x:3}})
	}
	render(){
		console.log('ing');
		return (
			<div>
				
				<div>用户邮箱:{ this.state.email } </div>
				<div>test: { this.state.content.x } {this.state.content.y} <button onClick={this.handleClick.bind(this)}>button</button></div>
				<ButtonComment handleEmail={this.handleEmail.bind(this)}/>

			</div>
		)
	}
}


