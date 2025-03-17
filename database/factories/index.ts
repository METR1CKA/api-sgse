import Factory from '@ioc:Adonis/Lucid/Factory'
import Device, { DeviceType } from 'App/Models/Device'
import Employee from 'App/Models/Employee'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    active: true,
})).build()

export const DeviceFactory = Factory.define(Device, ({ faker }) => ({
    type: faker.helpers.arrayElement(['PHONE/MOBILE', 'LAPTOP']) as DeviceType,
    cve_activo: faker.string.alphanumeric(10),
    brand: faker.company.name(),
    model: faker.commerce.productName(),
    active: true,
})).build()

export const EmployeeFactory = Factory.define(Employee, ({ faker }) => ({
    number: faker.string.numeric(5),
    name: faker.person.firstName(),
    lastname: faker.person.lastName(),
    phone_number: faker.phone.number(),
    gmail: faker.internet.email(),
    gmail_pass: faker.internet.password(),
    email: faker.internet.email(),
    email_pass: faker.internet.password(),
    department: faker.commerce.department(),
    comments: faker.lorem.sentence(),
    active: true,
})).build()
