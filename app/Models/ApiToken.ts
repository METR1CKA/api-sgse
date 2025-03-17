import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { dateTimeToString } from 'App/Utils/CustomDateTime'
import { DateTime } from 'luxon'
import User from './User'

export default class ApiToken extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column({
        serializeAs: null,
    })
    public user_id: number

    @column()
    public name: string

    @column()
    public type: string

    @column()
    public token: string

    @column.dateTime({
        autoCreate: true,
        serialize: (value: DateTime) => dateTimeToString({ dateTime: value }),
    })
    public expiresAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serialize: (value: DateTime) => dateTimeToString({ dateTime: value }),
    })
    public createdAt: DateTime

    // Relaciones
    @belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>

    // Funciones
    public static async setApiTokenInRequest({
        token,
        request,
    }: {
        token: string
        request: HttpContextContract['request']
    }): Promise<void> {
        request.request.headers.authorization = `Bearer ${token}`
    }

    public static async formatExpiresAt({ tokenHash }: { tokenHash?: string }) {
        if (!tokenHash) return null

        const api_token = await this.query().where({ token: tokenHash }).first()

        if (!api_token || !api_token.expiresAt) return null

        return dateTimeToString({ dateTime: api_token.expiresAt })
    }

    public static async revokeApiToken(currentUser: User) {
        await this.query().where({ user_id: currentUser.id }).delete()

        await currentUser.merge({ rememberMeToken: null }).save()

        const revoked = await this.query().where({ user_id: currentUser.id })

        return revoked.length === 0
    }

    public static async getApiToken({
        authAttempt: { token, type, expiresAt },
        currentUser,
    }: {
        authAttempt: {
            token: string
            type: string
            expiresAt?: DateTime<boolean>
        }
        currentUser: User
    }) {
        await currentUser.merge({ rememberMeToken: token }).save()

        return {
            type,
            token,
            expiresAt: dateTimeToString({ dateTime: expiresAt! }),
        }
    }
}
