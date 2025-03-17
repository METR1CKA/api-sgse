import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { requestValidatorErrorMessages } from 'App/Utils/Tools'
import UserValidator from 'App/Validators/UserValidator'
import User, { UserCreds } from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
    public async index({ response }: HttpContextContract) {
        const users = await User.all()

        return response.ok({
            message: 'Usuarios obtenidos',
            data: users,
        })
    }

    public async show({ params, response }: HttpContextContract) {
        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                message: 'Usuario no encontrado',
                data: null,
            })
        }

        return response.ok({
            message: 'Usuario encontrado',
            data: user,
        })
    }

    public async store({ request, response }: HttpContextContract) {
        console.log('store')
        let data: UserCreds

        try {
            data = await request.validate(UserValidator)
        } catch (error) {
            return response.ok({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        console.log('data', data)

        // const trx = await Database.transaction()

        try {
            await User.create({
                ...data,
                active: true,
            })

            // await trx.commit()
        } catch (error) {
            // await trx.rollback()

            return response.internalServerError({
                message: 'Error al crear el usuario',
                data: error,
            })
        }

        return response.created({
            message: 'Usuario creado',
            data: null,
        })
    }

    public async update({ params, request, response }: HttpContextContract) {
        let data: Partial<UserCreds>

        try {
            data = await request.validate(UserValidator)
        } catch (error) {
            return response.ok({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                message: 'Usuario no encontrado',
                data: null,
            })
        }

        // const trx = await Database.transaction()

        try {
            // user.useTransaction(trx)

            await user.merge(data).save()

            // await trx.commit()
        } catch (error) {
            // await trx.rollback()

            return response.internalServerError({
                message: 'Error al actualizar el usuario',
                data: error,
            })
        }

        return response.ok({
            message: 'Usuario actualizado',
            data: null,
        })
    }

    public async destroy({ params, response }: HttpContextContract) {
        const user = await User.find(params.id)

        if (!user) {
            return response.notFound({
                message: 'Usuario no encontrado',
                data: null,
            })
        }

        const trx = await Database.transaction()

        try {
            user.useTransaction(trx)

            await user.merge({ active: !user.active }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback()

            return response.internalServerError({
                message: 'Error al desactivar/activar usuario',
                data: error,
            })
        }

        return response.ok({
            message: 'Usuario desactivado/activado',
            data: null,
        })
    }
}
