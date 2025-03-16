import { dateTimeToString } from 'App/Utils/CustomDateTime'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Employee extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public device_id: number

    @column()
    public number?: number

    @column()
    public name: string

    @column()
    public lastname: string

    @column()
    public phone_number?: string

    @column()
    public gmail?: string

    @column()
    public gmail_pass?: string

    @column()
    public email?: string

    @column()
    public email_pass?: string

    @column()
    public department?: string

    @column()
    public comments?: string

    @column()
    public active: boolean

    @column.dateTime({
        autoCreate: true,
        serialize: (value: DateTime) => dateTimeToString({ dateTime: value }),
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serialize: (value: DateTime) => dateTimeToString({ dateTime: value }),
    })
    public updatedAt: DateTime
}
