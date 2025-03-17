import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmployeeValidator from 'App/Validators/EmployeeValidator'
import { requestValidatorErrorMessages } from 'App/Utils/Tools'
import Employee, { EmployeeData } from 'App/Models/Employee'
import Database from '@ioc:Adonis/Lucid/Database'

export default class EmployeesController {
    public async index({ response }: HttpContextContract) {
        const employees = await Employee.query()
            .preload('devices')
            .orderBy('id', 'desc')

        return response.ok({
            message: 'Usuarios obtenidos',
            data: employees,
        })
    }

    public async show({ params, response }: HttpContextContract) {
        const employee = await Employee.query()
            .preload('devices')
            .where({ id: params.id })
            .first()

        if (!employee) {
            return response.notFound({
                message: 'Empleado no encontrado',
                data: null,
            })
        }

        return response.ok({
            message: 'Empleado encontrado',
            data: employee,
        })
    }

    public async store({ request, response }: HttpContextContract) {
        let data: EmployeeData

        try {
            data = await request.validate(EmployeeValidator)
        } catch (error) {
            return response.ok({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        try {
            await Employee.create({
                ...data,
                active: true,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Error al guardar el empleado',
                data: error,
            })
        }

        return response.created({
            message: 'Empleado guardado',
            data: null,
        })
    }

    public async update({ params, request, response }: HttpContextContract) {
        let data: Partial<EmployeeData>

        try {
            data = await request.validate(EmployeeValidator)
        } catch (error) {
            return response.ok({
                message: 'Datos no válidos',
                data: requestValidatorErrorMessages(error),
            })
        }

        const employee = await Employee.find(params.id)

        if (!employee) {
            return response.notFound({
                message: 'Empleado no encontrado',
                data: null,
            })
        }

        const trx = await Database.transaction()

        try {
            employee.useTransaction(trx)

            await employee.merge(data).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback()

            return response.internalServerError({
                message: 'Error al actualizar el empleado',
                data: error,
            })
        }

        return response.ok({
            message: 'Empleado actualizado',
            data: null,
        })
    }

    public async destroy({ params, response }: HttpContextContract) {
        const employee = await Employee.find(params.id)

        if (!employee) {
            return response.notFound({
                message: 'Empleado no encontrado',
                data: null,
            })
        }

        const trx = await Database.transaction()

        try {
            employee.useTransaction(trx)

            await employee.merge({ active: !employee.active }).save()

            await trx.commit()
        } catch (error) {
            await trx.rollback()

            return response.internalServerError({
                message: 'Error al eliminar el empleado',
                data: error,
            })
        }

        return response.ok({
            message: 'Empleado eliminado',
            data: null,
        })
    }
}
