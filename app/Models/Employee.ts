import { dateTimeToString } from 'App/Utils/CustomDateTime'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Device from './Device'

export interface EmployeeData {
    number?: string | null
    name: string
    lastname: string
    phone_number?: string | null
    gmail?: string | null
    gmail_pass?: string | null
    email?: string | null
    email_pass?: string | null
    department?: string | null
    comments?: string | null
}

export default class Employee extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public number?: string | null

    @column()
    public name: string

    @column()
    public lastname: string

    @column()
    public phone_number?: string | null

    @column()
    public gmail?: string | null

    @column()
    public gmail_pass?: string | null

    @column()
    public email?: string | null

    @column()
    public email_pass?: string | null

    @column()
    public department?: string | null

    @column()
    public comments?: string | null

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

    @hasMany(() => Device, {
        localKey: 'id',
        foreignKey: 'employee_id',
    })
    public devices: HasMany<typeof Device>
}
