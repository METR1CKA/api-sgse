/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

const databaseConfig: DatabaseConfig = {
    /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    |
    | The primary connection for making database queries across the application
    | You can use any key from the `connections` object defined in this same
    | file.
    |
    */
    connection: Env.get('DB_CONNECTION'),

    connections: {
        /*
        |--------------------------------------------------------------------------
        | SQLite
        |--------------------------------------------------------------------------
        |
        | Configuration for the SQLite database.  Make sure to install the driver
        | from npm when using this connection
        |
        | npm i sqlite3
        |
        */
        sqlite: {
            client: 'sqlite',
            connection: {
                filename: Application.databasePath('db_sgse.sqlite3'),
            },
            pool: {
                afterCreate: (conn, cb) => {
                    conn.run('PRAGMA foreign_keys=true', cb)
                },
            },
            migrations: {
                naturalSort: true,
            },
            useNullAsDefault: true,
            healthCheck: false,
            debug: false,
        },
    },
}

export default databaseConfig
