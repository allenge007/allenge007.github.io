export interface NoteNavItem {
  title: string;
  href: string;
  children?: NoteNavItem[];
}

const chapters = (base: string, titles: string[]): NoteNavItem[] => titles.map((title, index) => ({
  title,
  href: `${base}/chapter${index + 1}/`,
}));

export const notesConfig = {
  repository: 'allenge007/allenge007.github.io',
  branch: 'main',
  labels: {
    home: 'Notes',
    search: '搜索 Notes',
    contents: '目录',
    onThisPage: '本页目录',
    previous: '上一篇',
    next: '下一篇',
    updated: '更新于',
    edit: '编辑本页',
    source: '查看源文件',
    backToTop: '返回顶部',
    fontSize: '正文字号',
  },
  hiddenRoutes: [
    '/notes/admonitions/',
    '/notes/content-tabs/',
    '/notes/code-examples/',
    '/notes/cs/ai/minmaxtree.hidden/',
  ],
  navigation: [
    {
      title: '数学',
      href: '/notes/math/',
      children: [
        {
          title: '信号与系统',
          href: '/notes/math/signals_and_systems/',
          children: [
            ...chapters('/notes/math/signals_and_systems', [
              '连续时间傅里叶变换',
              '离散时间傅里叶变换',
              '拉普拉斯变换',
              'z 变换',
            ]),
            { title: '快速傅立叶变换', href: '/notes/math/signals_and_systems/FFT/' },
          ],
        },
        {
          title: '最优化理论',
          href: '/notes/math/optimization_theory/',
          children: chapters('/notes/math/optimization_theory', [
            'lec1 · 仿射与凸性',
            'lec2',
            'lec3',
            'lec4',
            'lec5',
            'lec6',
            'lec7',
            'lec8',
          ]),
        },
      ],
    },
    {
      title: '计算机科学',
      href: '/notes/cs/',
      children: [
        {
          title: '操作系统',
          href: '/notes/cs/os/',
          children: chapters('/notes/cs/os', [
            '操作系统概述',
            '进程、线程与 CPU 调度',
            '进程同步与死锁',
            '内存管理',
            '大容量存储',
            '文件系统',
            'I/O 管理',
          ]),
        },
        {
          title: '人工智能',
          href: '/notes/cs/ai/',
          children: chapters('/notes/cs/ai', [
            '知识表示与推理',
            '搜索技术',
            '不确定性知识表示与推理',
            '机器学习 · 聚类',
            '机器学习 · 神经网络',
            '机器学习 · 决策树',
            '深度学习',
            'Transformer',
            '强化学习',
          ]),
        },
      ],
    },
  ] satisfies NoteNavItem[],
} as const;

export function flattenNotesNavigation(items: readonly NoteNavItem[] = notesConfig.navigation): NoteNavItem[] {
  return items.flatMap((item) => [item, ...flattenNotesNavigation(item.children ?? [])]);
}

export function findNotesTrail(pathname: string, items: readonly NoteNavItem[] = notesConfig.navigation): NoteNavItem[] {
  for (const item of items) {
    if (item.href === pathname) return [item];
    const childTrail = findNotesTrail(pathname, item.children ?? []);
    if (childTrail.length) return [item, ...childTrail];
  }
  return [];
}
