'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-full bg-default-secondary cursor-default" aria-hidden>
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-default-secondary hover:bg-default-tertiary transition-colors inline-flex items-center justify-center"
            aria-label="테마 전환"
        >
            {theme === 'dark' ? (
                <Icon name="sun" size={20} color="icon-default-secondary" />
            ) : (
                <Icon name="moon" size={20} color="icon-default-secondary" />
            )}
        </button>
    );
}
