project = Project.create(name: '新手任务', profile: '极客公园是一个科技媒体', platform: "任意一个平台",
                         desc: '现在你想了解一些最前沿的科技新闻', expired_at: Time.now + 100.years,
                         contact_name: '野袁', phone: '18910753096', email: 'geeklab@geekpark.net',
                         company: '北京中明万长管理咨询有限公司', device: '任意一个移动设备',
                         requirement: '无平台要求', qr_code: 'http://7xjciz.com2.z0.glb.qiniucdn.com/xinshou_task.png')
Task.create(content: "访问极客公园官网，打开任意一篇文章，" +
              "观看文章内容并给该文章点赞",
            project_id: project.id)