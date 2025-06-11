import React from 'react';
import CollectionCard from '../../components/CollectionCard';
import { type Folder } from '@/types/collection';

export default async function FoldersPage() {
    const folders: Folder[] = [];

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Folders</h1>
            <p className="text-text-secondary mb-8">Manually curated collections of your links.</p>

            {folders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                        <CollectionCard
                            key={folder.id}
                            name={folder.name}
                            linkCount={folder.linkCount}
                            href={`/dashboard/folders/${folder.id}`}
                            summary={folder.summary}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-text-secondary">You haven't created any folders yet.</p>
                    <p className="text-text-tertiary text-sm mt-2">
                        Click the "Add New" button to create your first folder.
                    </p>
                </div>
            )}
        </div>
    );
} 