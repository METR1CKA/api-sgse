import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { toDefaultMessage } from 'App/Utils/Tools'

export default class UserValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        username: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(80),
        ]),
        password: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(15),
        ]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        '*': (field, rule) => toDefaultMessage({ property: field, type: rule }),
    }
}
