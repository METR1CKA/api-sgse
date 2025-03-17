/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import { authRoutes, apiV1Routes } from './api-v1.routes'

Route.group(() => {
    authRoutes()
    apiV1Routes()

    Route.get('/', async ({ response }) => {
        const isReady = HealthCheck.isReady()

        return response.ok({
            message: 'Welcome to SGSE API',
            data: {
                isReady,
            },
        })
    })

    Route.get('/test-healthy-check', async ({ response }) => {
        const report = await HealthCheck.getReport()

        const status = report.healthy ? 200 : 400

        return response.status(status).json({
            message: 'Healthy check',
            data: report,
        })
    })

    Route.any('*', async ({ response }) => {
        return response.notFound({
            message: 'Route not found',
            data: null,
        })
    })
}).middleware('log-requests')
