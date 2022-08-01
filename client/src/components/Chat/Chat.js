import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message,setMessage] =useState("");
    const [messages,setMessages]=useState([]);
    const ENDPOINT="localhost:5000";
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        console.log(location.search);
        console.log(name, room);

        socket=io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit("join",{name,room},({error})=>{
            alert(error);
        });
        console.log(socket);
        return ()=>{
            socket.emit("disconnect");
            socket.off();
        }
    },[ENDPOINT,location.search]);

    useEffect(()=>{
        socket.on("message",(message)=>{
            setMessages([...messages,message])
        });
    },[messages]);

    const sendMessage=(event)=>{
        event.preventDefault();  //Prevent the default behaviour of refreshing the entire page
        if(message)
        {
            socket.emit("sendMessage",message,()=>setMessage(""));
        }
    }

    console.log(message,messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}></InfoBar>
                {/* <input value={message} onChange={(event)=>setMessage(event.target.value)} onKeyPress={event=>event.key==="Enter"?sendMessage(event):null} /> */}
            </div>
        </div>
    )
};

export default Chat;