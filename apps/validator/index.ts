import { randomUUIDv7 } from "bun";
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "../../packages/common";
import { Keypair } from '@solana/web3.js';
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const CALLBACKS: { [callbackId: string]: (data: SignupOutgoingMessage) => void } = {}
let validatorId : string | null = null;

async function main() {
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    );

    const ws = new WebSocket("ws://localhost:8081");

    ws.onmessage = async (event)=>{
        const data:OutgoingMessage = JSON.parse(event.data);
        if(data.type == 'signup'){
            CALLBACKS[data.data.callbackId]?.(data.data)
            delete CALLBACKS[data.data.callbackId];
        }else if(data.type == 'validate'){
            await validateHandler(ws,data.data,keypair);
        }
    }

    ws.onopen= async ()=>{
        const callbackId = randomUUIDv7();
        CALLBACKS[callbackId]=(data:SignupOutgoingMessage)=>{
            validatorId=data.validatorId;
        }
        const signedMessage = await signMessage(`Signed message for ${callbackId}.${keypair.publicKey}`,keypair);

        ws.send(JSON.stringify({
            type:'signup',
            data:{
                callbackId,
                ip:'127.0.0.1',
                publickey:keypair.publicKey,
                signedMessage
            }
        }));
    }
}

async function signedMessage(message:string,keypair:Keypair){
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes,keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}

main()

setInterval(async () => {

}, 10000)