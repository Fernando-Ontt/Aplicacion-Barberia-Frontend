export const MENU_CONFIG = [
    {
        label: 'Dashboard',
        icon: 'pi pi-th-large',
        route: '/dashboard',


    },
    {
        label: 'Clientes',
        icon: 'pi pi-users',
        route: '/inicio',
        permission: 'CLIENTE_VIEW'

    },
    {
        label: 'Barberos',
        icon: ' pi pi-user-plus',
        route: '/barberos',
        permissions: 'BARBERO_VIEW'
    },
    {
        label: 'Productos',
        icon: 'pi pi-box',
        route: '/productos',
        permission: 'PRODUCTO_VIEW'
        
    },
    {
        label: 'Categorias',
        icon: 'pi pi-home',
        route: '/categorias',
        permission: 'CATEGORIA_VIEW'
    },
    {
        label: 'Servicios',
        icon: 'pi pi-home',
        route: '/servicios',
        permission: 'SERVICIO_VIEW'
    },
    {
        label: 'Reservas',
        icon: 'pi pi-home',
        route: '/reservas',
        permission: 'RESERVA_VIEW'
    },
    {
        label: 'Ventas',
        icon: 'pi pi-home',
        route: '/ventas',
        permission: 'VENTA_VIEW'
    },
    {
        label: 'Cortes',
        icon: 'pi pi-home',
        route: '/cortes',
        permission: 'CORTE_VIEW'
    },
    {
        label: 'Reportes',
        icon: 'pi pi-home',
        route: '/reportes',
        permission: 'REPORTE_VIEW'
    },
    {
        label: 'Estadisticas',
        icon: 'pi pi-home',
        route: '/estadisticas',
        permission: 'ESTADISTICA_VIEW'
    },
    {
        label: 'Configuracion',
        icon: 'pi pi-home',
        route: '/configuracion',
        permission: 'CONFIGURACION_VIEW'
    },

];