import fastify from 'fastify'

import helmet from 'fastify-helmet'
import compress from 'fastify-compress'
import staticPlugin from 'fastify-static'

import { resolve } from 'path'

import base from '@modules/base'
import crud from '@modules/crud'

import run from '@services/cluster'
import database from '@services/database'

const app = fastify()

const main = async () => {
    app.register(helmet)
        .register(compress)
        .register(staticPlugin, {
            root: resolve('./public')
        })
        .register(base)
        .register(crud)
        .decorate('database', database)
        .listen(8080, '0.0.0.0', (error, address) => {
            if (error) return console.error(error)

            console.log(`Running at ${address}`)
        })
}

// run(main)
main()

declare module 'fastify' {
    interface FastifyInstance {
        database: typeof database
    }
}
