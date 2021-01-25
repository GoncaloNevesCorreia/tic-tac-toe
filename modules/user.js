const fs = require('fs');

class User {
    constructor() {
        this.users = [];
    }

    addUser(session_id, temp_session_id) {
        const name = "player" + Math.round(Math.random() * 10000);

        let user = { session_id, name, temp_session_id, online: false, gamesWon: 0 };

        this.users.push(user);

        this.updateDBWithMemory();

        return user;
    }

    getUser(session_id) {
        return this.users.filter((user) => user.session_id === session_id)[0];
    }


    removeUser(session_id) {
        let user = this.getUser(session_id);

        if (user) {
            this.users = this.users.filter((user) => user.session_id !== session_id);
        }

        return user;
    }

    getUserByCurrent_Session_ID(temp_session_id) {
        return this.users.filter((user) => user.temp_session_id === temp_session_id)[0];
    };

    changeName(userID, name) {
        const user = this.getUser(userID);
        user.name = name;

        this.updateDBWithMemory();
    }

    updateUserScore(userID) {
        const user = this.getUser(userID);
        user.gamesWon++;
        this.updateDBWithMemory();
    }

    updateDBWithMemory() {
        let data = JSON.stringify(this.users, null, 2);
        fs.writeFileSync('users.json', data);
    }

    syncWithUsersDB() {
        fs.readFile('users.json', (err, data) => {
            if (err) return;
            let pasedData = JSON.parse(data);
            this.users = pasedData;

            let changes = false;
            this.users.forEach(user => {
                if (user.online) {
                    user.online = false;
                    changes = true;
                }
            });
            if (changes) this.updateDBWithMemory();
        })
    }

    getTopScores(limit) {
        let temp_users_array = this.users;
        temp_users_array.sort(function(a, b) {
            if (a.gamesWon > b.gamesWon) {
                return -1;
            }
            if (a.gamesWon < b.gamesWon) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });


        let response = [];
        for (let i = 0; i < temp_users_array.length && i < limit; i++) {
            let user = temp_users_array[i];
            response.push({
                name: user.name,
                score: user.gamesWon
            })
        }
        return response;
    }

}



module.exports = { User };