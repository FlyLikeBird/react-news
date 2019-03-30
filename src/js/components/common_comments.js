import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col, Avatar } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Card, notification } from 'antd';

import CommmentButton from './pc_comment_button';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Meta } = Card;

var comments;
var sourceLength;

var limitComments =[];

var mount = 10 ; // 每次读取的评论数量
var count = 0 ;// 计数器
var alreadyHasId = {}

function getComments(){
	for(var i=1;i<sourceLength;i++){
		if (!alreadyHasId[comments[i].UserId]){
			limitComments.push(comments[i]);
			alreadyHasId[comments[i].UserId] = true;
		}
	}
}



class CommonComments extends React.Component{
	constructor(){
		super();
		this.state={
			comments:'',
			commentsList:'',
			buttonType:'like'	
		}
	}

	handleClick(){
		
		this.loadComments();
	}
	
	loadComments(){
		count++;
		var countArr = limitComments.slice(0,count*10);
		var commentsList = limitComments.length?
			countArr.map((item,index)=>(
					
					<Card key={index}>
						<Meta 
							avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
							title={item.UserName}
							description={<div><div>{item.Comments}</div><div className="commentActions"><CommmentButton type="like" text="赞成" handleButtonType={this.handleButtonType.bind(this)} /><CommmentButton type="dislike" text="反对" handleButtonType={this.handleButtonType.bind(this)} /><span className="comment_date">{item.datetime}</span></div></div>}
						/>
						
					</Card>

				))
			:
			'还没有人评论！';
		this.setState({commentsList:commentsList});
	}

	handleButtonType(buttonType){
		
		this.setState({buttonType:buttonType});
	}

	componentDidMount(){
		var fetchOptions = {
			method:'GET'
		};
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey="+this.props.uniquekey,fetchOptions)
		.then(response=>response.json())
		
		.then(json=>{
			
			comments = json;

			sourceLength = comments.length;
			

			limitComments.push(comments[0]);
			alreadyHasId[limitComments[0].UserId] = true;

			getComments();
			this.loadComments();
			//console.log(limitComments);
		})
		
	}

	handleSubmit(e){
		e.preventDefault();
		var fetchOptions = {
			method:'GET'
		};
		var formData = this.props.form.getFieldsValue();
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=comment&userid="+localStorage.userid+"&uniquekey="+this.props.uniquekey+"&commet="+formData.comments,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			this.state.loadComments();
			var commentContainer = document.getElementById('comments');
			commentContainer.value = "";

		})
	}

	addCollection(){
		var fetchOptions = {
			method:'GET'
		};

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=uc&userid="+localStorage.userid+"&uniquekey="+this.props.uniquekey,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			// 收藏成功以后进行全局消息提醒
			//console.log(json);
			notification.success({
				'message':'ReactNews提醒',
				'description':'收藏文章成功'
			})
		})
	}

	render(){
		
		let {getFieldDecorator} = this.props.form;
		const commentsList = this.state.commentsList;
		
		
		return(
			<div className="comment">
				<Row>
					<Col span={24}>
						<div className="commentsContainer">

							{ commentsList ? commentsList:'评论正在加载中……'}
							<div style={{textAlign:'center',paddingTop:'10px'}}>
								<Button onClick={this.handleClick.bind(this)}>加载更多评论</Button>
							</div>

							<div id="iconAction" className="iconAction">
								<Icon type={this.state.buttonType} />								
							</div>
						</div>
						
						<Form onSubmit={this.handleSubmit.bind(this)} style={{textAlign:'center'}}>
							<FormItem label="您的评论">
                                {getFieldDecorator('comments')(
                                  <Input id="comments" type="textarea" placeholder="请发表您的评论"/> 
                                )}
                            </FormItem>
                            <Button type="primary" style={{margin:'0 2px'}} htmlType="submit">提交评论</Button>
                            <Button type="primary" style={{backgroundColor:'#d1dade',borderColor:'#c7cacc'}} htmlType="button" onClick={this.addCollection.bind(this)}>收藏文章</Button>

						</Form>
					</Col>
				</Row>
			</div>
			
			
		)
		
	}
}


export default CommonComments = Form.create()(CommonComments);
