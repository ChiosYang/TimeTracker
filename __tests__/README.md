# 测试指南

## 🚀 快速开始

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（文件更改自动重新运行）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# CI 环境运行
npm run test:ci
```

## 📁 测试目录结构

```
__tests__/
├── unit/                     # 单元测试
│   ├── lib/
│   │   ├── services/        # 服务层测试
│   │   ├── db/             # 数据库操作测试
│   │   └── utils/          # 工具函数测试
│   └── auth/               # 认证相关测试
├── integration/             # 集成测试
│   ├── api/               # API 路由测试
│   └── services/          # 服务集成测试
├── component/              # React 组件测试
│   ├── games/            # 游戏相关组件
│   └── ui/               # UI 组件
├── e2e/                   # 端到端测试（待实现）
├── fixtures/              # 测试数据
└── setup/                 # 测试配置
    └── test-utils.tsx     # 测试工具函数
```

## 📝 编写测试

### 单元测试示例

```typescript
// __tests__/unit/lib/services/example.test.ts
import { myFunction } from '@/lib/services/example'

describe('MyFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

### 组件测试示例

```typescript
// __tests__/component/MyComponent.test.tsx
import { render, screen } from '@/__tests__/setup/test-utils'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## 🎯 测试覆盖率目标

### 当前状态
- **整体覆盖率**: 初始阶段
- **关键模块**:
  - 服务层: 基础测试已添加
  - 数据库操作: 基础测试已添加
  - UI 组件: 示例测试已添加

### 阶段目标
- **第1周**: 20% - 完成关键路径测试
- **第2周**: 40% - 覆盖核心功能
- **第1月**: 60% - 主要功能测试
- **第2月**: 80%+ - 全面覆盖

## 🔧 常见问题

### 1. TextDecoder 错误
已在 `jest.setup.js` 中配置了 polyfill

### 2. 模块导入错误
确保在 `tsconfig.json` 中配置了路径别名

### 3. 异步测试超时
```typescript
it('async test', async () => {
  // 增加超时时间
}, 10000)
```

## 📚 测试最佳实践

1. **测试命名**: 使用描述性的测试名称
2. **AAA 模式**: Arrange, Act, Assert
3. **隔离测试**: 每个测试应该独立运行
4. **测试边界条件**: 包括错误情况和边缘案例
5. **保持简单**: 测试应该简单明了，易于理解和维护

## 🚧 待完成任务

- [ ] 添加更多组件测试
- [ ] 实现 E2E 测试（Playwright）
- [ ] 提高数据库操作测试覆盖率
- [ ] 添加认证流程测试
- [ ] 配置 CI/CD 集成
- [ ] 添加性能测试

## 🔗 相关资源

- [Jest 文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)