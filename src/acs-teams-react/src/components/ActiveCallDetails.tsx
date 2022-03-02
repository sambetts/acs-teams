import { Call, CallAgent, CallClient, CollectionUpdatedEvent, LocalVideoStream, RemoteParticipant, RemoteVideoStream, VideoStreamRenderer, VideoStreamRendererView } from "@azure/communication-calling"
import React, { useEffect, useRef } from "react";
import { Button } from "reactstrap"
import { Vid } from "./Vid";

interface props
{ 
    callClient: CallClient, 
    call: Call, 
    hungup: Function,
    callAgent: CallAgent
}

export const ActiveCallDetails: React.FC<props> = (props) => {
    const [callState, setCallState] = React.useState<string>(props.call.state);
    const [hangingUp, setHangingUp] = React.useState<boolean>(false);
    const [sendingVideo, setSendingVideo] = React.useState<boolean>(false);

    // Renderers
    const [rendererRemote, setRendererRemote] = React.useState<VideoStreamRenderer | null>(null);
    const [rendererLocal, setRendererLocal] = React.useState<VideoStreamRenderer | null>(null);

    // Views 
    const [rendererViewRemote, setRendererViewRemote] = React.useState<VideoStreamRendererView | null>(null);
    const [rendererViewLocal, setRendererViewLocal] = React.useState<VideoStreamRendererView | null>(null);

    const [localVideoStream, setLocalVideoStream] = React.useState<LocalVideoStream | null>(null);

    const hangUp = async () => {
        setHangingUp(true);

        // Stop webcam if we're sending video
        if (localVideoStream)
        {
            await toggleShareVideo(false);
        }

        // End call & notify parent
        await props.call.hangUp();
        props.hungup();
    }

    const toggleShareVideo = async (enableWebcam: boolean) => {
        

        if (enableWebcam) {
            
            const deviceManager = await props.callClient.getDeviceManager();
            const videoDevices = await deviceManager.getCameras();

            const videoDeviceInfo = videoDevices[0];
            const newLsV = new LocalVideoStream(videoDeviceInfo);
            setLocalVideoStream(newLsV);

            await initLocalVideoView(newLsV);
            await props.call.startVideo(newLsV);

            setSendingVideo(true);
        }
        else {
            if (!localVideoStream) {
                alert('No local video stream?');
                return;
            }

            await props.call.stopVideo(localVideoStream);

            // Clean up local webcam renderer
            rendererLocal?.dispose();
            setRendererLocal(null);
            rendererViewLocal?.dispose();
            setRendererViewLocal(null);

            setSendingVideo(false);
            setLocalVideoStream(null);
        }
    }

    useEffect(() => {

        // Init video
        async function setupVideo() {

            // Init video for call
            subscribeToRemoteParticipantInCall(props.call);
            
            // Make sure we clean-up when someone leaves
            props.callAgent.on('callsUpdated', (e: any) => {
                e.removed.forEach(() => {
                    disposeRemoteVid();
                })
            });
        }
        setupVideo();

        // Bind to call state changes to update our own state
        props.call.on("stateChanged", () => {
            setCallState(props.call.state);
        });
    }, [])

    const disposeRemoteVid = () => 
    {
        rendererViewRemote?.dispose();
        setRendererViewRemote(null);
        rendererRemote?.dispose();
        setRendererRemote(null);
    }

    const handleVideoStream = (remoteVideoStream: RemoteVideoStream) => {
        remoteVideoStream.on('isAvailableChanged', async () => {
            if (remoteVideoStream.isAvailable) {
                remoteVideoView(remoteVideoStream);
            } else {
                disposeRemoteVid();
            }
        });
        if (remoteVideoStream.isAvailable) {
            remoteVideoView(remoteVideoStream);
        }
    }

    const subscribeToParticipantVideoStreams = (remoteParticipant: RemoteParticipant) => {
        remoteParticipant.on('videoStreamsUpdated', e => {
            e.added.forEach(v => {
                handleVideoStream(v);
            });
        });
        remoteParticipant.videoStreams.forEach(v => {
            handleVideoStream(v);
        });
    }

    const subscribeToRemoteParticipantInCall = (callInstance: Call) => {
        callInstance.on('remoteParticipantsUpdated', e => {
            e.added.forEach(p => {
                subscribeToParticipantVideoStreams(p);
            });
        });
        callInstance.remoteParticipants.forEach(p => {
            subscribeToParticipantVideoStreams(p);
        })
    }

    const initLocalVideoView = async (lvs: LocalVideoStream) => {
        const localVidRenderer = new VideoStreamRenderer(lvs);
        const rendererLocalViewNew = await localVidRenderer.createView();
        setRendererViewLocal(rendererLocalViewNew);
    }

    const remoteVideoView = async (remoteVideoStream: RemoteVideoStream) => {
        const remoteVidRenderer = new VideoStreamRenderer(remoteVideoStream);
        await setRendererRemote(remoteVidRenderer);
        const rendererRemoteViewNew = await remoteVidRenderer.createView();
        setRendererViewRemote(rendererRemoteViewNew);
    }

    return <div>
        {hangingUp ?
            <Button color="danger" disabled>
                Hang up
            </Button>
            :
            <Button color="danger" onClick={hangUp}>
                Hang up
            </Button>
        }

        {!sendingVideo ?
            <Button color="secondary" onClick={() => toggleShareVideo(true)}>
                Start Video
            </Button>
            :
            <Button color="secondary" onClick={() => toggleShareVideo(false)}>
                Stop Video
            </Button>
        }

        {rendererViewLocal &&
            <div>
                <div>Local Video</div>
                <Vid videoStreamRendererView={rendererViewLocal} ref={r => r?.appendChild(rendererViewLocal.target)} />
            </div>
        }
        {rendererViewRemote &&
            <div>
                <div>Remote Video</div>
                <Vid videoStreamRendererView={rendererViewRemote} ref={r => r?.appendChild(rendererViewRemote.target)} />
            </div>
        }

        <table className="table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><p className="font-weight-bold">Call State:</p></td>
                    <td>{callState}</td>
                </tr>
                <tr>
                    <td><p className="font-weight-bold">Id:</p></td>
                    <td>{props.call.id}</td>
                </tr>
            </tbody>
        </table>
    </div>
}
