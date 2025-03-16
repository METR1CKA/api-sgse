import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
    public async handle(
        { auth, response }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        const isAuthenticated = await auth.use('api').check()

        if (!isAuthenticated) {
            return response.unauthorized({
                message: 'Acceso no autorizado',
                data: null,
            })
        }

        await next()
    }
}
