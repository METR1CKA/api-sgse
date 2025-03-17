import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpParametersValidator } from 'App/Validators/HttpParametersValidator'
import { validatorErrorMessages } from 'App/Utils/Tools'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class Qs {
    public async handle(
        { request, response }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        const { getMessages, getSchema } = HttpParametersValidator

        try {
            const qsParams = await validator.validate({
                schema: getSchema({ schemaName: 'qs' }),
                data: request.qs(),
                messages: getMessages(),
            })

            request.updateQs(qsParams)
        } catch (error) {
            return response.badRequest({
                message: 'Parametros de consulta inválidos',
                data: {
                    errors: validatorErrorMessages(error),
                },
            })
        }

        await next()
    }
}
