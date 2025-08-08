import { PrismaClient } from "@prisma/client/extension";
import { prismaClient } from "./src";

async function seed() {
    await prismaClient.user.create({
        data: {
            id: "1",
            email: "test@test.com",
            password: "test",
        }
    })

    await prismaClient.website.create({
        data: {
            id: "1",
            url: "http://google.com",
            userId: "1"
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            id: "1",
            websiteId: "1",
            status: "Good",
            createdAt: new Date(),
            latency: 100,
            validatorId: "1"
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            id: "1",
            websiteId: "1",
            status: "Good",
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
            latency: 100,
            validatorId: "1"
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            id: "1",
            websiteId: "1",
            status: "Good",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            latency: 100,
            validatorId: "1"
        }
    })
}