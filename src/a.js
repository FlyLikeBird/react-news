import React from 'react';
import ReactDOM from 'react-dom';

class Header extends React.Component {
    constructor(){
        super();
        this.state = {
            name:''
        }
    }

    componentWillMount(){
        console.log('this is Header Component willMount()...')
    }

    componentDidMount(){
        console.log('this is Header Component DidMount()...')
        this.setState({name:'header'})
        
    }
    
    componentWillUpdate(){
        console.log('this is Header Component willUpdate()...')
    }

    componentDidUpdate(){
        console.log('this is Header Component DidUpdate()...')
    }

    render(){
        return (
            <div>
                <span>this is Header {this.state.name}</span>
            </div>
        )
    }
    
}

class Input extends React.Component {
    constructor(){
        super();
        this.state = {
            value:'',
            test:'test',
            option:''
        }
    }

    componentWillMount(){
        console.log('this is Input Component willMount()...')
    }

    componentDidMount(){
        console.log('this is Input Component DidMount()...');
        this.setState({value:'value1',test:'test2'});

    }

    componentWillUpdate(){

        console.log('this is Input Component willUpdate()...')
    }

    componentDidUpdate(){
        console.log('this is Input Component DidUpdate()...')
    }

    handleChange(e){
        this.setState({value:e.target.value})
    }   

    handleSelectChange(){
        console.log('change...');
        this.setState({option:'A'})
    }
    render(){
        return (
            <div>
                <input value={this.state.value} onChange={this.handleChange.bind(this)} />
                <Header test={this.state.test} />
                <select name={this.state.option} onChange={this.handleSelectChange.bind(this)}>
                    <option>a</option>
                    <option>b</option>
                    <option>c</option>
                </select>

            </div>
        )
    }
}

class Test extends React.Component {
    constructor(){
        super();
        this.state= {
            name:''
        }
    }

    componentDidMount(){
        this.setState({name:'ceshi'})
    }
    componentWillUpdate(){
        console.log('this is Test Component willUpdate()...')
    }

    componentDidUpdate(){
        console.log('this is Test Component DidUpdate()...')
    }

    render(){
        return(
            <div>主页:{this.state.name}</div>
        )
    }
}
class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value:''
        }
    }
    componentWillMount(){
        console.log('this is Home Component willMount()...');
    }
    handleClickEvent(){
        console.log('handleClick...');
        this.setState({value:'clicked...'});
    }

    componentDidMount(){
       console.log('this is Home Component DidMount()...');

    }
    render(){
        console.log('this is Home Component render()...')
        let {name} = this.props;
        
        return (
            <div ref="home">
               
                <Input />
                <Test />
                <div>
                    <p id="ceshi" onClick={this.handleClickEvent.bind(this)}>this is p{this.state.value}</p>
                </div>
            </div>
        )
    }
}

class ExampleApplication extends React.Component {
    componentDidMount() {
        document.addEventListener('click', () => {
            console.log('document click');
        })
    }

    outClick(e) {
        console.log(e.currentTarget);
        console.log('outClick');
    }
    
    onClick(e) {
       
        console.log('onClick');
        e.stopPropagation();
    }

    onClick2(e){
        console.log('onClick222');
    }
    render() {
        return <div onClick={this.outClick}>
            <button onClick={this.onClick}> 测试click事件 </button>
        </div>
    }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: 'start',
      color: 'blue'
    };
    /*
    this.timer = setTimeout(
      () => this.tick(),
      1000
    );
    */
  }
  /*
  tick() {
    this.setState({
      desc: 'end',
      color: 'green'
    });
  }
  */
  handleClick(e){
    console.log(e);
    this.setState({desc:'end',color:'green'})
  }

  componentWillUpdate(a,b){
    
  }

  componentDidMount(){
    /*
    document.addEventListener('click',function(){
        console.log('DOM event...');
    })
    */
  }

  handleHeaderClick(){
    
  }
  render() {
    console.log(this);
    return (
      <div className="App" onClick={this.handleClick.bind(this)}>
        <div className="App-header" onClick={this.handleHeaderClick.bind(this)}>
          
          <h1> "Welcom to React" </h1>
        </div>
        <p className="App-intro" style={{color: this.state.color}}>
          { this.state.desc }
        </p>
      </div>
    );
  }
}

ReactDOM.render(<App/>,document.getElementById('mainContainer'));



