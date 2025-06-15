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
            delegationId: 'demo-delegation-1',
            avatarUrl: '/placeholder.svg',
            role: 'admin',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'demo-user-1',
            name: 'Juan Pérez',
            email: 'juan.perez@demo.com',
            delegationId: 'demo-delegation-1',
            avatarUrl: '/placeholder.svg',
            role: 'user',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
            id: 'demo-user-2',
            name: 'Ana García',
            email: 'ana.garcia@demo.com',
            delegationId: 'demo-delegation-2',
            avatarUrl: '/placeholder.svg',
            role: 'user',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        },
    ] as User[],
    delegations: [
        {
            id: 'demo-delegation-1',
            name: 'Delegación Central',
            legalName: 'Delegación Central S.A.',
            contactPerson: 'Gerente Central',
            email: 'central@demo.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'demo-delegation-2',
            name: 'Delegación Norte',
            legalName: 'Delegación Norte S.L.',
            contactPerson: 'Gerente Norte',
            email: 'norte@demo.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
            title: 'Seguro de Coche Total',
            details: '<p>Este seguro lo cubre todo, desde daños propios hasta asistencia en viaje.</p>',
            process: '<p>Proceso de contratación rápido y sencillo.</p>',
            strengths: '<p>La mejor relación calidad-precio del mercado.</p>',
            companyId: 'demo-company-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            documents: [],
        },
        {
            id: 'demo-product-2',
            title: 'Seguro de Hogar Plus',
            details: '<p>Cubre incendios, robos, daños por agua y responsabilidad civil.</p>',
            process: '<p>Inspección y alta en menos de 48 horas.</p>',
            strengths: '<p>Asistencia 24/7 y peritos propios.</p>',
            companyId: 'demo-company-2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            documents: [],
        }
    ] as Product[],
    news: [
        {
            id: 'demo-news-1',
            title: 'Nueva App de Gestión Interna',
            content: '<p>Estamos muy contentos de anunciar el lanzamiento de nuestra nueva plataforma de gestión. ¡Explora todas las funcionalidades!</p>',
            imageUrl: null,
            authorId: 'demo-user-admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: { id: 'demo-user-admin', name: 'Admin Demo' }
        },
    ] as News[],
    departments: [
        {
            id: 'demo-department-1',
            name: 'Comercial',
            responsibleName: 'Luis Fernandez',
            responsibleEmail: 'l.fernandez@demo.com',
            description: 'Departamento encargado de las ventas y relaciones con clientes.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'demo-department-2',
            name: 'Siniestros',
            responsibleName: 'Marta Sanz',
            responsibleEmail: 'm.sanz@demo.com',
            description: 'Gestión y tramitación de siniestros.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ] as Department[],
};

export type DemoData = typeof demoData;
