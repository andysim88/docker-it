const { generateHashedPassword, compareHashedPWAndLoginPW } = require("./sercurity/hashing");
const { encrypt, decrypt } = require("./sercurity/enDecryption");
const authenticationToken = require("./sercurity/verifyToken");
const { dbo } = require("./db");

module.exports.userModel = {
    authenticateUserLogin: ({ username: loginUsername, password: loginPassword }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const loginStatus = { authenticateStatus: false, message: "Login Authentication Failed" };

                const db = await dbo.connectToServer("audio-host");
                const userObj = await db.collection("users").findOne({
                    username: loginUsername,
                });

                console.log("authenticateUserLogin::loginUsername", loginUsername);
                console.log("authenticateUserLogin::userObj", userObj);

                if (!userObj) {
                    loginStatus.message = `Username ${loginUsername} does not exist`;
                    loginStatus.authenticateStatus = false;
                    resolve(loginStatus);
                    return;
                }
                const { username, password } = userObj;
                const passwordAuthenticated = loginPassword === password;

                if (passwordAuthenticated) {
                    loginStatus.message = "Successful Login";
                    loginStatus.authenticateStatus = true;
                    resolve({ ...loginStatus, ...authenticationToken.generateAccessToken(userObj) });
                } else {
                    // unsuccessfully authentication (password)
                    loginStatus.message = `Password is not correct`;
                    loginStatus.authenticateStatus = false;
                    resolve(loginStatus);
                }
            } catch (err) {
                console.error(
                    `Error Authenticating username: ${loginUsername} & Password: ${loginPassword}  from  Database`,
                    err.stack
                );
                reject(err);
            }
        });
    },
};
