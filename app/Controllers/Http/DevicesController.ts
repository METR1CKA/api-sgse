import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { requestValidatorErrorMessages } from 'App/Utils/Tools'
import DeviceValidator from 'App/Validators/DeviceValidator'
import Device, { DeviceData } from 'App/Models/Device'
import Database from '@ioc:Adonis/Lucid/Database'
import Employee from 'App/Models/Employee'
import DeviceUpdValidator from 'App/Validators/DeviceUpdValidator'

export default class DevicesController {
    public async index({ response }: HttpContextContract) {
        const devices = await Device.query()
            .preload('employee', (query) =>
                query.select('id', 'name', 'lastname', 'number'),
            )
            .orderBy('id', 'desc')

        return response.ok({
            message: 'Dispositivos obtenidos',
            data: devices,
        })
    }

    public async show({ params, response }: HttpContextContract) {
        const device = await Device.query()
            .preload('employee', (query) =>
                query.select('id', 'name', 'lastname', 'number'),
            )
            .where({ id: params.id })
            .first()

        if (!device) {
            return response.notFound({
                message: 'Dispositivo no encontrado',
                data: null,
            })
        }

        return response.ok({
            message: 'Dispositivo encontrado',
            data: device,
        })
    }

    public async store({ request, response }: HttpContextContract) {
        let data: Required<DeviceData>

        try {
            data = await request.validate(DeviceValidator)
        } catch (error) {
            return response.ok({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        const employee = await Employee.query()
            .preload('devices')
            .where({ id: data.employee_id })
            .first()

        if (employee) {
            if (employee.devices.length == 2) {
                return response.badRequest({
                    message: 'El empleado ya tiene 2 dispositivos asignados',
                    data: null,
                })
            }

            const currentDevicesType = employee.devices
                .filter((device) => device.active)
                .map((device) => device.type)

            if (currentDevicesType.includes(data.type)) {
                return response.badRequest({
                    message:
                        'El empleado ya tiene un dispositivo de este tipo asignado',
                    data: null,
                })
            }
        }

        try {
            await Device.create({
                ...data,
                active: true,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Error al guardar el dispositivo',
                data: error,
            })
        }

        return response.created({
            message: 'Dispositivo guardado',
            data: null,
        })
    }

    public async update({ params, request, response }: HttpContextContract) {
        let data: Partial<DeviceData>

        try {
            data = await request.validate(DeviceUpdValidator)
        } catch (error) {
            return response.badRequest({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        const device = await Device.find(params.id)

        if (!device) {
            return response.notFound({
                message: 'Dispositivo no encontrado',
                data: null,
            })
        }

        if (data.employee_id) {
            const employee = await Employee.query()
                .preload('devices')
                .where({ id: data.employee_id })
                .first()

            if (employee) {
                if (employee.devices.length == 2) {
                    return response.badRequest({
                        message:
                            'El empleado ya tiene 2 dispositivos asignados',
                        data: null,
                    })
                }

                if (data.type) {
                    const currentDevicesType = employee.devices
                        .filter((device) => device.active)
                        .map((device) => device.type)

                    if (currentDevicesType.includes(data.type)) {
                        return response.badRequest({
                            message:
                                'El empleado ya tiene un dispositivo de este tipo asignado',
                            data: null,
                        })
                    }
                }
            }
        }

        const trx = await Database.transaction()

        try {
            device.useTransaction(trx)

            await device
                .merge({
                    ...data,
                    active: true,
                })
                .save()

            await trx.commit()
        } catch (error) {
            await trx.rollback()

            return response.internalServerError({
                message: 'Error al actualizar el dispositivo',
                data: error,
            })
        }

        return response.ok({
            message: 'Dispositivo actualizado',
            data: device,
        })
    }

    public async destroy({ params, response }: HttpContextContract) {
        const device = await Device.find(params.id)

        if (!device) {
            return response.notFound({
                message: 'Dispositivo no encontrado',
                data: null,
            })
        }

        const trx = await Database.transaction()

        try {
            device.useTransaction(trx)

            await device.merge({ active: !device.active }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback()

            return response.internalServerError({
                message: 'Error al eliminar el dispositivo',
                data: error,
            })
        }

        return response.ok({
            message: 'Dispositivo eliminado',
            data: null,
        })
    }
}
