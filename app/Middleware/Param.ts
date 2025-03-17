import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpParametersValidator } from 'App/Validators/HttpParametersValidator'
import { validatorErrorMessages } from 'App/Utils/Tools'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class Param {
    public async handle(
        { params, request, response }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        const { getMessages, getSchema } = HttpParametersValidator

        try {
            await validator.validate({
                schema: getSchema({
                    schemaName: 'params',
                }),
                data: params,
                messages: getMessages(),
            })

            request.updateParams(params)
        } catch (error) {
            return response.badRequest({
                message: 'Parametro id inválido',
                data: {
                    errors: validatorErrorMessages(error),
                },
            })
        }

        await next()
    }
}
