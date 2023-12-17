const router = require("@gregvanko/nanox").Express.Router()
const AuthBasic = require("@gregvanko/nanox").NanoXAuthBasic
const LogStatApi = require("@gregvanko/nanox").NanoXLogStatApi
const LogError = require("@gregvanko/nanox").NanoXLogError

const GetBlockOfPosts = require("./HelperPost").GetBlockOfPosts
const AddModifyPost = require("./HelperPost").AddModifyPost

// Get Last post by block
router.get("/lastposts/:BlockNumberOfPostToLoad", AuthBasic, (req, res) => {
    GetBlockOfPosts(req.params.BlockNumberOfPostToLoad, res, req.user)
    if(req.params.BlockNumberOfPostToLoad == 0){
        LogStatApi("post/lastposts", "get", req.user)
    }
})

// Add one post
router.post("/add", AuthBasic, async (req, res) => {
    const TrackPost = req.body
    if (JSON.stringify(TrackPost) != "{}"){
        AddModifyPost(TrackPost, res, req.user)
    } else {
        const TheError = `Route /post POST error: Data not found in req`
        res.status(500).send(TheError)
        LogError(TheError, req.user)
    }
    LogStatApi("post", "post", req.user)
})

module.exports = router