import { CallAgent, CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CommunicationIdentityClient, CommunicationUserToken } from "@azure/communication-identity"
import { AzureKeyCredential } from '@azure/core-auth';

export const getCommunicationIdentityClient = (): CommunicationIdentityClient | null => {

    const endpointVal: string | undefined = process.env.REACT_APP_COMMUNICATION_SERVICES_ENDPOINT;
    const accessKeyVal: string | undefined = process.env.REACT_APP_COMMUNICATION_SERVICES_ACCESSKEY;

    if (!endpointVal || !accessKeyVal) {
        console.error("Missing REACT_APP_COMMUNICATION_SERVICES_ACCESSKEY and/or REACT_APP_COMMUNICATION_SERVICES_ENDPOINT");
        return null;
    }

    // Create the credential
    const tokenCredential = new AzureKeyCredential(accessKeyVal);

    // Instantiate the identity client
    const identityClient = new CommunicationIdentityClient(endpointVal, tokenCredential)

    return identityClient;
}

let cachedAgent: CallAgent | null = null;
export const getCallAgent = async (userAndToken : CommunicationUserToken, callClient : CallClient, displayName: string): Promise<CallAgent | null> => {
    if (cachedAgent) return Promise.resolve(cachedAgent);

        const tokenCredential = new AzureCommunicationTokenCredential(userAndToken.token);
        return callClient.createCallAgent(tokenCredential, { displayName: displayName })
            .then(agentResult => {
                cachedAgent = agentResult;
                return Promise.resolve(cachedAgent);
            });
}