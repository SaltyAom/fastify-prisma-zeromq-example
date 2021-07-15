
import { Request } from 'zeromq'
import Queue from 'p-queue'

const queue = new Queue({
    concurrency: 512
})

const handleDabase = async (message: string | Object): Promise<string | Object> => {
    const task = await new Promise<string | Object>(async (resolve) => {
        queue.add(async () => {
            const socket = new Request()

            socket.connect("tcp://0.0.0.0:8081")
            await socket.send(JSON.stringify(message))

            const [result] = await socket.receive()
    
            let answer = JSON.parse(result.toString())

            socket.close()
    
            resolve(answer)
        })
    })

    return task
}

export default handleDabase
