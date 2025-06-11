export interface MockCluster {
  id: string;
  name: string;
  description: string;
  linkCount: number;
  confidence: number;
  tags: string[];
  createdAt: string;
}

export const mockClusters: MockCluster[] = [
  {
    id: '1',
    name: 'AI Development Tools',
    description: 'Resources and tools for building AI-powered applications',
    linkCount: 12,
    confidence: 85,
    tags: ['ai', 'machine-learning', 'tools'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'React Ecosystem',
    description: 'Comprehensive resources for React development and best practices',
    linkCount: 18,
    confidence: 92,
    tags: ['react', 'javascript', 'frontend'],
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'Design Systems & UI',
    description: 'Modern design system approaches and UI development patterns',
    linkCount: 8,
    confidence: 78,
    tags: ['design-system', 'ui', 'css'],
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    name: 'Backend Architecture',
    description: 'Scalable backend patterns and database design principles',
    linkCount: 15,
    confidence: 88,
    tags: ['backend', 'database', 'architecture'],
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    name: 'Performance Optimization',
    description: 'Web performance optimization techniques and monitoring tools',
    linkCount: 10,
    confidence: 81,
    tags: ['performance', 'optimization', 'monitoring'],
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    name: 'Security Best Practices',
    description: 'Modern web security patterns and authentication strategies',
    linkCount: 7,
    confidence: 75,
    tags: ['security', 'authentication', 'best-practices'],
    createdAt: '2024-01-10'
  }
];