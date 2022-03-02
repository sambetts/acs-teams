import { CallClient } from "@azure/communication-calling";
import { CommunicationUserToken } from "@azure/communication-identity";
import React from "react";
import { Button, Input } from "reactstrap"
import { getCallAgent, getCommunicationIdentityClient } from "../services/acsloader";

export const UserSetup: React.FC<{ callAgentSet: Function, callClient: CallClient }> = (props) => {

    const [yourName, setYourName] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [communicationUser, setCommunicationUser] = React.useState<CommunicationUserToken | null>(null);

    const createUser = async () => {

        // Instantiate the identity client
        const identityClient = getCommunicationIdentityClient();
        if (identityClient) {

            setLoading(true);

            // Create token from user
            const userAndToken = await identityClient.createUserAndToken(["voip"]);
            setCommunicationUser(userAndToken);
            
            // Create a calling agent & send to parent
            const callAgent = await getCallAgent(userAndToken, props.callClient, yourName);
            props.callAgentSet(callAgent);

            setLoading(false);
        }
    }

    return <div>
        <h4>[1/2] Create ACS User</h4>
        {communicationUser === null ?
            <>
                <p>You need an ACS indentity first:</p>
                <div className="form-group">
                    <label htmlFor="txtName">Your name</label>
                    <Input type="email" class="form-control" value={yourName} onChange={(e) => setYourName(e.target.value)} id="txtName" aria-describedby="nameHelp" placeholder="Enter name" />
                    <small id="nameHelp" className="form-text text-muted">You'll appear as '$name (External)' in Teams</small>
                </div>


                {loading || yourName.length === 0 ?
                    <Button color="primary" disabled>
                        Create User
                    </Button>
                    :
                    <Button color="primary" onClick={createUser}>
                        Create User
                    </Button>
                }
            </>
            :
            <>
                <p>ACS user has been set. </p>
                <p>Hi, '{yourName}' - your ACS user ID is '{communicationUser.user.communicationUserId}'.</p>
            </>
        }
    </div>
}
