import { dateTimeToString } from 'App/Utils/CustomDateTime'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

type DeviceType = 'PHONE/MOBILE' | 'LAPTOP'

export default class Device extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: number

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
}
