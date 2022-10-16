const io = require('socket.io')

const socket = io('ws:https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=100&offset=0');

socket.on('connect',(socket)=>{
    console.log(socket)
})