export type Locale = 'zh' | 'en';

export type LocalizedText = Record<Locale, string>;

export interface SiteNavigationItem {
  label: LocalizedText;
  href: Record<Locale, string>;
  external?: boolean;
}

export const siteConfig = {
  url: 'https://www.allenge.me',
  title: {
    zh: 'Allenge · 项目、写作与 Notes',
    en: 'Allenge · Projects, Writing & Notes',
  },
  description: {
    zh: '收集可复现的实验、计算机科学 Notes，以及校园与城市之间的日常观察。',
    en: 'Reproducible experiments, computer science notes, and observations from campus and the city.',
  },
  identity: {
    name: {
      zh: '陈正宇',
      en: 'Zhengyu Chen',
    },
    nickname: 'Allenge',
    school: {
      zh: '中山大学 · 计算机科学与技术',
      en: 'Sun Yat-sen University · Computer Science and Technology',
    },
    direction: {
      zh: '可信 AI 系统与可验证推理',
      en: 'Trustworthy AI systems and verifiable reasoning',
    },
    location: {
      zh: '中国广州',
      en: 'Guangzhou, China',
    },
    expectedGraduation: '2027-06',
  },
  social: {
    github: 'https://github.com/allenge007',
    email: 'chenzhy337@mail2.sysu.edu.cn',
  },
  analytics: {
    googleMeasurementId: 'G-Q64PQRHYP9',
  },
  sectionFlags: {
    research: true,
    skills: true,
    education: true,
    honors: true,
    projects: true,
    posts: true,
    photos: true,
    notes: true,
    publications: false,
    experience: false,
  },
  navigation: [
    {
      label: { zh: '首页', en: 'Home' },
      href: { zh: '/', en: '/en/' },
    },
    {
      label: { zh: '项目', en: 'Projects' },
      href: { zh: '/projects/', en: '/en/projects/' },
    },
    {
      label: { zh: '写作', en: 'Writing' },
      href: { zh: '/blog/', en: '/en/blog/' },
    },
    {
      label: { zh: 'Notes', en: 'Notes' },
      href: { zh: '/notes/', en: '/notes/' },
    },
    {
      label: { zh: '关于', en: 'About' },
      href: { zh: '/about/', en: '/en/about/' },
    },
  ] satisfies SiteNavigationItem[],
} as const;

export const profileContent = {
  hero: {
    eyebrow: {
      zh: 'Writing · Projects · Notes',
      en: 'Writing · Projects · Notes',
    },
    title: {
      zh: '一座持续生长的\n数字书房',
      en: 'A living notebook\nfor ideas in motion',
    },
    intro: {
      zh: '这里收集可复现的实验、仍在推敲的想法、课程 Notes，以及校园与城市之间偶然遇见的片刻。可以从一篇文章、一项系统，或一条尚未写完的笔记开始。',
      en: 'A place for reproducible experiments, ideas still under revision, course notes, and small observations from campus and the city. Start with an essay, a working system, or an unfinished trail through the Notes.',
    },
  },
  research: [
    {
      index: '01',
      title: { zh: 'Research Agent', en: 'Research agents' },
      description: {
        zh: '围绕论文与数据集设计检索、适配与反思工作流，让 Research Agent 的每一步更容易追溯。',
        en: 'Retrieval, adaptation, and reflection workflows for traceable research assistance across papers and datasets.',
      },
    },
    {
      index: '02',
      title: { zh: '多模态推理', en: 'Multimodal reasoning' },
      description: {
        zh: '把几何草图与推理步骤变成可执行、可验证、可编辑的视觉表示。',
        en: 'Turning visual reasoning steps into executable, verifiable, and editable representations.',
      },
    },
    {
      index: '03',
      title: { zh: '学习与决策系统', en: 'Learning and decision systems' },
      description: {
        zh: '研究推荐、优化与仿真中的多方约束，也关心实验为何有效、能否复现。',
        en: 'Recommendation, optimization, and simulation under multi-stakeholder constraints, with reproducible evaluation.',
      },
    },
  ],
  skills: [
    {
      title: { zh: '编程', en: 'Programming' },
      items: ['Python', 'C++', 'SQL'],
    },
    {
      title: { zh: '机器学习与 AI', en: 'Machine learning & AI' },
      items: ['PyTorch', 'scikit-learn', 'LightGBM', 'Sentence-BERT', 'RAG', 'Faiss'],
    },
    {
      title: { zh: '系统与工程', en: 'Systems & engineering' },
      items: ['Linux', 'Git', 'Docker', 'pytest', 'Streamlit', 'Plotly'],
    },
    {
      title: { zh: '并行计算', en: 'Parallel computing' },
      items: ['CUDA', 'MPI', 'OpenMP'],
    },
  ],
  education: {
    period: '2023 — 2027',
    degree: {
      zh: '计算机科学与技术 · 工学学士（预计）',
      en: 'B.Eng. in Computer Science and Technology (expected)',
    },
    school: {
      zh: '中山大学计算机学院',
      en: 'School of Computer Science and Engineering, Sun Yat-sen University',
    },
    detail: {
      zh: '课程覆盖数据结构与算法、操作系统、计算机网络、数据库、机器学习与最优化。',
      en: 'Coursework includes algorithms, operating systems, networks, databases, machine learning, and optimization.',
    },
  },
  honors: [
    {
      date: '2025.12',
      title: { zh: 'ICPC 亚洲区域赛（上海）银牌', en: 'ICPC Asia Regional, Shanghai · Silver Medal' },
    },
    {
      date: '2024.06',
      title: { zh: 'CCPC 全国邀请赛（广东）金牌', en: 'CCPC National Invitational, Guangdong · Gold Medal' },
    },
    {
      date: '2024.07',
      title: { zh: 'CCF CAT 算法精英赛总决赛银牌', en: 'CCF CAT Algorithm Elite Finals · Silver Medal' },
    },
    {
      date: '2024 / 2025',
      title: { zh: '中山大学程序设计竞赛一等奖', en: 'SYSU Programming Contest · First Prize' },
    },
  ],
} as const;
