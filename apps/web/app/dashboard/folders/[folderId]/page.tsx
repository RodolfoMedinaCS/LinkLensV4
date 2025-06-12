import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '../../../lib/supabase/server';
import LinkList from '../../../components/LinkList';
import { LinkListSkeleton } from '../../../components/LinkListSkeleton';
import { type LinkWithContent } from '../../../../types/link';
import { type Folder } from '../../../../types/collection';

const getFolderDetails = async (folderId: string): Promise<{ folder: Folder | null, links: LinkWithContent[] }> => {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { folder: null, links: [] };
    }

    const { data: folder } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single();

    if (!folder) {
        return { folder: null, links: [] };
    }
    
    const { data: linkRelations, error: linkRelationsError } = await supabase
        .from('link_folders')
        .select('link_id')
        .eq('folder_id', folderId);

    if (linkRelationsError) {
        console.error('Error fetching link relations:', linkRelationsError);
        return { folder, links: [] };
    }

    const linkIds = linkRelations?.map((r: { link_id: string }) => r.link_id) || [];

    if (linkIds.length === 0) {
        return { folder: { ...folder, linkCount: 0, summary: folder.description || '' }, links: [] };
    }

    const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*, link_content(*)')
        .in('id', linkIds);
    
    if (linksError) {
        console.error('Error fetching links:', linksError);
        return { folder, links: [] };
    }

    const links = (linksData as LinkWithContent[]) || [];

    return { folder: { ...folder, linkCount: links.length, summary: folder.description || '' }, links };
}

const ActionButton = ({ children }: { children: React.ReactNode }) => (
    <button className="bg-card border border-border hover:border-primary px-3 py-1.5 rounded-sm text-sm text-text-secondary hover:text-text-primary transition-colors">
        {children}
    </button>
);

export default async function FolderDetailPage({ params }: { params: { folderId: string } }) {
    const { folder, links } = await getFolderDetails(params.folderId);

    if (!folder) {
        notFound();
    }

    return (
        <div>
            <div className="mb-8 p-4 border border-border rounded-sm bg-card">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary mb-1">{folder.name}</h1>
                        <p className="text-text-secondary">{folder.summary}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <ActionButton>Rename</ActionButton>
                    <ActionButton>Delete Folder</ActionButton>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-text-primary mb-4">Links in this folder</h2>
            <Suspense fallback={<LinkListSkeleton />}>
                <LinkList links={links} />
            </Suspense>
        </div>
    );
} 