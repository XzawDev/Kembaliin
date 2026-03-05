import type { Auth } from '@/types/auth';
import { route as routeFn } from 'ziggy-js';
declare global {
    const route: typeof routeFn;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
