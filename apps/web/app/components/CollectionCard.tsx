import React from 'react';
import Link from 'next/link';

type CollectionCardProps = {
    name: string;
    linkCount: number;
    href: string;
    summary?: string;
    confidenceScore?: number;
};

const ConfidenceBadge = ({ score }: { score: number }) => {
    const percentage = (score * 100).toFixed(0);
    let colorClass = 'bg-primary/20 text-primary';
    if (score < 0.9) colorClass = 'bg-warning/20 text-warning';
    if (score < 0.8) colorClass = 'bg-error/20 text-error';

    return (
        <div className={`absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded-full ${colorClass}`}>
            {percentage}%
        </div>
    )
}

export default function CollectionCard({ name, linkCount, href, summary, confidenceScore }: CollectionCardProps) {
    return (
        <div className="relative group">
            <Link href={href} className="block p-4 border border-border rounded-sm bg-card hover:border-primary/50 transition-colors h-full">
                {confidenceScore && <ConfidenceBadge score={confidenceScore} />}
                <h3 className="text-lg font-semibold text-text-primary pr-12">{name}</h3>
                <p className="text-sm text-text-secondary mt-2">{linkCount} {linkCount === 1 ? 'Link' : 'Links'}</p>
            </Link>
            {summary && (
                <div className="absolute bottom-full mb-2 left-0 w-full p-2 rounded-sm bg-background border border-border text-text-secondary text-sm scale-0 group-hover:scale-100 transition-transform origin-bottom z-10 pointer-events-none">
                    <span className="font-bold text-text-primary">Summary:</span> {summary}
                </div>
            )}
        </div>
    );
} 