var C = require("../common/index")
  , User = C.model('User')
  , Topic = C.model('Topic')
  , utils = C.utils
  , auth = C.auth
  , _ = C._

var control = {};
/**
 * 显示主题列表
 * 
 */ 
control.index = function(req, res) {
    Topic
    .find()
    .exec(function (err, topics) {
      if (err) {
        res.send('error.');
      } else {
        res.send(JSON.stringify(topics));
      }
    });
}

/**
 * 显示某一主题信息
 * 
 */
control.show = function(req, res) {
  var id = '51a309ba98dcd9dc81000001';
  
    Topic
    .findOne({ _id: id})
    .exec(function (err, topic) {
      if (err) {
        res.send('error.');
      } else if (!topic) {
        res.send('not found topic.');
      } else {
        res.send(JSON.stringify(topic));
      }
    });
}

/**
 * 创建主题
 * 
 */
control.create = function(req, res) {
  var post = {
      user_id: req.user._id
    , title: '测试'
    , description: '测试'
    , photos: []
  };
  
  var topic = new Topic(post);
  
  topic.save(function (err) {
    if (err) {
      return res.send('topic create error')
    }
    
    return res.send('topic create success');
  })
}

/**
 * 更新主题
 * 
 */
control.update = function(req, res) {
  var id = '51a309ba98dcd9dc81000001';
  
  Topic.update({_id: id}, {description: '你好'}, function(err, numberAffected, raw){
    if (err) {return res.send('topic update error');}
    return res.send('topic update success');
  });
}

/**
 * 删除主题
 * 
 */
control.destroy = function(req, res) {
  var id = '51a309ba98dcd9dc81000001';
  
  Topic.remove({_id: id}, function(err){
    if (err) {return res.send('topic remove error');}
    return res.send('topic remove success');
  });
}

control.get = function(req, res) {
    res.jsonp({"list":[{"topicid":2,"title":"\u8bda\u8bda\u51fa\u751f\u7b2c\u4e00\u5929","photo":"\/photo\/270\/201302\/13\/17df76e66ebdba0cfdf52935ec2017a2.jpg","author":"\u6f58\u96ea\u9e4f","updated_at":"2013-03-05 23:10:46","photo_count":11,"description":"\u8bda\u8bda\u662f2012\u5e742\u670828\u53f712\u70b940\u5206\u51fa\u751f\u7684\uff0c\u5c0f\u5bb6\u4f19\u51fa\u751f\u7b2c\u4e00\u5929\u7684\u6837\u5b50\uff0c\u771f\u53ef\u7231\u3002"},{"topicid":3,"title":"\u8bda\u8bda\u51fa\u751f\u7b2c\u4e8c\u5929","photo":"\/photo\/270\/201302\/13\/8d36b9844f6baf5357b1a0f2a25d1ea0.jpg","author":"\u6f58\u96ea\u9e4f","updated_at":"2013-03-05 22:12:55","photo_count":7,"description":"\u7167\u7247\u662f\u5b9d\u5b9d\u51fa\u751f\u7b2c\u4e8c\u5929\u7684\u65e9\u6668\u7528\u624b\u673a\u62cd\u7684\uff0c\u4e0d\u662f\u5f88\u6e05\u695a\u3002"},{"topicid":4,"title":"\u5b9d\u5b9d\u5c06\u8981\u5230\u6765","photo":"\/photo\/270\/201302\/13\/9c1c9b2a7c5cc5475cc163c23b6cfe6b.jpg","author":"\u6f58\u96ea\u9e4f","updated_at":"2013-02-13 23:23:17","photo_count":12,"description":""},{"topicid":1,"title":"\u8bda\u8bda\u51fa\u751f","photo":"\/photo\/270\/201302\/13\/a9fabe6c5daa22fa568808ef641603c7.jpg","author":"\u6f58\u96ea\u9e4f","updated_at":"2013-02-13 23:11:03","photo_count":16,"description":"2012.02.28\u53f7\uff0c\u8bda\u8bda\u51fa\u751f\u4e86\u3002"}],"topicCount":4,"pageCount":0});
};

var topics = C('topics', control);
