// const removeBtn = document.getElementById("jsRemoveBtn");
const removeBtns = document.querySelectorAll("#jsRemoveBtn");
const commentNumber = document.getElementById("jsCommentNumber");
const commentCount = document.getElementById("jsCommentCount");
const ul = document.getElementById("jsCommentList");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
  if (commentNumber.innerHTML === "1") {
    commentCount.innerHTML = "   comment";
  } else if (commentNumber.innerHTML === "0") {
    commentCount.innerHTML = "   comments";
  }
};

// fake comment
const removeComment = (targetLi) => {
  ul.removeChild(targetLi);
  decreaseNumber();
};

function handleRemove(event) {
  event.preventDefault();
  const commentId = event.target.parentNode.attributes.jscommentid.value;
  fetch(`/api/${commentId}/remove-comment`, {
    method: "POST",
  });
  removeComment(event.target.parentNode);
}

function init() {
  for (let i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener("click", handleRemove);
  }
}

if (removeBtns) {
  init();
}
