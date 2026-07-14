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
    zh: 'Allenge · AI 系统与研究笔记',
    en: 'Allenge · AI Systems & Research Notes',
  },
  description: {
    zh: '中山大学计算机科学本科生，关注可信 AI、Research Agent 与多模态推理。',
    en: 'Computer science undergraduate at Sun Yat-sen University, interested in trustworthy AI, research agents, and multimodal reasoning.',
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
      zh: 'SYSU · Computer Science · 2027',
      en: 'SYSU · Computer Science · 2027',
    },
    title: {
      zh: '可信 AI 系统：\n从检索到推理',
      en: 'Trustworthy AI systems,\nfrom retrieval to reasoning',
    },
    intro: {
      zh: '我关心 Research Agent 如何找到可靠证据，也关心多模态推理如何被执行、验证，以及学习系统如何作出更好的决策。目前在中山大学读计算机，也把算法、系统与 AI 的学习过程持续写进 Notes。',
      en: 'I’m interested in retrieval-augmented research agents, executable multimodal reasoning, and learning-based decision systems. At Sun Yat-sen University, I study computer science and keep notes on algorithms, systems, and AI.',
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
      zh: 'GPA 86/100；课程覆盖数据结构与算法、操作系统、计算机网络、数据库、机器学习与最优化。',
      en: 'GPA 86/100; coursework includes algorithms, operating systems, networks, databases, machine learning, and optimization.',
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
    {
      date: '2024 / 2025',
      title: { zh: '中山大学优秀学生奖学金三等奖', en: 'SYSU Outstanding Student Scholarship · Third Prize' },
    },
  ],
} as const;
