
## 看自然 - 服务端 API

#### 获取主题列表
GET: /photolist/$pageno，如 /photolist/1

返回的数据格式：

	``` json
	{
		list: [
			{
				topicid: 1 (主题ID),
				title: "照片主题的标题",
				photo: "主题封面图片url",
				author: "作者",
				updated_at: "2013-03-05 23:10:46 (主题修改时间)",
				photo_count: "主题所属的图片数",
				description: "主题描述"
			},
			...
		],
		topicCount: 4(主题总数),
		pageCount: 1(总页数)
	}
	```

#### 获取主题内容
GET: /photo/$photoid，如 /photo/1

返回的数据格式：

	``` json
	{
		topicid: 2,
		title: "照片主题的标题",
		author: "作者",
		updated_at: "2013-03-05 23:10:46 (主题修改时间)",
		photo_count: 11 (图片数),
		description: "主题描述",
		list: [
			{
				photo: "/photo/270/201302/13/17df76e66ebdba0cfdf52935ec2017a2.jpg (照片url)",
				photo_id: 11,
				description: "照片描述",
				shooting_time: "2012-02-28 17:47:43 (照片的拍摄时间)"
			},
			...
		],
		isauthor: false (当前访问者是否是作者自己)
	}
	```
#### 上传图片
POST: /post

返回的数据格式：

	``` json
	{

	}
	```
#### 创建主题

#### 修改主题

#### 编辑图片描述

#### 删除主题

#### 删除图片

#### 检查登录状态

#### 登录

#### 退出
