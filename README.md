# 项目管理

采用lerna + pnpm 的monorepo 形式

## 依赖管理
使用pnpm 进行


# 发布

1 生成发布包版本信息
执行 `npx changeset`

2 更新包版本并生成changelog
执行 `npx changeset version`

3 将改动合并到主分支

4 发布 `npx changeset publish`
