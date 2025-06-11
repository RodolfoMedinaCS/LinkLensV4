import React from 'react';
import { MockCluster } from '@/data/mockClusters';
import Tag from '@/components/ui/Tag';

interface ClusterCardProps {
  cluster: MockCluster;
}

export default function ClusterCard({ cluster }: ClusterCardProps) {
  const confidenceColor = cluster.confidence >= 80 ? 'text-success' : 
                          cluster.confidence >= 60 ? 'text-warning' : 'text-error';
  
  return (
    <div className="card p-6 hover:border-accent transition-colors group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
          {cluster.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${confidenceColor}`}>
            {cluster.confidence}%
          </span>
          <div className="w-2 h-2 bg-accent"></div>
        </div>
      </div>
      
      <p className="text-sm text-secondary mb-4 line-clamp-2">
        {cluster.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {cluster.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} variant="accent">{tag}</Tag>
          ))}
          {cluster.tags.length > 2 && (
            <Tag variant="accent">+{cluster.tags.length - 2}</Tag>
          )}
        </div>
        
        <span className="text-sm text-secondary font-mono">
          {cluster.linkCount} links
        </span>
      </div>
    </div>
  );
}