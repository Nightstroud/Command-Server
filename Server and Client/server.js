const net = require('net');  // Server Code .

let clientList = [];
let usernameList = [];

const server = net.createServer((socket) => {

    socket.on('data', (chunk) => {
        let x = chunk.toString().trim();
        x = x.split(':', 2);
        let y = x[1];

        let user = chunk.toString().split(':', 1).toString();
        if (y[1] === '/') {
            if (y.slice(2, 6).toString() === 'help') {
                clientList[usernameList.indexOf(user)].write('Whisper: (/w username string)\nExample: /w Nightstroud Hello There!!!\n\nUsername: (/username newName)\nExample: /username John\n\nKick: (/kick username password)\nExample: /kick John password\n\nClient List: (/clientlist)\nExample: /clientlist\n');
                return;
            }
            if (y.slice(2, 12).toString() === 'clientlist') {
                let string = '';
                usernameList.map(user => {
                   string += (usernameList.indexOf(user) + 1).toString() + '. ' + user + '\n'
                });
                clientList[usernameList.indexOf(user)].write('Chat ' + string);
                return;
            }
            if (y.slice(2, 6).toString() === 'kick') {
                let x = y.slice(7, y.length);
                x = x.split(' ', 2);
                let b = x[1];
                let a = x[0];
                if (b !== null || true) {
                    if (b.toString().trim() === 'password') {
                        if (usernameList.indexOf(a.toString().trim()) === -1) {
                            clientList[usernameList.indexOf(user)].write('Invalid Input: Username is not in use by any client.\n');
                        }
                        else if(a.toString().trim() === user) {
                            clientList[usernameList.indexOf(user)].write('Invalid Input: That is your username, please select someone else.\n');
                        }
                        else {
                            let index = usernameList.indexOf(a.toString().trim());
                            clientList[index].end();
                            let as = usernameList[index];
                            clientList.splice(index, 1);
                            usernameList.splice(index, 1);
                            console.log(as + ' has been disconnected from the chat.\n');
                            clientList.map(client => {
                                client.write(as + ' has been disconnected from the chat.\n');
                            });
                            return;
                        }
                    }
                    else {
                        clientList[usernameList.indexOf(user)].write('Invalid Input: The admin password is incorrect.\n');
                    }
                }
            }
            if (y[2] === 'w') {
                y = y.slice(4, y.length);
                let user1 = y.toString().split(' ', 1).toString();
                y = y.slice(user1.length + 1, y.length);
                if (user1 === user) {
                    clientList[usernameList.indexOf(user)].write('Chat ' + 'Invalid Input: ' + user + ' is your username.\n');
                    return;
                }
                let v = false;
                clientList.map(client => {
                    if (usernameList[clientList.indexOf(client)] === user1) {
                        client.write('Chat ' + user + ' Whispered: ' + y + '\n');
                        return v = true;
                    }
                });
                if (v === false) {
                    clientList[usernameList.indexOf(user)].write('Chat ' + 'Invalid Input: ' + user1 + ' is not a username associated with any connected clients.\n');
                }
                return;
            }
            if (y.slice(2, 10) === 'username') {
                y = y.slice(11, y.length);
                y = y.trim();
                let index = usernameList.indexOf(user);
                y = y.split(' ', 1);
                let b = usernameList[index];
                usernameList[index] = y.toString();
                console.log(b + ' has changed his username to: "' + y.toString() + '"\n');
                clientList.map(client => {
                   if (usernameList[clientList.indexOf(client)] !== y.toString()) {
                       client.write(b + ' has changed his username to: "' + y.toString() + '"\n');
                   }
                });
                return;
            }
        }

        if (y === ' /end' || y === ' /disconnect') {
            let x = usernameList.indexOf(user);
            let y = clientList[x];
            console.log(usernameList[x] + ': Has disconnected.\n');
            clientList.map(client => {
                return client.write('Chat ' + usernameList[x] + ': Has disconnected.\n');
            });
            y.end();
            const fs = require('fs');
            fs.readFile('./chat.log.txt', 'utf8', function(err, data) {
                if (err) throw err;
                fs.writeFile( './chat.log.txt', data + usernameList[x] + ': Has disconnected.\n\n', (err) => {});
                clientList.splice(x, 1);

                usernameList.splice(x, 1);
            });
        }

        else {
            if (clientList.indexOf(socket) === -1) {

                let username = chunk.toString().split(':', 1);
                usernameList.push(username.toString());

                socket.write('Welcome to the chat room ' + username + '.\n');
                clientList.push(socket);
            }
            let user = chunk.toString().split(':', 1).toString();

            console.log(chunk.toString() + '\n');
            let fs = require('fs');
            fs.readFile('./chat.log.txt', 'utf8', function(err, data) {
                if (err) throw err;
                fs.writeFile( './chat.log.txt', data + chunk.toString() + '\n\n', () => {});
            });
                clientList.map(client => {
                let x = clientList.indexOf(client);
                if (usernameList[x].toString().trim() !== user.toString().trim()) {
                    client.write('Chat ' + chunk.toString() + '\n');
                }
            });
        }
    });

    socket.on('end', () => {

    });

});
server.listen(3000, () => {
    console.clear();
    console.log('Server is up\n');
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {

        let input;

        while ((input = process.stdin.read()) !== null) {
            console.log();
            let x = input.trim();
            let fs = require('fs');
            fs.readFile('./chat.log.txt', 'utf8', function(err, data) {
                if (err) throw err;
                fs.writeFile( './chat.log.txt', data + 'Server: ' + x.toString() + '\n\n', () => {});
            });
            clientList.map(client => {
                return client.write(input.trim().toString() + '\n');
            });
        }
    });

    process.stdin.on('end', () => {
        console.log('The program has ended.');
    });
});
