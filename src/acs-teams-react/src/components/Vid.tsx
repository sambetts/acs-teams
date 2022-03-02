import { VideoStreamRendererView } from "@azure/communication-calling";
import React, { useEffect, useRef } from "react";

export const Vid = React.forwardRef<HTMLDivElement, {videoStreamRendererView : VideoStreamRendererView}>((props, ref) => {

    return  <div style={{ height: "200px", width: "300px", backgroundColor: "black", position: "relative" }}>
            <div ref={ref => ref?.appendChild(props.videoStreamRendererView.target)} id="myVideo" 
                style={{ backgroundColor: "black", position: "absolute", top: "50%", transform: "translateY(-50%)" }}>

            </div>
        </div>

});
