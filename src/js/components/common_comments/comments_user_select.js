import React from 'react';
import { Form, Input, Button ,Select } from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class  CommentUserSelect extends React.Component{
    constructor(){
        super();
        this.state= {
            userList:[],
            open:true
        }
    }

    
    componentDidMount(){
        fetch(`/usr/getUserFollows?user=${localStorage.getItem('username')}`)
            .then(response=>response.json())
            .then(json=>{
                var userList = json.data;
                this.setState({userList});
        })
    }

    handleInputKeyUp(){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>{
            fetch(`/article/search?words=${this.state.value}&type=user`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    //console.log(data);
                    data = data.map(item=>item.username);
                    this.setState({listContent:data});
                })
        },1000)
        
    }
    
    handleSelect(e){
        
        var { getFieldValue, setFieldsValue } = this.props.form;
        var value = getFieldValue('comments');
        if (!selectItem) {
            this.setState({value:'',showSelect:false});
            return ;
        }
        value = value.substring(0,value.length-1);
        selectItem = selectItem.substring(0,selectItem.length-1);
        var selectArr = selectItem.split(' ')
        selectArr = selectArr.map(item=>'@'+item)
        var newValue = value + selectArr.join(' ');
        setFieldsValue({comments:newValue})
     
        selectItem = '';
        this.setState({value:'',showSelect:false,listContent:this.listContent})
        
    }

    handleCancel(){
        selectItem = '';
        this.setState({value:'',showSelect:false,listContent:this.listContent})
    }

    

    handleItemClick(item,e){      
        var li = e.target;
        
        if (li.classList.contains('selected')){
            
            var pattern = new RegExp(item+'\\s+');           
            selectItem = selectItem.replace(pattern,'');
            li.classList.remove('selected');
        } else {
            selectItem += item + ' ';           
            li.classList.add('selected');
        }
        
    }

    handleBlur(){
        /*
        if(this.props.onClose){
            this.props.onClose()
        }
        */
    }

    render(){
        
        var {getFieldDecorator} = this.props.form;
        var { userList } = this.state;
        var { leftPosition } = this.props;
        
        const selectStyle = {
            position:'absolute',
            top:'0',
            left:leftPosition,
            width:'200px'
        }
        
        var userContent = userList.map((item,index)=>(
                            <Option className="hello" key={index} value={item.id}>{item.username}</Option>
                        ))

        
        return(
            <div style={selectStyle}>
                {
                    getFieldDecorator('user-select',{

                    })(
                        <Select 
                            mode="tags" 
                            onBlur={this.handleBlur.bind(this)} 
                            open={this.state.open}
                            dropdownMatchSelectWidth={false} 
                        >
                            { userContent }
                        </Select>
                    )
                }
            </div>
            
        )
        
    }
}


export default CommentUserSelect = Form.create()(CommentUserSelect);
