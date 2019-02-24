import ReactDOM from 'react-dom';
import React from 'react';

var test = ()=> { return this};
class App extends React.Component {
	
}


ReactDOM.render( <h1 style={{color:'green'}}>hello world</h1>
  		,document.getElementById('mainContainer'))

class Super {
  constructor(x,y){
    this.x=x;
    this.y=y;
  }
	say(){
    	console.log('say');
    }
   hello(){
   	console.log('hello');
   }
}

class Sub extends Super {
  
  constructor(z){
      super(3,5);
      this.z = 10;
  }
  
	test(){
      consle.log('test');
      super.say();
    }
}

var sub = new Sub();
console.log(sub);