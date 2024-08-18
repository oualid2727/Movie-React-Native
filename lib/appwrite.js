import { Client,Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platforme : 'com.oualid.aora',
    projectId : '66c1e75d0002d878b69a',
    databaseId: '66c1e8d0003bda813102',
    userCollectionId : '66c1e9270008b3e58199',
    videoCollectionId : '66c1e9490021bd60ebf7',
    storageId : '66c1ea770018a9cb4c6e'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platforme) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases (client)

export const createUser = async (email, password, username) =>{

    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId, 
            config.userCollectionId, 
            ID.unique(), 
            {
            accountId: newAccount.$id,
            email,
            username,
            avatar : avatarUrl
        }
    )
    return newUser
    } catch (error) {
        console.log(error);
        throw new Error (error)
    }

}

export const signIn = async (email, password) => {

    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        throw new Error (error)
    }
}

export const getCurrentUser = async ()=>{
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}
