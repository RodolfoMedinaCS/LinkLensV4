'use client';

import React from 'react';
import { mockClusters } from '@/data/mockClusters';
import ClusterCard from '@/components/cards/ClusterCard';
import Button from '@/components/ui/Button';

export default function ClustersPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">Smart Clusters</h1>
            <p className="text-secondary">
              AI-generated clusters based on your saved links
            </p>
          </div>
          
          <Button variant="secondary">
            ↻ Re-cluster
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClusters.map((cluster) => (
            <ClusterCard key={cluster.id} cluster={cluster} />
          ))}
        </div>
        
        <div className="mt-8 card p-6 text-center">
          <h3 className="font-semibold text-primary mb-2">Need more clusters?</h3>
          <p className="text-secondary text-sm mb-4">
            Clusters are automatically generated as you save more links. 
            Save at least 10 links to see meaningful clusters.
          </p>
          <Button variant="secondary" size="sm">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}