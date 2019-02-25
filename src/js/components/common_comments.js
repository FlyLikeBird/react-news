import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Card, notification } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

var comments;
var limitComments = [];

function loadComments(index=0,limitComments=[]){		

				//数组去重处理，避免同一用户显示过多评论，用户名作为去重标准

				//console.log(index);
				for( ; index < sourceLength ;index++){
					//console.log(comments[i]);
					//debugger;
					let commentsUser = comments[index].UserName;
					let repeat = false;
					
					for(let j=0,length=limitComments.length; j<=length;j++){
						if ( limitComments[j] && (commentsUser == limitComments[j].UserName )) {
							repeat = true;
							break;

						}
					}

					if(!repeat){
						limitComments.push(comments[index]);
						count++;
						//console.log(count);
						//console.log('---');
					}

					if( count > mount ) {
						//console.log(index);
						//console.log(count);
						count=0;
						that.setState({index:index});
						break;
					}
}

class CommonComments extends React.Component{
	constructor(){
		super();
		this.state={
			comments:'',
			commentsList:'',
			//loadComments:'',  //加载评论的函数 
			
			mount:9,  // 每次读取的评论数量
			count:0,  // 计数器
			index:0   //  从原数组取值的索引号
		}
	}

	handleClick(){
		var index = this.state.index;
		var limitComments = this.state.limitComments;
		this.state.loadComments(index+1,limitComments);
	}
	
	componentDidMount(){
		var fetchOptions = {
			method:'GET'
		};
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey="+this.props.uniquekey,fetchOptions)
		.then(response=>response.json())
		/*
		.then(json=>{
			console.log(json);
			comments = json;

			const sourceLength = comments.length;
			limitComments.push(comments[0]);

			for(var i=1;i<sourceLength;i++){
				for(var j=0;j<limitComments.length;j++) {
					if ( limitComments[j].UserName != comments[i].UserName){
						limitComments.push(comments[i]);
					}

				}
			}
			
		})
		*/
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
						<div id="commentsContainer">

							{ commentsList ? commentsList:'评论正在加载中……'}
							<div style={{textAlign:'center',paddingTop:'10px'}}>
								<Button onClick={this.handleClick.bind(this)}>加载更多评论</Button>
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


export default CommonComments = Form.create()(CommonComments);
