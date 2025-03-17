import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { requestValidatorErrorMessages } from 'App/Utils/Tools'
import UserValidator from 'App/Validators/UserValidator'
import User, { UserCreds } from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        let authApi = auth.use('api')
        let loginData: UserCreds

        try {
            loginData = await request.validate(UserValidator)
        } catch (error) {
            return response.badRequest({
                message: 'Validación fallida',
                data: requestValidatorErrorMessages(error),
            })
        }

        const { username, password } = loginData

        try {
            await authApi.verifyCredentials(username, password)
        } catch (error) {
            return response.badRequest({
                message: 'Credenciales incorrectas',
                data: null,
            })
        }

        const user = await User.findBy('username', username)

        if (!user || !user.active) {
            return response.badRequest({
                message: 'Credenciales incorrectas',
                data: null,
            })
        }

        if (user.rememberMeToken) {
            await ApiToken.setApiTokenInRequest({
                token: user.rememberMeToken,
                request,
            })

            const isValidToken = await authApi.check()

            if (isValidToken) {
                const expiresAt = await ApiToken.formatExpiresAt({
                    tokenHash: authApi.token?.tokenHash,
                })

                return response.ok({
                    message: 'Ya existe una sesión activa',
                    data: {
                        type: 'Bearer',
                        token: user.rememberMeToken,
                        expiresAt,
                    },
                })
            }
        }

        const apiAuthAttempt = await authApi.attempt(username, password, {
            expiresIn: '1 day',
        })

        const apiToken = await ApiToken.getApiToken({
            authAttempt: apiAuthAttempt,
            currentUser: user,
        })

        return response.ok({
            message: 'Sesión iniciada',
            data: apiToken,
        })
    }

    public async logout({ auth, response }: HttpContextContract) {
        const { user } = auth.use('api')

        const userModel = await User.find(user?.id)

        const isRevoked = await ApiToken.revokeApiToken(userModel as User)

        return response.ok({
            message: 'Sesión cerrada',
            data: { isRevoked },
        })
    }

    public async me({ auth, response }: HttpContextContract) {
        const { user } = auth.use('api')

        const userModel = await User.query().where({ id: user?.id }).first()

        return response.ok({
            message: 'Datos de usuario',
            data: userModel,
        })
    }
}
