import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage, SignupIncomingMessage } from "../../packages/common";
import { prismaClient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"; //signature verification
import nacl_util from "tweetnacl";

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publickey: string }[] = [];

const CALLBACKS: { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 100;//lamports

Bun.serve({
    fetch(request, server) {
        if (!server.upgrade) {
            return;
        }
        return new Response("upgrade failed", { status: 500 });
    },
    port: 8081,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);

            if (data.type == 'signup') {

                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId},${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                if (verified) {
                    await signupHandler(ws, data.data);
                }
            } else if (data.type == 'validate') {
                CALLBACKS[data.data.callbackId](data);
                delete CALLBACKS[data.data.callbackId];
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket == ws), 1);
        }
    },
});

async function signupHandler(ws: ServerWebSocket<unknown>, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
            publicKey
        }
    });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId
            }
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publickey: validatorDb.publicKey
        });
        return;
    }


    const validator = await prismaClient.validator.create({
        data: {
            ip,
            publicKey,
            location: "unknown"
        }
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId
        }
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publickey: validator.publicKey
    });
    return;
}