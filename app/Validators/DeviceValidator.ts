import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { toDefaultMessage } from 'App/Utils/Tools'

export default class DeviceValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        employee_id: schema.number([
            rules.required(),
            rules.unsigned(),
            rules.exists({
                table: 'employees',
                column: 'id',
                where: { active: true },
            }),
        ]),
        type: schema.enum(['PHONE/MOBILE', 'LAPTOP'] as const),
        cve_activo: schema.string({ trim: true }, [
            rules.unique({ table: 'devices', column: 'cve_activo' }),
        ]),
        brand: schema.string({ trim: true }, [rules.required()]),
        model: schema.string({ trim: true }, [rules.required()]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        enum: `El campo '{{ field }}' debe de ser uno de los siguientes valores: {{ options.choices }}`,
        unique: `El campo '{{ field }}' ya se encuentra registrado`,
        exists: `El valor del campo '{{ field }}' no existe en la base de datos`,
        unsigned: `El campo '{{ field }}' debe de ser un numero positivo`,
        '*': (field, rule) => toDefaultMessage({ property: field, type: rule }),
    }
}
