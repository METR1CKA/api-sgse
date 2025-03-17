import { dateTimeToString } from 'App/Utils/CustomDateTime'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Employee from './Employee'

export type DeviceType = 'PHONE/MOBILE' | 'LAPTOP'

export interface DeviceData {
    employee_id: number
    type: DeviceType
    cve_activo: string
    brand: string
    model: string
}

export default class Device extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

    @column()
    public employee_id: number

    @column()
    public type: DeviceType

    @column()
    public cve_activo: string

    @column()
    public brand: string

    @column()
    public model: string

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

    @belongsTo(() => Employee, {
        localKey: 'id',
        foreignKey: 'employee_id',
    })
    public employee: BelongsTo<typeof Employee>
}
