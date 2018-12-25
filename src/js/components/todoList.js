import React from 'react';
import ReactDOM from 'react-dom';

var todolist = {
    name: "todos",
    todos: [{
            completed: false,
            title: 'finish exercise'
        }, {
            completed: false,
            title: 'lean jsx'
        }, {
            completed: true,
            title: 'lean react'
        }]
}

class Header extends React.Component {
	constructor(){
		super();
		this.state = {
			title:todolist.name
		}
	}
	render(){
		return(
			<header>{this.state.title}</header>
		)
	}
}

class ListItem extends React.Component {
	constructor(){
		super();
		this.state = {
			//complete:this.props.complete
			changed:false
		}
	}

	toggle(e){
		//this.props.todos
		//console.log(this.props.index);
		this.props.toggle(this.props.index, false, false);
	}

	handledblClick(){
		//console.log('test');
		this.setState({changed:true});
	}

	handlekeyboard(e){
		var value = e.target.value;
		if  ( e.keyCode === 13 ) {
			//console.log('ceshi');
			//console.log(e);
			this.setState({changed:false});
			this.props.toggle(this.props.index, true, true, value);
		}
		else {
			
		}
	}

	handleClick(){
		this.props.handleDelete(this.props.index);
		//console.log('ok');
	}

	render(){
		
		return(
			<div style={{width:'240px'}}>
				<input type="checkbox" checked={this.props.complete} onClick={this.toggle.bind(this)}/>
				{ this.state.changed 
					? 
					<input type="text" onKeyDown={this.handlekeyboard.bind(this)}/>
					:
					<span onDoubleClick={this.handledblClick.bind(this)}> { this.props.title }</span>
				}

				<button style={{float:'right'}} onClick={this.handleClick.bind(this)}>X</button>
			</div>
		)
	}
}

class List extends React.Component {
	constructor(){
		super();
		this.state = {
			todos:todolist.todos,
			left:0,
			sum:0


		}
	}

	handleFocusIn(){
		console.log('ok');
	}

	handleFocusOut(e){
		//this.handlekeyboard();
		e.target.value = ''
	}

	handlekeyboard(e){
		var value = e.target.value;
		
		if  ( e.keyCode === 13 ) {
			this.state.todos.push({completed:false,title:value});
			this.setState({todos:this.state.todos});
		}
	}

	toggle(index,titleChange=false,checkedChange=false,value){
		
		var item = this.state.todos[index];

		var titleValue = titleChange 
						?
						value
						:
						this.state.todos[index].title;

		var completed = checkedChange 
						?
						item.completed
						:
						!item.completed;

		this.state.todos[index] = {
			completed:completed,
			title:titleValue
		}
		this.setState({todos:this.state.todos});
		this.checkLeft();
	}

	handleDelete(index){
		this.state.todos.splice(index,1);
		this.setState({todos:this.state.todos});
		//console.log('ok');
	}

	checkLeft(){
		var left = 0;
		//console.log(this.state.left);
		var todos = this.state.todos;
		//var left = this.state.left;
		for(var i=0;i<todos.length;i++){
			if(todos[i].completed){
				++left
			}
		}

		this.setState({left:left});
	}
	componentWillMount(){
		this.checkLeft();
		this.setState({sum:this.state.todos.length})
	}

	render(){

		//console.log(this);
		var todos = this.state.todos;
		
		const list = todos.map((item,index)=>(
			<li key={index}><ListItem item={item} index={index} handleDelete={this.handleDelete.bind(this)} toggle={this.toggle.bind(this)} title={item.title} complete={item.completed}/></li>
		))

		
		return(
			<section>

				<input onFocus={this.handleFocusIn.bind(this)} onBlur={this.handleFocusOut.bind(this)} onKeyDown={this.handlekeyboard.bind(this)} placeholder="what needs to be done?"/>
				<div>
					<ul>
						{ list }
					</ul>
				</div>
				<div>
					<span>{ this.state.left } items left </span>
					&nbsp;&nbsp;
					<span> total  { this.state.sum } items </span>
				
				</div>
				</section>
				
					
			)
		}
	}

/*
var mixin1 = {
	componentDidMount:function(){
		console.log('component did mount')
	}
};

var mixin2 = {
	something:function(){
		console.log('dosomething');
	}
}
*/

var mydata = {bar:'drinks'}
var Test = React.createClass({
	//mixins:[mixin1,mixin2],
	render:function(){
		console.log('rendering');
		return <div>test {this.props.data.bar} <a ref='lianjie' href="#">ceshi</a><input ref="input" onChange={this.handleClick}/></div>
	},
	componentWillMount:function(){
		console.log('componentWillMount');
	},
	componentDidMount:function(){
		console.log('componentDidiMount');
		var dom = ReactDOM.findDOMNode(this);
		console.log(dom);
		var a = this.refs.lianjie;
		console.log(a);
	},
	componentWillReceiveProps:function(nextProps){
		console.log('componentWillReceiveProps',nextsProps.data.bar);
	},
	handleClick:function(){
		console.log('ok')
	}
})
export default class TodoList extends React.Component {
	render(){
		return(
			<div>
				<Header/>
				<div>
					<List/>
				</div>
				

				<Test data={mydata}/>
			</div>
		)
	}
}