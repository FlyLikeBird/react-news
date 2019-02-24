
var Transaction = require('./transaction.js');

var wrappers = [{
	initialize(){
		console.log(`wrapper 1: ${this.name} initialize`)
	},
	close(){
		console.log(`wrapper 1:${this.name} close`)
	}
},{
	initialize(){
		console.log(`wrapper 2: ${this.name} initialize`)
	},
	close(){
		console.log(`wrapper 2:${this.name} close`)
	}
}]

function MyTransaction(){
	this.reinitializeTransaction();
	this.name="hello";
}

Object.assign(MyTransaction.prototype,Transaction,{
	getTransactionWrappers(){
		return wrappers;
	}
})

const myTransaction = new MyTransaction();

const result = myTransaction.perform(function(a,b){
	console.log(`performing:${this.name} is calculating: a+b=${a+b}`);
	return a+b;
},myTransaction,1,2);

console.log(`the result is ${result}`);