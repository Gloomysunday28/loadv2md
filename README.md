# vue转换markdown文件, 为vuepress简便处理

> 插件作用
- 将vue转换为markdown文件
- 压缩vue文件里的template里img src应用到了的图片和styles里background运用的图片

## 安装
```
  cnpm i @kvinc/loadingv2md@latest -g
  或者
  npx @kvinc/loadingv2md@latest
```

## 配置项

| 参数名 | 类型 | 说明 |
| :----: | :----:| :----:|
| config | string | 指定配置文件, 必须是v2md.config.js |
|component| boolean| 是否展示组件 |
|ignore| <code>array or string</code>  | 忽略某个文件下的vue转换 |
|entry| string  | 入口文件夹 |

> 命令行用法

```
npx @kvinc/loadingv2md@latest --config v2md.config.js --component  --ignore dir
=== OR ===
loadingv2md --config v2md.config.js --component  --ignore dir

参数使用可以参考:
  loadingv2md -h
  npx @kvinc/loadingv2md@latest -h
```

> 配置文件
```
  {
    entry: 'src', 默认是src
    component: true,
    ignore: [dir, ...] || dir
  }
```

## 转换格式
> methods
```
  /** 
  * @param {string} # 参数名称 - 参数说明
  * @returns {string} # 返回名称 - 返回说明
  * @author {作者名称}
  * @description {描述}
  */
```

> === 转换 ===

<code>作者: 作者名称<code>

### 描述
```
  描述内容
```

## 参数
| 方法名 | 参数 | 类型 | 说明 |
| :----: | :----:| :----:| :----:|
| 方法名 | 参数名称 | 参数类型 | 参数说明

## 返回
| 方法名 | 参数 | 类型 | 说明 |
| :----: | :----:| :----:| :----:|
| 方法名 | 参数名称 | 参数类型 | 参数说明

> 配置了component
```
 name: 'BaseComponent'
```
=== 转换 ===
```
 <base-component></base-component>
```

> 根据vue component name来配置title
```
 name: 'BaseComponent'
```
=== 转换 ===
```
 ---
  BaseComponent
 ---
```

## 压缩图片
> template 
```
  <div>
    <img src="/path/to" />
  </div>

  说明: template是以上这种, 会根据/path/to来查找当前目录下图片并且进行压缩覆盖, 注意, 图片暂时只能在src下的assets里, 生成也会在src下的assets
```

> styles
```
  background: url(/path/to)

  说明: 与template类似
```

## markdown生成
```
  每个vue文件在自己的目录下都会生成一个md
```