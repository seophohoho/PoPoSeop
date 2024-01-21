const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { join } = require('node:path');
const bodyParser = require('body-parser')
const database = require('./config/database')
require("dotenv").config(); // 모듈 불러오기

const app = express();
app.use(bodyParser.json())
app.set('port',process.env.PORT || 8080);
const server = createServer(app);
database.connect();

app.use(cors({
  origin: '*' //모든 요청 승인. 테스트 용도로만 이렇게 놔두도록 하자.
}));

const AccountRouter = require('./routes/AccountRoute');

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './static/main.html'));
});

app.use('/account',AccountRouter);

server.listen(app.get('port'), () => {
  console.log('server running at '+app.get('port'));
});