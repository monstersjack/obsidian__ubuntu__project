---
标题: 大模型API及相关网站
创建时间: 2026-04-28
修改时间: 2026-07-03
---

## AI 设计能力评测网站

[Coding Plan怎么选？版本答案来了！\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1cwV56LEyn/?spm_id_from=333.337.search-card.all.click&vd_source=ea35c10f59aa46851935d37df4345603)

| 网站                  | 网址                                                                                                                                             | 主要用途                                          | 适合你怎么用                                         |                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| DesignArena         | https://designarena.ai/                                                                                                                        | AI 设计能力评测网站，让不同 AI 模型根据同一个设计任务生成结果，用户投票比较哪个更好 | 看哪些 AI 模型更擅长网页 UI、图片、视频、设计效果                   |                                           |
| DesignArena 排行榜     | https://designarena.ai/leaderboard                                                                                                             | 查看不同 AI 模型在==设计,代码==任务中的排名                    | 选模型时参考，比如谁更适合做网页、视觉设计                          | ![[Pasted image 20260531213513.png\|179]] |
| DesignArena 方法论     | https://designarena.ai/about                                                                                                                   | 说明它如何评估 AI 设计能力                               | 了解排名是怎么来的，不要只看分数                               |                                           |
| DesignArena Gallery | https://www.designarena.ai/gallery                                                                                                             | 展示 AI 生成的优秀应用/设计案例                            | 找网页设计、UI、App 页面灵感                              |                                           |
| OpenRouter          | https://openrouter.ai/                                                                                                                         | 一个 AI 模型聚合平台，可以通过一个 API 调用很多不同公司的大模型          | 程序开发时统一调用 OpenAI、Anthropic、Google、DeepSeek 等模型 |                                           |
| OpenRouter 模型列表     | https://openrouter.ai/models                                                                                                                   | 查看 OpenRouter 支持哪些模型、价格、上下文长度等                | 选便宜/强大的模型做 API 开发                              |                                           |
| OpenRouter 免费模型     | https://openrouter.ai/collections/free-models                                                                                                  | 查看可免费调用的模型                                    | 学习 API、测试项目时可以先用免费模型                           |                                           |
|                     | [LLM Rankings \| OpenRouter](https://openrouter.ai/rankings)                                                                                   | AI 模型排名,根据访问量,                                |                                                | ![[Pasted image 20260531213346.png\|187]] |
|                     |                                                                                                                                                |                                               |                                                |                                           |
| Artificial Analysis | [AI Model & API Providers Analysis \| Artificial Analysis](https://artificialanalysis.ai/)                                                     |                                               |                                                | ![[Pasted image 20260531215254.png\|148]] |
|                     | [LLM Leaderboard - Comparison of over 100 AI models from OpenAI, Google, DeepSeek & others](https://artificialanalysis.ai/leaderboards/models) | 不同 AI 大模型的能力、价格、速度、延迟和上下文长度。                  |                                                | ![[Pasted image 20260531215125.png\|136]] |

模型胜率
![[Pasted image 20260531213939.png]]
DesignArena 官方说明它是一个面向 AI 生成设计的众包评测平台，会把同一个创意任务交给多个 AI 模型，用户并排比较并投票，排行榜由用户投票结果形成。([Design Arena][1])

OpenRouter 更偏向开发者工具，它提供统一 API，可以浏览和调用大量 AI 模型；官方文档写的是可以通过一个 API 使用数百个模型和提供商。([OpenRouter][2])

```text
DesignArena = 看 AI 设计能力谁更强
OpenRouter = 用一个 API 调用很多 AI 模型
```

你如果是想做 **网页设计、UI 参考、PPT风格、前端页面灵感**，看 DesignArena。

你如果是想做 **AI 应用开发、聊天机器人、RAG、代码助手、论文助手、自己的系统接入大模型**，看 OpenRouter。


各种大模型网站
大模型

| Gemini Developer API | [ Gemini API  \|  Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing?hl=zh-cn) |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| DeepSeek API         | [DeepSeek API](https://platform.deepseek.com/usage)                                                 |
| 豆包-API调用-火山引擎        | [API调用-火山引擎](https://console.volcengine.com/home)                                                   |

目前最聪明的大模型

大模型提问窗口

| gemini3.1pro | [Google Al Studio](https://aistudio.google.com/prompts/new_chat) |
| ------------ | ---------------------------------------------------------------- |
| glm5.1       | [GLM](https://chatglm.cn/main/alltoolsdetail?lang=zh)            |
|              |                                                                  |

## 国内大模型


### deepseek




#### 如何添加模型

[模型 & 价格 \| DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
![[Pasted image 20260516215207.png]]
![[Pasted image 20260516215255.png]]

对应的请求地址和,模型ID在里面直接选择就行



### 豆包,火山引擎

[API调用-火山引擎](https://console.volcengine.com/home)
[在线推理选择具体的模型-火山引擎](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint?config=%7B%22Filter%22%3A%7B%22Name%22%3A%22%22%7D%2C%22PageNumber%22%3A1%7D)


### GLM

套餐
![[Pasted image 20260531222225.png]]

[智谱AI开放平台](https://bigmodel.cn/coding-plan/personal/usage)用量统计
![[Pasted image 20260531224053.png]]

### 阿里千问

[api-key-设置秘钥---大模型服务平台百炼控制台](https://bailian.console.aliyun.com/cn-beijing/?tab=model&source_channel=hy_qwen#/api-key)

## 国外大模型


### claude code 接入cli


[ClaudeCode并接入DeepSeek](http://bilibili.com/video/BV16YRLB7Exd/?spm_id_from=333.1391.0.0&vd_source=ea35c10f59aa46851935d37df4345603)




