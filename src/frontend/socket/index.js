import c from '@f/const';
import openSocket from 'socket.io-client';

const socket = openSocket(c.host);

export default socket;
