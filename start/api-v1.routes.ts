import Route from '@ioc:Adonis/Core/Route'

export function authRoutes() {
    Route.group(() => {
        Route.group(() => {
            Route.post('logout', 'AuthController.logout')
            Route.get('me', 'AuthController.me')
        }).middleware('auth')

        Route.post('login', 'AuthController.login')
    }).prefix('api/v1/auth')
}

export function usersRoutes() {
    Route.resource('users', 'UsersController')
        .apiOnly()
        .middleware({
            index: ['qs', 'params'],
            show: 'params',
            update: 'params',
            destroy: 'params',
        })
}

export function devicesRoutes() {
    Route.resource('devices', 'DevicesController')
        .apiOnly()
        .middleware({
            index: ['qs', 'params'],
            show: 'params',
            update: 'params',
            destroy: 'params',
        })
}

export function employeesRoutes() {
    Route.resource('employees', 'EmployeesController')
        .apiOnly()
        .middleware({
            index: ['qs', 'params'],
            show: 'params',
            update: 'params',
            destroy: 'params',
        })
}

export function apiV1Routes() {
    Route.group(() => {
        usersRoutes()
        devicesRoutes()
        employeesRoutes()
    })
        .prefix('api/v1')
        .middleware('auth')
}
