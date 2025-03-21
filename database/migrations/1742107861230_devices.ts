import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'devices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('employee_id')
                .unsigned()
                .references('id')
                .inTable('employees')
                .onDelete('CASCADE')
            table.enum('type', ['PHONE/MOBILE', 'LAPTOP']).notNullable()
            table.string('cve_activo', 50).notNullable().unique()
            table.string('brand', 100).notNullable()
            table.string('model', 100).notNullable()
            table.boolean('active').notNullable().defaultTo(true)

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
