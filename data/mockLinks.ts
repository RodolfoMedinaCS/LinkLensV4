export interface MockLink {
  id: string;
  title: string;
  url: string;
  summary: string;
  tags: string[];
  source: string;
  createdAt: string;
  imageUrl?: string;
}

export const mockLinks: MockLink[] = [
  {
    id: '1',
    title: 'Case Study: The Rise of AI in Design Systems',
    url: 'https://figma.com/blog/ai-design-systems',
    summary: 'An exploration of how artificial intelligence is reshaping modern design systems, from automated component generation to intelligent design tokens.',
    tags: ['design-system', 'ai', 'figma'],
    source: 'figma.com',
    createdAt: '2024-01-15',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Building Scalable React Applications with TypeScript',
    url: 'https://react.dev/learn/typescript',
    summary: 'A comprehensive guide to structuring large-scale React applications using TypeScript, covering best practices for type safety and maintainability.',
    tags: ['react', 'typescript', 'architecture'],
    source: 'react.dev',
    createdAt: '2024-01-14',
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'The Future of Web Development: Server Components',
    url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
    summary: 'Understanding React Server Components and how they revolutionize web development by enabling server-side rendering with client-side interactivity.',
    tags: ['nextjs', 'react', 'server-components'],
    source: 'nextjs.org',
    createdAt: '2024-01-13',
    imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Advanced CSS Grid Techniques for Modern Layouts',
    url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    summary: 'Master CSS Grid with advanced techniques for creating complex, responsive layouts that adapt to any screen size and content structure.',
    tags: ['css', 'grid', 'responsive-design'],
    source: 'css-tricks.com',
    createdAt: '2024-01-12',
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'Machine Learning for Frontend Developers',
    url: 'https://tensorflow.org/js',
    summary: 'Introduction to TensorFlow.js and how frontend developers can integrate machine learning models directly into web applications.',
    tags: ['machine-learning', 'tensorflow', 'javascript'],
    source: 'tensorflow.org',
    createdAt: '2024-01-11',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    title: 'Database Design Patterns for Scalable Applications',
    url: 'https://supabase.com/blog/database-design-patterns',
    summary: 'Essential database design patterns and best practices for building scalable applications with PostgreSQL and modern database technologies.',
    tags: ['database', 'postgresql', 'architecture'],
    source: 'supabase.com',
    createdAt: '2024-01-10',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    title: 'API Design Best Practices for RESTful Services',
    url: 'https://restfulapi.net/rest-api-design-tutorial-with-example/',
    summary: 'Comprehensive guide to designing RESTful APIs that are intuitive, scalable, and maintainable for modern web applications.',
    tags: ['api', 'rest', 'backend'],
    source: 'restfulapi.net',
    createdAt: '2024-01-09',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    title: 'Performance Optimization Techniques for React Apps',
    url: 'https://react.dev/learn/render-and-commit',
    summary: 'Advanced techniques for optimizing React application performance, including memoization, code splitting, and efficient rendering strategies.',
    tags: ['react', 'performance', 'optimization'],
    source: 'react.dev',
    createdAt: '2024-01-08',
    imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '9',
    title: 'Modern Authentication Patterns for Web Applications',
    url: 'https://auth0.com/blog/authentication-patterns',
    summary: 'Exploring modern authentication patterns including OAuth 2.0, JWT tokens, and secure session management for web applications.',
    tags: ['authentication', 'security', 'oauth'],
    source: 'auth0.com',
    createdAt: '2024-01-07',
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];