import React from 'react';
import { CallAgent, CallClient } from "@azure/communication-calling";
import { JoinCall } from './JoinCall';
import { UserSetup } from './UserSetup';

export const Home: React.FC = () => {

    const [callAgent, setCallAgent] = React.useState<CallAgent | null>(null);
    const [callClient] = React.useState<CallClient>(new CallClient());

    return <div>
        <h1>Join Teams Call</h1>
        <p>Connecting to Azure Communications Services (ACS) endpoint: {process.env.REACT_APP_COMMUNICATION_SERVICES_ENDPOINT}</p>


        <UserSetup callAgentSet={(newAgent: CallAgent)=>setCallAgent(newAgent)} callClient={callClient} />
        {callAgent &&
            <div>
                <JoinCall callAgent={callAgent} callClient={callClient} />
            </div>
        }

    </div>;
}
