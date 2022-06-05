import { apiCall } from './main.js'

// Like job API call
const likeJob = (id, turnon) => {
    return apiCall('job/like', 'PUT', {
        id,
        turnon
    })
}

// Commenting on job API call
const commentOnJob = (id, comment) => {
    return apiCall('job/comment', 'POST', {
        id,
        comment
    })
}

// Liking a post action
export const likePostAction = (postLikeButton, likes, jobId, idCount, authUserId, userName) => {
    let updateBool = false
    for (let i in likes) {
        console.log(likes)
        let likerId = likes[i].userId
        if (likerId === authUserId) {
            postLikeButton.classList.add("liked-yes")
        }
        console.log(likes[idCount])
        console.log(idCount)
        if (likes.length == 0) {
            console.log("No likers on your post :(")
        }
    }
    
    // toggles between liked and unliked
    document.getElementById(postLikeButton.id).addEventListener('click', (e) => {
        e.target.classList.toggle("liked-yes")
        if (e.target.classList.contains("liked-yes")) {
            updateBool = true
            likeJob(jobId, updateBool).then((body) => {
                console.log(body)
            });
        } 
        else {
            updateBool = false
            likeJob(jobId, updateBool).then((body) => {
                console.log(body)
            });
        }
    })
}

// Comment actions
export const commentPostAction = (jobId, idCount, userName) => {
    document.getElementById('comment-input-button' + idCount).addEventListener('click', () => {
        let commentInput = document.getElementById("comment-input" + idCount).value
        if (commentInput.length == 0) {
            let commentModal = document.getElementById("comment-input-modal")
            let cross = document.getElementById("comment-modal-close");
            commentModal.style.display = "block"
            cross.addEventListener('click', () => {
                commentModal.style.display = "none";
            });
            return;
        }
        commentOnJob(jobId, commentInput).then((body) => {
            console.log(body)
        });
        document.getElementById("comment-input" + idCount).value = null
    })
}
