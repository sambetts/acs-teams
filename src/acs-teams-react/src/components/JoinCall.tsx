import { Call, CallAgent, CallClient } from "@azure/communication-calling"
import React from "react";
import { Button, Input } from "reactstrap"
import { ActiveCallDetails } from "./ActiveCallDetails";

export const JoinCall: React.FC<{ callClient: CallClient, callAgent: CallAgent }> = (props) => {

    const [teamsCallUrl, setTeamsCallUrl] = React.useState<string>("");
    const [activeCall, setActiveCall] = React.useState<Call | null>(null);

    const startCall = () => {
        const newCall = props.callAgent.join({ meetingLink: teamsCallUrl }, {});
        setActiveCall(newCall);
    }
    const callHungUp = () => {
        setActiveCall(null);
    }

    return <div>
        {activeCall === null ?
            <>
                <h4>[2/2]: Join Teams Call</h4>
                <p>Enter a Teams call URL below:</p>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Call Link:</span>
                    <Input bsSize="sm" placeholder="https://teams.microsoft.com/l/meetup-join/....." value={teamsCallUrl} onChange={(e) => setTeamsCallUrl(e.target.value)} />
                </div>

                {teamsCallUrl.length === 0 || teamsCallUrl.length === 0 ?
                    <Button color="primary" disabled>
                        Join Meeting
                    </Button>
                    :
                    <Button color="primary" onClick={startCall}>
                        Join Meeting
                    </Button>
                }
            </>
            :
            <>
                <h4>[2/2]: Participate in Call</h4>
                <ActiveCallDetails call={activeCall} hungup={callHungUp} callClient={props.callClient} callAgent={props.callAgent} />
            </>
        }

    </div>
}
