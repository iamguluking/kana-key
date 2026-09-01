# かな Key

面向美式 Mac 键盘的日语かな输入练习网站，使用 Next.js 开发。内置 10,000 句不重复例句，覆盖 10 个生活主题和 50 个句型族，礼貌体与日常口语各占一半；同一轮练习中不会重复抽到相同句子。

**在线演示：** [https://kana-key.vercel.app/](https://kana-key.vercel.app/)

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 部署到 Vercel

将项目推送到 Git 仓库，在 Vercel 中导入该仓库即可。框架预设选择 **Next.js**，其余构建设置保持默认。

## 输入规则

- 根据 `KeyboardEvent.code` 判定物理按键，不依赖系统日文输入法。
- Shift 输入小假名及布局中的特殊字符。
- 浊音与半浊音分两步输入，例如 `F + [` 为「ば」、`F + =` 为「ぱ」。
- 片假名按对应的平假名读音输入。
- 标点自动跳过，仅长音符「ー」需要输入。
