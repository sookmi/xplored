'use client';

import { useState, useCallback } from 'react';
import { Resource } from '@/types/resource';
import InsightGrid from './InsightGrid';
import InsightSidebar from './InsightSidebar';

interface InsightPageClientProps {
    insights: Resource[];
}

export default function InsightPageClient({ insights }: InsightPageClientProps) {
    const [selectedInsight, setSelectedInsight] = useState<Resource | null>(null);

    const handleSelect = useCallback((insight: Resource) => {
        setSelectedInsight(insight);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedInsight(null);
    }, []);

    return (
        <>
            <InsightGrid resources={insights} onSelect={handleSelect} />
            <InsightSidebar insight={selectedInsight} onClose={handleClose} />
        </>
    );
}
