import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client';


function useSocket(startStep, completeStep, errorState) {


    const socket = useMemo(() => {
        return io();
    }, []);

    const [state, updateState] = useState(false);
    const [logs, updateLogs] = useState(["welcome\n"]);


    useEffect(() => {

        socket.connect();

        console.log(socket.active);

        socket.on("connect", () => {
            updateState(true);

        })
        socket.on("disconnect", () => {
            updateState(false);
        })

        socket.on("startstep", (data) => {
            console.log("start state");
            console.log(data);
            startStep(data.workFlowId, data.step);
        })

        socket.on("completestep", (data) => {
            // stopStep(data.stepId);
            console.log("completed data is ");
            console.log(data);
            // logs.push(data.response);
            updateLogs((prev) => {
                return [...prev, data.response];
            })
            completeStep(data.workFlowId, data.step, data.response);

        });

        socket.on("errorstep", (data) => {
            // stopStep(data.stepId);
            console.log("error data is ");
            console.log(data);
            // logs.push(data.response);
            updateLogs((prev) => {
                return [...prev, data.response];
            })
            errorState(data.workFlowId, data.step, data.response);

        });



        return () => {
            socket.off('foo');
        };
    }, []);




    return {
        state,
        logs
    }
}

export default useSocket
