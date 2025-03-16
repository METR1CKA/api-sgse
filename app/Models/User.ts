import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { dateTimeToString } from 'App/Utils/CustomDateTime'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public email: string

    @column({
        serializeAs: null,
    })
    public password: string

    @column()
    public username: string

    @column({
        serializeAs: null,
    })
    public rememberMeToken: string | null

    @column()
    public active: boolean

    @column.dateTime({
        autoCreate: true,
        serialize: (value: DateTime) =>
            dateTimeToString({
                dateTime: value,
            }),
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serialize: (value: DateTime) =>
            dateTimeToString({
                dateTime: value,
            }),
    })
    public updatedAt: DateTime

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }
}
