import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

// javascript : 한번에 많은 일을 할 수 있다 -> default로 기다리지 않는다. (다른 작업 동시 실행)
// async, await를 통해 기다리게 해야한다. (await 부분이 끝나기 전까지 다음을 시행 X) (cf : error 후 실행 : try catch need)
// Video.find({}) -> 모든 Video를 가져옴

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 });
        res.render("home", { pageTitle: "Home", videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }
};

export const search = async (req, res) => {
    const {
        query: { term: searchingBy },
    } = req;
    // equivalent
    // const searchingBy = req.query.term;
    let videos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" },
        });
        // Video.find({title: searchingBy}) -> 정확히 일치하는 것만 찾음 -> regex를 통한 정규방정식(비슷한 것 포함)
    } catch (error) {
        console.log(error);
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
    res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { location },
    } = req;
    const newVideo = await Video.create({
        fileUrl: location,
        title,
        description,
        creator: req.user._id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const video = await Video.findById(id)
            .populate("creator")
            .populate("comments");
        res.render("videoDetail", { pageTitle: video.title, video });
        // video == video:video (진화된 js 작성법)
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const getEditVideo = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const video = await Video.findById(id);
        if (video.creator.toString() !== req.user._id.toString()) {
            throw Error();
            // try에서 error를 발생시키면 자동적으로 catch로 이동시킴
        } else {
            res.render("editVideo", {
                pageTitle: `Edit [${video.title}]`,
                video,
            });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description },
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const video = await Video.findById(id);
        if (video.creator.toString() !== req.user._id.toString()) {
            throw Error();
            // try에서 error를 발생시키면 자동적으로 catch로 이동시킴
        } else {
            await Video.findOneAndRemove({ _id: id });
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};

// Register Video View
// api는 db와의 통신을 위함 -> 화면을 변화 시키지 않고 db의 정보를 수정 ... 다른 서비스와 통신
export const postRegisterView = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
        //200 : ok, 400 : error
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

// Add Comment
export const postAddCommnet = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user,
    } = req;
    try {
        const video = await Video.findById(id);
        const newComment = await Comment.create({
            text: comment,
            creator: user._id,
        });
        video.comments.push(newComment.id);
        video.save();
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

export const postRemoveComment = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        await Comment.findOneAndRemove({ _id: id });
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};
