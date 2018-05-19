const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


const DEFAULT_PORT_NUM = 3000;
const apiPrefix = '/api/v1';

const inputPort = process.argv[2];

let portNum = DEFAULT_PORT_NUM;
if (inputPort) {
    portNum = inputPort;
}

const generateNewNo = () => {
    let maxNo = 0;
    IN_MEMORY_USER_DB.forEach(user => {
        if (user.no > maxNo) {
            maxNo = user.no;
        }
    });
    return maxNo + 1;
}

const IN_MEMORY_USER_DB = [
    { no: 1, id: 'user-1', name: 'Woojin', phoneNum: '010-123-1234', mail: 'user-1@gmail.com', birthDate: '', sex: 'M' },
    { no: 2, id: 'user-2', name: 'Minsu', phoneNum: '010-123-1234', mail: 'user-2@abc.com', birthDate: '', sex: 'M' },
    { no: 3, id: 'user-3', name: 'Sujin', phoneNum: '010-123-1234', mail: 'user-3@naver.com', birthDate: '', sex: 'M' },
    { no: 4, id: 'user-4', name: 'Yuna', phoneNum: '010-123-1234', mail: 'user-4@test.com', birthDate: '', sex: 'M' },
    { no: 5, id: 'user-5', name: 'Min', phoneNum: '010-123-1234', mail: 'user-5@test.com', birthDate: '', sex: 'F' }
];

app.get(`${apiPrefix}/users`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    if (IN_MEMORY_USER_DB.length === 0) {
        return res.status(404).send('등록된 사용자가 없습니다.');
    }

    const reduceFn = user => ({ no: user.no, name: user.name, mail: user.mail, phoneNum: user.phoneNum });
    return res.send(IN_MEMORY_USER_DB.map(reduceFn));
});

/**
 * 사용자 no로 조회
 */
app.get(`${apiPrefix}/users/:userNo`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    const userNo = Number.parseInt(req.params.userNo);
    console.log(`userNo: ${userNo}`);

    const searchResult = IN_MEMORY_USER_DB.filter(user => user.no === userNo);
    if (searchResult.length === 1) {
        return res.send(searchResult[0]);
    }

    return res.status(404).send(`no: ${userNo}에 해당하는 사용자가 없습니다.`);
});

/**
 * 사용자 업로드
 */
app.post(`${apiPrefix}/users`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    const newNo = generateNewNo();
    console.log(`create a new user no: ${newNo}`);
    const newUser = req.body;
    newUser.no = newNo;
    console.log(`created user: ${JSON.stringify(newUser)}`);

    IN_MEMORY_USER_DB.push(newUser);
    return res.send(newUser);
});

app.put(`${apiPrefix}/users/:userNo`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    const userNo = Number.parseInt(req.params.userNo);
    console.log(`userNo: ${userNo}`);

    const updatedUser = req.body;
    const idx = IN_MEMORY_USER_DB.findIndex((user) => user.no === userNo);
    console.log(`user memory db idx: ${idx}`);
    IN_MEMORY_USER_DB[idx] = updatedUser;

    return res.send(updatedUser);
});

app.delete(`${apiPrefix}/users/:userNo`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    const userNo = Number.parseInt(req.params.userNo);
    console.log(`userNo: ${userNo}`);

    const idx = IN_MEMORY_USER_DB.findIndex((user) => user.no === userNo);
    console.log(`user memory db idx: ${idx}`);

    removedUserList = IN_MEMORY_USER_DB.splice(idx, 1);
    return res.send(removedUserList[0]);
})

app.delete(`${apiPrefix}/users`, (req, res) => {
    console.log(`[${req.method}] ${req.originalUrl}`);

    IN_MEMORY_USER_DB = [];
    return res.send('clear');
});


const server = app.listen(portNum, () => console.log(`start to listening on port ${portNum}`));

server.on('connection', (socket) => {
    console.log(`conn created`);
});