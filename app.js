const express = require('express');
const app = express();

const dbgr = require('debug')('app:js');

app.get('/', (req,res)=>{
    res.send('Main Server Running');
});

app.listen(3000, ()=>{
    dbgr('Server is running on port 3000');
});