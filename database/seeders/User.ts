import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class extends BaseSeeder {
    public async run() {
        const ADMIN_USERNAME = Env.get('ADMIN_USERNAME')
        const ADMIN_PASSWORD = Env.get('ADMIN_PASSWORD')

        await User.create({
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
            active: true,
        })
    }
}
