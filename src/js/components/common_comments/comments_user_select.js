import React from 'react';
import { Form, Input, Button ,Select, Spin } from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class  CommentUserSelect extends React.Component{
    constructor(){
        super();
        this.state= {
            isLoading:true,
            userList:[]
            
        }
    }
 
    componentDidMount(){
        fetch(`/api/usr/getUserFollows?userid=${localStorage.getItem('userid')}`)
            .then(response=>response.json())
            .then(json=>{
                var userList = json.data;
                this.setState({userList,isLoading:false});
        })
    }

    handleInputKeyDown(e){
        clearTimeout(this.timer);
        e.persist();
        this.timer = setTimeout(()=>{
            var words = e.target.value;
            this.setState({isLoading:true});
            fetch(`/api/usr/search?words=${words}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    this.setState({userList:data.data,isLoading:false});
                })
        },500)
        
    }
    

    handleBlur(){
        var { onClose, onSelect, form } = this.props;
        var { getFieldValue } = form;
        var str = '';
        var selectedUsers = getFieldValue('user-select');
        if (selectedUsers && selectedUsers.length){
            var format = selectedUsers.map(item=>{
                return '@'+item+' ';
            });
            format.map(item=>{
                str += item;
            })
            if(onSelect) onSelect(str)
        } else {
            if (onSelect) onSelect(false);
        }
        if(onClose) onClose();
        
    }

    render(){
        
        var {getFieldDecorator} = this.props.form;
        var { userList, isLoading } = this.state;
        var { leftPosition } = this.props;
        
        const selectStyle = {
            position:'absolute',
            top:'0',
            left:leftPosition,
            width:'200px'
        }
        
        return(
            <div style={selectStyle}>
                {
                    getFieldDecorator('user-select',{

                    })(
                        <Select 
                            mode="multiple"
                            className="user-select" 
                            onInputKeyDown={this.handleInputKeyDown.bind(this)}
                            onBlur={this.handleBlur.bind(this)} 
                            open={true}
                            notFoundContent=""
                            dropdownRender={menu=>(
                                <div>
                                    <span style={{display:'inline-block',padding:'4px 12px',fontSize:'12px'}}>请搜索并选择要@的用户:</span>
                                    <div>{menu}</div>
                                </div>
                            )}
                        >
                            {
                                isLoading
                                ?
                                null
                                :
                                userList.map((item,index)=>(
                                    <Option key={index} value={item.username}>{item.username}</Option>
                                ))
                            }
                        </Select>
                    )
                }
            </div>
            
        )
        
    }
}


export default CommentUserSelect = Form.create()(CommentUserSelect);
