import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 },
    } = req;
    if (password !== password2) {
        res.status(400); // status code : 브라우저에 에러코드를 보냄
        res.render("join", { pageTitle: "Join" });
    } else {
        // to do
        // 1. 사용자 등록하기
        try {
            const user = await User({
                name,
                email,
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
        // 2. 사용자 로그인시키기
    }
};

export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Log in" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home,
});

// cf - 사용하지 않는 argument가 있을 때 _, __로 자리를 매워줌
export const githubLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, avatar_url: avatarUrl, name, email },
    } = profile;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            // user.avatarUrl = avatarUrl;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl,
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const githubLogin = passport.authenticate("github");

export const facebookLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, name, email },
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.facebookId = id;
            user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const kakaoLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: {
            id,
            properties: { nickname: name },
            kakao_account: {
                email,
                profile: { profile_image_url: avatarUrl },
            },
        },
    } = profile;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.kakaoId = id;
            // user.avatarUrl = avatarUrl;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            avatarUrl,
            kakaoId: id,
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postKakaoLogin = (req, res) => {
    res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao");

export const logout = (req, res) => {
    // to do : logout 처리
    req.logout();
    res.redirect(routes.home);
};

export const getMe = async (req, res) => {
    const {
        user: { _id: id },
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const userDetail = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};
export const getEditProfile = (req, res) =>
    res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
    const {
        body: { _id: id, name, email },
        file,
    } = req;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.location : req.user.avatarUrl,
        });
        res.redirect(routes.me);
    } catch (error) {
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req, res) =>
    res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 },
    } = req;
    try {
        if (newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        res.redirect(`/users${routes.changePassword}`);
    }
};
