import io from "socket.io-client";

const _socket = io(process.env.REACT_APP_SOCKET_IO);
export const socket = _socket;
