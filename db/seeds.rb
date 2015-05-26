project = Project.create(name: '新手任务', profile: '体媒技科个一是园公客极', platform: "任意一个移动设备",
                         desc: '现在你想了解一些最前沿的科技新闻', expired_at: Time.now + 100.years,
                         contact_name: '野袁', phone: '18910753096', email: 'geeklab@geekpark.net',
                         company: '北京中明万长管理咨询有限公司')
Task.create(content: "访问极客公园官网(http://www.geekpark.net/),打开任意一篇文章，" +
              "观看文章内容并给该文章点赞",
            project_id: project.id)