# 项目管理

采用lerna + pnpm 的monorepo 形式

## 依赖管理
使用pnpm 进行


# 发布

使用changeset/cli来进行发布管理, 发布前进行build操作， 后续的build操作就可省略

1 生成发布包版本信息
- 执行 `npx changeset`
- 选择对应的包， 按照交互next
- 完成后，提交变更文件。push到git

2 发布版本

- 如果是发布测试版本
    - `pnpm changeset pre enter alpha   # 发布 alpha 版本`
      `pnpm changeset pre enter beta    # 发布 beta 版本`
      `pnpm changeset pre enter rc      # 发布 rc 版本`
    - 然后执行 `pnpm changeset version` 修改包的版本：
    - 执行 `pnpm run build && pnpm changeset publish` 发布 beta 版本
    - 完成版本发布之后，退出 Prereleases 模式 `pnpm changeset pre exit`
    - 然后把变更的内容提交到远程仓库中


- 发布正式版本
    - 提起打包 `pnpm run build`
    - 执行 `pnpm changeset version`
    - 执行 `pnpm changeset publish`
    - 然后把变更的内容提交到远程仓库中

如果某个包发布失败 就先在此重试发布命令`pnpm changeset publis`
或者到单独的子包文件夹下执行 `pnpm publish`