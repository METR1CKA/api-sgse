import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { toDefaultMessage } from 'App/Utils/Tools'

export class HttpParametersValidator {
    public static getSchema({ schemaName }: { schemaName: 'qs' | 'params' }) {
        let config = {
            qs: {
                limit: schema.number.optional(),
                page: schema.number.optional(),
            },
            params: {
                id: schema.number.optional(),
            },
        }

        return schema.create(config[schemaName])
    }

    public static getMessages(): CustomMessages {
        const messages: CustomMessages = {
            '*': (field, rule) =>
                toDefaultMessage({ property: field, type: rule }),
        }

        return messages
    }
}
