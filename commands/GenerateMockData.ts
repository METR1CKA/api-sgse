import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import { DeviceFactory, EmployeeFactory, UserFactory } from 'Database/factories'
import Employee from 'App/Models/Employee'
import Device from 'App/Models/Device'

type DataType = 'users' | 'devices' | 'employees'

export default class GenerateMockData extends BaseCommand {
    /**
     * Command name is used to run the command
     */
    public static commandName = 'generate:mockData'
    public static aliases = [
        'g:m',
        'g:mock',
        'mock',
        'generate:mock',
        'mock:data',
        'g:mockData',
    ]

    /**
     * Command description is displayed in the "help" output
     */
    public static description = 'Generate mock data for the application'

    @args.string({
        required: false,
        description: `The type of data to generate, you enter the value: 'user' or 'devices' or 'employees'`,
        name: 'type',
    })
    public type: DataType

    @flags.number({
        description: 'The number of records to generate',
        name: 'count',
        alias: 'c',
    })
    public count: number

    @flags.boolean({
        description: 'Assign employees to a device randomly',
        name: 'assign',
        alias: 'a',
    })
    public assign: boolean

    public static settings = {
        /**
         * Set the following value to true, if you want to load the application
         * before running the command. Don't forget to call `node ace generate:manifest`
         * afterwards.
         */
        loadApp: true,

        /**
         * Set the following value to true, if you want this command to keep running until
         * you manually decide to exit the process. Don't forget to call
         * `node ace generate:manifest` afterwards.
         */
        stayAlive: false,
    }

    private factories = {
        users: UserFactory,
        devices: DeviceFactory,
        employees: EmployeeFactory,
    }

    private async validateArguments() {
        if (!this.type) {
            this.type = (
                await this.prompt.choice(
                    'Select the type of data to generate',
                    [
                        {
                            name: 'users',
                            message: 'Users',
                            hint: 'to generate users',
                        },
                        {
                            name: 'devices',
                            message: 'Devices',
                            hint: 'to generate devices',
                        },
                        {
                            name: 'employees',
                            message: 'Employees',
                            hint: 'to generate employees (assign them to a device randomly)',
                        },
                    ],
                )
            ).toLowerCase() as DataType
        }

        if (this.assign && this.type === 'users') {
            throw new Error(
                `You can only assign employees to devices, you entered: ${
                    this.type ?? 'empty'
                }`,
            )
        }

        if (!this.assign) {
            this.assign = await this.prompt.confirm(
                'Do you want to assign employees to a device randomly?',
            )
        }

        if (!['users', 'devices', 'employees'].includes(this.type)) {
            throw new Error(
                `Invalid type: ${
                    this.type ?? 'empty'
                }, please enter 'users' or 'devices' or 'employees'`,
            )
        }

        if (!this.count) {
            const count = await this.prompt.ask(
                'Enter the number of records to generate',
                {
                    validate: (value) => {
                        if (!value || isNaN(parseInt(value))) {
                            return 'You must enter a number'
                        }

                        return true
                    },
                },
            )

            this.count = parseInt(count)
        }

        if (isNaN(this.count)) {
            throw new Error('You must enter the number of records to generate')
        }
    }

    private async generateMockData({
        count,
        type,
        assign = false,
    }: {
        count: number
        type: DataType
        assign?: boolean
    }) {
        const factory = this.factories[type]

        await factory.createMany(count)

        if (type === 'users') return

        if (!assign) {
            return void this.logger.info(
                `No records assigned, creating ${type} only`,
            )
        }

        const employees = await Employee.query().preload('devices')

        if (employees.length === 0) {
            return void this.logger.info(
                'No employees found, creating devices only',
            )
        }

        const devices = await Device.query().orderBy('id', 'asc')

        if (devices.length === 0) {
            return void this.logger.info(
                'No devices found, creating employees only',
            )
        }

        const employeesWithoutDevicesIds = employees
            .filter((employee) => employee.devices.length < 2)
            .map((employee) => employee.id)

        if (employeesWithoutDevicesIds.length === 0) {
            return void this.logger.info(
                'No employees can accept more devices, creating devices only',
            )
        }

        const devicesNotAssignedIds = devices
            .filter((device) => !device.employee_id)
            .map((device) => device.id)

        if (devicesNotAssignedIds.length === 0) {
            return void this.logger.info(
                'All devices are already assigned, creating employees only',
            )
        }

        let assignmentCount = 0

        for (let employeesWithoutDeviceId of employeesWithoutDevicesIds) {
            for (let deviceNotAssignedId of devicesNotAssignedIds) {
                const employee = await Employee.query()
                    .where({ id: employeesWithoutDeviceId })
                    .preload('devices')
                    .firstOrFail()

                const device = await Device.query()
                    .where({ id: deviceNotAssignedId })
                    .firstOrFail()

                if (employee.devices.length === 2) {
                    break
                }

                const deviceTypes = employee.devices.map((dev) => dev.type)

                if (!deviceTypes.includes(device.type) && !device.employee_id) {
                    await device.merge({ employee_id: employee.id }).save()
                }

                assignmentCount++
            }
        }

        this.logger.info(
            `Assigned ${assignmentCount} devices to employees randomly`,
        )
    }

    public async run() {
        try {
            await this.validateArguments()
        } catch (error) {
            return void this.logger.fatal(error)
        }

        let spinner = this.logger.await(
            `Generating ${this.count} records for ${this.type}`,
        )

        try {
            await this.generateMockData({
                count: this.count,
                type: this.type,
                assign: this.assign,
            })
        } catch (error) {
            spinner.stop()
            return void this.logger.fatal(error)
        } finally {
            spinner.stop()
        }

        this.logger.success(`Records generated successfully`)
    }
}
