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
    Route.group(() => {
        Route.resource('users', 'UsersController')
            .apiOnly()
            .middleware({
                index: ['qs', 'params'],
                show: 'params',
                update: 'params',
                destroy: 'params',
            })
    })
        .prefix('api/v1')
        .middleware('auth')
}
