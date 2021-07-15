import { PrismaClient } from '@prisma/client'

import { Reply } from 'zeromq'

import type { DatabaseRequest, DatabaseRequestType } from './types'

const prisma = new PrismaClient()

const main = async () => {
    const socket = new Reply()

    await socket.bind('tcp://0.0.0.0:8081')

    console.log("Chunbi Ok!")

    for await (const [msg] of socket) {
        let { type, data }: DatabaseRequest = JSON.parse(msg.toString())

        let valid = type in reducers

        if (!valid) {
            await socket.send(JSON.stringify('Invalid'))
        }

        let result = await reducers[type](data)

        socket.send(JSON.stringify(result))
    }
}

const reducers: Record<
    DatabaseRequestType,
    (input: DatabaseRequest['data']) => Promise<unknown>
> = {
    CREATE: async (data) =>
        await prisma.post.create({
            data
        }),
    READ: async ({ id }) =>
        (await prisma.post.findUnique({
            where: {
                id
            }
        })) || 'Not Found',
    UPDATE: async ({ id, ...data }) =>
        await prisma.post.update({
            where: {
                id
            },
            data
        }),
    DELETE: async ({ id }) =>
        await prisma.post.delete({
            where: {
                id
            }
        }),
    LIST: async () =>
        await prisma.post.findMany({
            skip: 0,
            take: 25
        })
} as const

main()
