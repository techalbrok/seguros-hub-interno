
import type { SystemAlert } from '@/hooks/useSystemAlerts';
import type { User, Delegation, Company, Product } from '@/types';
import type { News } from '@/hooks/useNews';
import type { Department } from '@/hooks/useDepartments';

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
    users: [
        {
            id: 'demo-user-admin',
            name: 'Admin Demo',
            email: 'admin@demo.com',
            phone: '600000000',
            delegation_id: 'demo-delegation-1',
            avatar_url: '/placeholder.svg',
            role: 'admin',
            created_at: new Date().toISOString(),
        },
        {
            id: 'demo-user-1',
            name: 'Juan Pérez',
            email: 'juan.perez@demo.com',
            phone: '600111222',
            delegation_id: 'demo-delegation-1',
            avatar_url: '/placeholder.svg',
            role: 'user',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
            id: 'demo-user-2',
            name: 'Ana García',
            email: 'ana.garcia@demo.com',
            phone: '600333444',
            delegation_id: 'demo-delegation-2',
            avatar_url: '/placeholder.svg',
            role: 'user',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        },
    ] as User[],
    delegations: [
        {
            id: 'demo-delegation-1',
            name: 'Delegación Central',
            city: 'Madrid',
            address: 'Calle Principal 123',
            postal_code: '28001',
            phone: '910111222',
            email: 'central@demo.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 'demo-delegation-2',
            name: 'Delegación Norte',
            city: 'Barcelona',
            address: 'Avenida Diagonal 456',
            postal_code: '08001',
            phone: '930333444',
            email: 'norte@demo.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ] as Delegation[],
    companies: [
        {
            id: 'demo-company-1',
            name: 'Aseguradora Global',
            commercialWebsite: 'https://global.demo',
            brokerAccess: 'https://broker.global.demo',
            commercialManager: 'Carlos López',
            managerEmail: 'c.lopez@global.demo',
            createdAt: new Date(),
            updatedAt: new Date(),
            specifications: [],
            specificationCategories: [],
        },
        {
            id: 'demo-company-2',
            name: 'Seguros Confianza',
            commercialWebsite: 'https://confianza.demo',
            brokerAccess: 'https://broker.confianza.demo',
            commercialManager: 'Laura Martínez',
            managerEmail: 'l.martinez@confianza.demo',
            createdAt: new Date(),
            updatedAt: new Date(),
            specifications: [],
            specificationCategories: [],
        }
    ] as Company[],
    products: [
        {
            id: 'demo-product-1',
            name: 'Seguro de Coche Total',
            description: 'Cobertura completa para tu vehículo.',
            details: '<p>Este seguro lo cubre todo, desde daños propios hasta asistencia en viaje.</p>',
            company_id: 'demo-company-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            documents: [],
        },
        {
            id: 'demo-product-2',
            name: 'Seguro de Hogar Plus',
            description: 'Protege tu hogar y tus pertenencias.',
            details: '<p>Cubre incendios, robos, daños por agua y responsabilidad civil.</p>',
            company_id: 'demo-company-2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            documents: [],
        }
    ] as Product[],
    news: [
        {
            id: 'demo-news-1',
            title: 'Nueva App de Gestión Interna',
            content: '<p>Estamos muy contentos de anunciar el lanzamiento de nuestra nueva plataforma de gestión. ¡Explora todas las funcionalidades!</p>',
            image_url: null,
            author_id: 'demo-user-admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: { id: 'demo-user-admin', name: 'Admin Demo' }
        },
    ] as any[], // Using any[] for now as News type is complex
    departments: [
        {
            id: 'demo-department-1',
            name: 'Comercial',
            responsible_name: 'Luis Fernandez',
            responsible_email: 'l.fernandez@demo.com',
            description: 'Departamento encargado de las ventas y relaciones con clientes.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 'demo-department-2',
            name: 'Siniestros',
            responsible_name: 'Marta Sanz',
            responsible_email: 'm.sanz@demo.com',
            description: 'Gestión y tramitación de siniestros.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
    ] as Department[],
};

export type DemoData = typeof demoData;
