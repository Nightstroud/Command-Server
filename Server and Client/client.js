console.clear();
let username = null;
let usernameList = [];
const net = require('net');        // Client Code  .
const client = net.createConnection({ port: 3000 }, () => { // once connected .

    client.emit('connection');

});


client.on('connection', () => {

    console.clear();
    console.log('What would you like your username to be?\n');

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {

        let input;
        let go = true;
        let proceed = true;
        let gop = true;

        while ((input = process.stdin.read()) !== null) {
            let v = input.slice(0, input.length).trim();


                if (v.slice(0, 9) === '/username') {
                    v = v.slice(10, v.length);
                    v = v.split(' ', 1).toString();

                    if (v !== username) {
                            console.log('\nYour username has successfully been changed to ' + v + '.\n');
                            client.write(username + ': ' + '/username ' + v);
                            username = v;
                    }
                    else {
                        if (v === username) {
                            console.log('\nInvalid Input: That username is the same as the previously selected one.\n');
                        }
                    }
                    go = false;
                }


            if (username !== null && proceed === true) {
                if (go) {
                    console.log();
                    client.write(username + ': ' + v.trim().toString());
                }
            }

            else {
                usernameList.map(user => {
                    if (user === input.trim().toString()) {
                        console.log('\nInvalid Input: That username is currently in use by another client.');
                        gop = false;
                    }
                });
                if (gop === true) {
                    username = input.trim().toString();
                    client.write(username + ':' + ' has connected to the chat room.');

                    console.clear();
                    console.log('You have successfully connected to the server registered as: ' + username + '\n');
                    console.log('To disconnect type "/end" or "/disconnect". \nYou can also see available commands and how to use them by typing "/help"\n');
                }
            }


            go = true;
            proceed = true;
            gop = true;
        }
    });

    process.stdin.on('end', () => {
        console.log('The program has ended.');
    });
});


client.on('data', (data) => {
    let x = data.toString().split(' ', 1).toString().trim();
    if (x === 'Chat') {
        for (let i = 0; i < 5; i++) {
            data[i] = '';
        }

        console.log(data.toString());
    }
    else {
        console.log("Server: " + data.toString());
    }
});

client.on('end', () => {
    console.log('End of Message');
});