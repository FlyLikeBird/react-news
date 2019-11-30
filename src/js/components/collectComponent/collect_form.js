import React from 'react';
import { Row, Col, BackTop, Button, Icon, Popover, Modal, Input, Form, message, Select, Tabs } from 'antd';


const { Option } = Select;

class CollectForm extends React.Component {
    constructor(){
        super();
        this.state = {
            privacy:0
        }
    }

    handleSelect(value){
        this.setState({privacy:value})
    }

    createCollect(e){
        e.preventDefault();
        var { form, onUpdate } = this.props;
        var { validateFields } = form;
        var { privacy } = this.state;
        var userid = localStorage.getItem('userid');
        validateFields(['collect'],(errs,values)=>{
            if(!errs){
                var { collect } = values; 
                fetch(`/api/collect/createCollect?userid=${userid}&tag=${collect}&privacy=${privacy}`)
                    .then(response=>response.json())
                    .then(json=>{
                        var { code, data, message } = json;
                        if ( code===1 ){

                            message.info(message);
                        } else {
                            var data = json.data;
                            if (onUpdate) onUpdate(data);                           
                        }
                    })           
            }  
        })      
    }

    handleCheckCollectName(rule,value,callback){
        var regSpace = /^\s+$/;
        if ( value.match(regSpace)) {
            callback('收藏夹名称不能为空!')
        } else {
            callback();
        }
    }

    render(){
        var { form, onShowForm } = this.props;
        var { getFieldDecorator } = form;
       
        return(
                    <Form layout="inline" onSubmit={this.createCollect.bind(this)}>
                        <Form.Item>
                            {
                                getFieldDecorator('collect',{
                                    rules:[
                                        {
                                            required:true,
                                            message:'收藏夹名称不能为空!'
                                        },
                                        {
                                            validator:this.handleCheckCollectName.bind(this)
                                        }
                                    ]
                                })(
                                    <Input size="small" allowClear placeholder="请输入收藏夹名称"/>
                                )                           
                            }
                        </Form.Item>
                        <Form.Item>
                            <Select size="small" defaultValue={0} onSelect={this.handleSelect.bind(this)} dropdownMatchSelectWidth={false}>
                                <Option value={0}>公开的</Option>
                                <Option value={1}>仅对关注的人可见</Option>
                                <Option value={2}>私密的仅自己可见</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="small" style={{marginRight:'4px'}}>确定</Button>
                            <Button size="small" onClick={()=>onShowForm()}>取消</Button>
                        </Form.Item>
                        
                    </Form>
               
        )
    }
}

export default CollectForm = Form.create()(CollectForm);

