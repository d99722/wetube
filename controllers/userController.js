import routes from "../routes";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = (req, res) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400); // status code : 브라우저에 에러코드를 보냄
    res.render("join", { pageTitle: "Join" });
  } else {
    // to do
    // 1. 사용자 등록하기
    // 2. 사용자 로그인시키기
    res.redirect(routes.home);
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log in" });
export const postLogin = (req, res) => {
  // 추가 : check : database의 아이디/pw와 동일한지 검사
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // to do : logout 처리
  res.redirect(routes.home);
};

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });
export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
