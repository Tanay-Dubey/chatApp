import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

const Chat = () => {
    const location = useLocation();
    //useLocation() is a react hook to return the current URL

    const [name, setName] = useState("");
    //useState() is a hook, used to track properties in a function component
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState("");
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

        socket.emit("join",{name,room},(error)=>{
            if(error)
            {
                alert(error);
            }
            
        });
        console.log(socket);
        return ()=>{ //return in useEffect is used to return a function when the component is unmounted
            socket.emit("disconnectit");
            socket.off();
        }
    },[ENDPOINT,location.search]);//These are the parameters which when altered, updates the component

    useEffect(()=>{
        socket.on("message",(message)=>{
            setMessages([...messages,message])
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
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
                <Messages messages={messages} name={name}></Messages>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}></Input>
            </div>
            <TextContainer users={users}></TextContainer>
        </div>
    )
};

export default Chat;