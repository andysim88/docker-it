const express = require("express");
const app = express();
var cors = require("cors");
const { loadingByChunks, initUploading } = require("../models/audio/uploadFile");
const { dbo } = require("../models/db");
var bodyParser = require("body-parser");
const { userModel } = require("../models/user");
const authenticationToken = require("../models/sercurity/verifyToken");
const urlEndpints = require("../enpointURL.json");
const {
    getUserAudioCollection,
    deleteAudioTrack,
    updateUserAudioTrack,
    initAudioUpload,
    uploadAudioChunks,
    authenticateUserLogin,
    getAllUserList,
    addNewUser,
    deleteUser,
    updateUser,
} = urlEndpints;
// handle JWT token creation
const { verifyToken, validateAdminUserRole } = authenticationToken;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// +++++++++++++ AUDIO RELATED SERVICES +++++++++++++++++++++
// retrieve user playlist
app.post(`/${getUserAudioCollection}`, verifyToken, (req, res) => {
    const username = res.locals.username;
    const userID = res.locals.userID;
    console.log(getUserAudioCollection, { username, userID });
    (async () => {
        let collection = [];
        try {
            const db = await dbo.connectToServer("audio-host");
            collection = await db
                .collection("audiofiles")
                .find({ username }, { projection: { _id: 0 } })
                .toArray();
            res.send({ collection }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ collection }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

// delete audio from storage
app.delete(`/${deleteAudioTrack}/:audioKey`, verifyToken, (req, res) => {
    const { audioKey } = req.params;
    const username = res.locals.username;
    const userID = res.locals.userID;
    console.log(deleteAudioTrack, { username, userID, audioKey });
    (async () => {
        try {
            const db = await dbo.connectToServer("audio-host");
            await db.collection("audiofiles").deleteOne({
                username,
                key: audioKey,
            });
            res.send({ status: "success" }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ status: "fail" }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

// initalise uploading of audio chunts
app.post(`/${initAudioUpload}`, initUploading);

// uoloading of chucks/slices of files
app.post(`/${uploadAudioChunks}`, verifyToken, (req, res) => {
    const username = res.locals.username;
    const userID = res.locals.userID;
    console.log(uploadAudioChunks, { username, userID });
    loadingByChunks(req, res, { username, userID });
});

// ++++++++++++++++++++++++END OF AUDIO RELATED SERVICES +++++++++++++++++++++++++++++++

// +++++++++++++ USER & ACCOUNT RELATED SERVICES  +++++++++++++++++++++

/* input - username and password,
action - if username and pasword matches a record in database, generate JWT token with userid,username and access-rights as payload,
 return obj with login status, login message and JWT token */
app.post(`/${authenticateUserLogin}`, async (req, res) => {
    const credential = req.body;
    console.log(authenticateUserLogin, { credential });
    try {
        const loginAuthenticationStatusObj = await userModel.authenticateUserLogin(credential);
        console.log(authenticateUserLogin, loginAuthenticationStatusObj);
        res.status(200).send(loginAuthenticationStatusObj).end();
    } catch (err) {
        console.error(`Error Authentication ${credential.username} Login,`, err);
        res.status(500).send(`Retrieving ${credential.username} Account Password Information from SQL Database`).end();
        throw err;
    } finally {
        dbo.closeConnection();
    }
});

app.get(`/${getAllUserList}`, verifyToken, async (req, res) => {
    console.log(getAllUserList);
    (async () => {
        let usersList = [];
        try {
            const db = await dbo.connectToServer("audio-host");
            usersList = await db
                .collection("users")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            res.send({ usersList }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ usersList }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

app.post(`/${addNewUser}`, verifyToken, async (req, res) => {
    const { newUser } = req.body;
    console.log(addNewUser, { newUser });
    (async () => {
        try {
            const db = await dbo.connectToServer("audio-host");
            await db.collection("users").insertOne(newUser);
            res.send({ status: "success" }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ status: "fail" }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

app.delete(`/${deleteUser}/:userID`, verifyToken, (req, res) => {
    const { userID } = req.params;
    console.log(deleteUser, { userID });
    (async () => {
        try {
            const db = await dbo.connectToServer("audio-host");
            await db.collection("users").deleteOne({
                userID: userID,
            });
            res.send({ status: "success" }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ status: "fail" }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

app.put(`/${updateUser}/:userID`, verifyToken, (req, res) => {
    const { userID } = req.params;
    const updatedUserDetails = req.body;
    console.log(updateUser, { userID, updatedUserDetails });
    (async () => {
        try {
            const db = await dbo.connectToServer("audio-host");
            await db.collection("users").findOneAndUpdate({ userID }, { $set: updatedUserDetails }, { upsert: true });
            res.send({ status: "success" }).status(200);
        } catch (error) {
            console.error(error);
            res.send({ status: "fail" }).status(500);
        } finally {
            dbo.closeConnection();
        }
    })();
});

module.exports = app;
