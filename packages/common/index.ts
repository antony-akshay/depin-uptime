//from validator
export interface SignupIncomingMessage{
    ip:string;
    publicKey:string;
    signedMessage:string;
    callbackId:string;
}

export interface ValidateIncomingMessage{
    status : 'Good' | 'Bad';
    latency : number;
    websiteId:string;
    validatorId:string;
    signedMessage:string;
    callbackId:string;
}

////from hub
export interface SignupOutgoingMessage{
    validatorId:string;
    callbackId:string;
}

export interface ValidateOutgoingMessage{
    websiteId:string;
    url:string; 
    callbackId:string;
}


export type IncomingMessage = {
    type : 'signup'
    data : SignupIncomingMessage
} | {
    type : 'validate'
    data : ValidateIncomingMessage,
}

export type OutgoingMessage = {
    type : 'signup'
    data : SignupIncomingMessage
} | {
    type : 'validate'
    data : ValidateIncomingMessage,
}