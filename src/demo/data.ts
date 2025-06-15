
import type { SystemAlert } from '@/hooks/useSystemAlertsManager';

export const demoData = {
    system_alerts: [
        {
            id: 'alert-demo-1',
            title: '¡Bienvenido al Modo Demo!',
            message: 'Estás explorando una versión de demostración. Todos los cambios que realices se guardarán localmente en tu navegador.',
            type: 'info',
            active: true,
            created_at: new Date().toISOString(),
            expires_at: null,
            link: null,
            link_text: null,
        },
        {
            id: 'alert-demo-2',
            title: 'Funcionalidad Completa',
            message: 'Aquí puedes probar a crear, editar y eliminar registros sin afectar a la base de datos real.',
            type: 'success',
            active: true,
            created_at: new Date().toISOString(),
            expires_at: null,
            link: null,
            link_text: null,
        }
    ] as SystemAlert[],
    // Agregaremos más datos demo (usuarios, compañías, etc.) en los siguientes pasos.
    users: [],
    companies: [],
    products: [],
    news: [],
    delegations: [],
    departments: [],
};

export type DemoData = typeof demoData;
