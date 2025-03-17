import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'employees'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('number').nullable()
            table.string('name', 100).notNullable()
            table.string('lastname', 100).notNullable()
            table.string('phone_number', 50).nullable()
            table.string('gmail', 100).nullable()
            table.string('gmail_pass', 100).nullable()
            table.string('email', 100).nullable()
            table.string('email_pass', 100).nullable()
            table.string('department', 200).nullable()
            table.text('comments').nullable()
            table.boolean('active').notNullable()

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
