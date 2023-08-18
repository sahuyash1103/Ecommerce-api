const User = require('../../mongo/models/user-model');
const { getKey, setExKey, deleteKey } = require('../../redis/redis-services');

async function getUserData(email) {
    let data;
    let isCached = false;
    let error = null;
    try {
        const cacheResults = await getKey(email);

        if (cacheResults) {
            isCached = true;
            data = User(cacheResults);

            if (
                data?.userName !== undefined ||
                data?.phone !== undefined ||
                data?.email !== undefined ||
                data?.password !== undefined
            ) {
                deleteKey(email);
                isCached = false;
                data = await User.findOne({ email: email });
                if (data) {
                    setExKey(email, data);
                }
            }
        } else {
            data = await User.findOne({ email: email });
            if (data) {
                setExKey(email, data);
            }
        }

    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: data, isCached: isCached, error: error };
}

async function updateUserData(email, dataToUpdate) {
    let error = '';
    let message = '';
    try {
        data = await User.updateOne({ email: email }, dataToUpdate);
        let user = await getKey(email);
        if (user)
            setExKey(email, { ...user, ...dataToUpdate });
        message = 'user data updated';
    } catch (e) {
        error = e;
        console.log("[MONGO]: no updation performed");
    }
    return { message: message, error: error };
}

module.exports = { getUserData, updateUserData };