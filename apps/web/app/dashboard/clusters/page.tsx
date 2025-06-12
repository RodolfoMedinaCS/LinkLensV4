import React from 'react';
import CollectionCard from '../../components/CollectionCard';
import { type Cluster } from '@/types/collection';

export default async function ClustersPage() {
    const clusters: Cluster[] = [];
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Smart Clusters</h1>
            <p className="text-text-secondary mb-8">AI-generated clusters of your links based on semantic similarity.</p>

            {clusters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {clusters.map((cluster) => (
                        <CollectionCard
                            key={cluster.id}
                            name={cluster.name}
                            linkCount={cluster.linkCount}
                            href={`/dashboard/clusters/${cluster.id}`}
                            summary={cluster.summary}
                            confidenceScore={cluster.confidenceScore}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-text-secondary">No smart clusters have been generated yet.</p>
                    <p className="text-text-tertiary text-sm mt-2">
                        Once you add more links, our AI will automatically group them into clusters for you.
                    </p>
                </div>
            )}
        </div>
    );
} 