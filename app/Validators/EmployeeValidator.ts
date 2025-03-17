import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { toDefaultMessage } from 'App/Utils/Tools'

export default class EmployeeValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        number: schema.string.optional({ trim: true }, [
            rules.required(),
            rules.maxLength(10),
        ]),
        name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(100),
        ]),
        lastname: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(100),
        ]),
        phone_number: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(10),
        ]),
        gmail: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(100),
        ]),
        gmail_pass: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(100),
        ]),
        email: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(100),
        ]),
        email_pass: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(100),
        ]),
        department: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(100),
        ]),
        comments: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(255),
        ]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        '*': (field, rule) => toDefaultMessage({ property: field, type: rule }),
    }
}
