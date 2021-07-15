import type { FastifyPluginCallback } from 'fastify'

import type { Create, Read, Update, Delete, List } from './types'

const crud: FastifyPluginCallback = (app, _, done) => {
    app.put<Create>('/post', async (req, res) => {
        const {
            body: { title, detail }
        } = req

        if (!title) return 'title is required'
        if (!detail) return 'detail is required'

        try {
            const response = await app.database({
                type: 'CREATE',
                data: {
                    title,
                    detail
                }
            })

            res.send(response)
        } catch (error) {
            res.send(error)
        }
    })

    app.get<Read>('/post/:id', async (req, res) => {
        const {
            params: { id }
        } = req

        if (!id) return 'id is required'

        const response = await app.database({
            type: 'READ',
            data: {
                id: +id
            }
        })

        res.send(response)
    })

    app.patch<Update>('/post', async (req, res) => {
        const {
            body: { id, ...data }
        } = req

        if (!id) return 'id is required'

        const response = await app.database({
            type: 'UPDATE',
            data: {
                id: +id,
                ...data
            }
        })

        res.send(response)
    })

    app.delete<Delete>('/post', async (req, res) => {
        const {
            body: { id }
        } = req

        if (!id) return 'id is required'

        const response = await app.database(
            JSON.stringify({
                type: 'DELETE',
                data: {
                    id: +id
                }
            })
        )

        res.send(response)
    })

    app.get<List>('/post/list', async (_req, res) => {
        const response = await app.database({
            message: {
                type: 'LIST'
            }
        })

        res.send(response)
    })

    done()
}

export default crud
