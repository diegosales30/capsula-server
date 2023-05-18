//rotas voltadas a memorias
import { FastifyInstance } from "fastify";
import { prisma } from "../libs/prisma";
import { z } from 'zod';


export async function memoriesRoutes(app: FastifyInstance) {
  //listagem de memorias
  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  //detalhes de uma memoria
  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    // if (!memory.isPublic && memory.userId !== request.user.sub) {
    //   return reply.status(401).send()
    // }

    return memory
  })


  //criação de uma memoria
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '5b489aff-4a99-4ea2-bfa3-09020b5dff80',
      },
    })

    return memory
  })

  //atualização de uma memoria
  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    // let memory = await prisma.memory.findUniqueOrThrow({
    //   where: {
    //     id,
    //   },
    // })

    // if (memory.userId !== request.user.sub) {
    //   return reply.status(401).send()
    // }

    let memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  //delete de uma memoria
  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      }
    })
  })
  
}

