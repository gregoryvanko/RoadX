const router = require("@gregvanko/nanox").Express.Router()
const AuthBasic = require("@gregvanko/nanox").NanoXAuthBasic
const LogStatApi = require("@gregvanko/nanox").NanoXLogStatApi

const GetBlockOfPosts = require("./HelperPost").GetBlockOfPosts

router.get("/lastposts/:BlockNumberOfPostToLoad", AuthBasic, (req, res) => {
    GetBlockOfPosts(req.params.BlockNumberOfPostToLoad, res, req.user)
    if(req.params.BlockNumberOfPostToLoad == 0){
        LogStatApi("post/lastposts", "get", req.user)
    }
})

module.exports = router