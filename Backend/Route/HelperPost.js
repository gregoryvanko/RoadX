const LogError = require("@gregvanko/nanox").NanoXLogError
const LogInfo = require("@gregvanko/nanox").NanoXLogInfo

async function GetBlockOfPosts (BlockNumberOfPostToLoad, res, User = null){
    let Reponse = [{Titre:"Titre de mon premier post", Date:"26/11/2023", Description:"Chouette rando"},{Titre:"Titre de mon second post", Date:"27/11/2023", Description:""}]
    //let Reponse = []
    
    const NumberOfItem = 10
    const cursor = NumberOfItem * BlockNumberOfPostToLoad

    res.status(200).send(Reponse)

}

module.exports.GetBlockOfPosts = GetBlockOfPosts