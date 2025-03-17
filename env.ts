/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
    HOST: Env.schema.string({ format: 'host' }),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    APP_NAME: Env.schema.string(),
    DRIVE_DISK: Env.schema.enum(['local'] as const),
    NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),

    // Database SQLite3 configuration only need this variable, others drivers and DBMS need more variables
    DB_CONNECTION: Env.schema.string(),

    // CREDS for Initial User
    ADMIN_USERNAME: Env.schema.string(),
    ADMIN_PASSWORD: Env.schema.string(),
})
