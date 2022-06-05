import { apiCall, getProfile } from './main.js'
import { likePostAction, commentPostAction } from './feedActions.js'
import { showOtherUserProfile, createFollowButton, followUnfollowAction } from './otherProfiles.js'
import { showProfile } from './myProfile.js'

// Get Job Post username API call
const getJobPostName = (userId) => {
    return apiCall(`user?userId=${userId}`, 'GET', {});
}

/**
 * Shows Job News Feed
 * @param {*} body stores the information on the job post
 * @param {*} idCount id counter
 * @param {*} authUserId user logged in, their id
 * @param {*} userName user logged in, their name
 * @param {*} userPwd user logged in, their pwd
 */
export function showJobPost(body, idCount, authUserId, userName, userPwd) {
    const comments = body.comments
    const commentCount = comments.length
    const createdAt = body.createdAt
    const creatorId = body.creatorId
    const desc = body.description
    const image = body.image
    const likes = body.likes
    const likeCount = likes.length
    const startDate = body.start
    const title = body.title
    const jobId = body.id
    
    // Adding posts to feed

    // creatorId -> might need to be added to delete

    const postContainer = document.getElementById('news-feed')
    const newPost = addPost(postContainer, idCount);
    // Add job title
    addJobTitle(newPost, title, idCount);
    // Add job image
    addJobImage(newPost, image, idCount);
    // Add job start date
    addJobStartDate(newPost, startDate);
    // Add job description
    addJobDesc(newPost, desc);
    // Add post interactions - like & comment
    const postInteractions = addPostInteractions(newPost, idCount);
    // Adds like features
    addJobLikeCount(postInteractions, likeCount, idCount);
    addJobLikedByModal(postInteractions, likes, idCount, authUserId, userPwd);
    const postLikeButton = addJobLikeButton(postInteractions, idCount)
    // Adds commenting features
    addJobComment(newPost, postInteractions, commentCount, comments, idCount, authUserId, userPwd)
    // Add job creator
    addPostCreator(newPost, creatorId, idCount, authUserId);
    // Add time posted
    addTimePosted(newPost, createdAt)

    // Like and comment on the post actions
    likePostAction(postLikeButton, likes, jobId, idCount, authUserId, userName);
    commentPostAction(jobId, idCount, userName)
}

// Adds posts to feed
export const addPost = (postContainer, idCount) => {
    const newPost = document.createElement('div');
    newPost.className = 'post'
    newPost.id = 'post' + idCount
    postContainer.appendChild(newPost)
    return newPost
}

// Adding Job Title
export const addJobTitle = (newPost, title, idCount) => {
    const postTitle = document.createElement('h3')
    postTitle.className = 'job-title'
    postTitle.id = 'job-title' + idCount
    postTitle.appendChild(document.createTextNode(title))
    newPost.appendChild(postTitle)
}

// Adding job image
export const addJobImage = (newPost, image, idCount) => {    
    const postImage = document.createElement('img')
    postImage.src = image;
    postImage.className = 'job-image'
    postImage.className = 'job-image' + idCount
    postImage.style.width = "100px"
    newPost.appendChild(postImage)
}

// Adding Job Start Date
export const addJobStartDate = (newPost, startDate) => {
    const postStartDate = document.createElement('p')
    postStartDate.className = 'job-starting-date'
    const parsedDate = new Date(startDate.replace('T', ' ').replace('Z', ''))
    const formattedStart = parsedDate.getDate() + '/' + (parsedDate.getMonth()+1) + '/' + parsedDate.getFullYear()
    postStartDate.appendChild(document.createTextNode("Starting Date: " + formattedStart))
    newPost.appendChild(postStartDate)
}

// Adding job desc
export const addJobDesc = (newPost, desc) => {
    const postDesc = document.createElement('p')
    postDesc.classname = 'job-desc'
    postDesc.appendChild(document.createTextNode(desc))
    newPost.appendChild(postDesc)
}

 // Adding post interactions
const addPostInteractions = (newPost, idCount) => {
    const postInteractions = document.createElement('div')
    postInteractions.className = 'post-interactions'
    postInteractions.id = 'post-interactions' + idCount
    newPost.appendChild(postInteractions)
    return postInteractions
}

// Displays list of likers through a pop up modal
const addJobLikedByModal = (postInteractions, likes, idCount, authUserId, userPwd) => {
    const likedByButton = document.createElement('button')
    likedByButton.id = 'liked-by-button' + idCount;
    likedByButton.appendChild(document.createTextNode("Liked By"))
    postInteractions.appendChild(likedByButton)

    const likedByModal = document.createElement('div')
    likedByModal.className = "modal-container"
    likedByModal.id = "modal-container" + idCount
    postInteractions.appendChild(likedByModal)

    const likedByModalContent = document.createElement('div')
    likedByModalContent.className = "modals-content"
    likedByModalContent.id = "modals-content" + idCount
    likedByModal.appendChild(likedByModalContent)

    const likedByCross = document.createElement('div')
    likedByCross.className = "close-button"
    likedByCross.id = "close-button" + idCount
    likedByCross.innerText = "x"
    likedByModalContent.appendChild(likedByCross)

    const ulModalList = document.createElement('ul')
    ulModalList.id = "ulModalId" + idCount
    addListOfLikers(ulModalList, likes, idCount, authUserId, userPwd)
    likedByModalContent.appendChild(ulModalList)

    showLikesModal(likedByButton.id, likedByModal.id, likedByCross.id);
}

// Adds list of likers into the modal
export const addListOfLikers = (ulModalList, likes, idCount, authUserId, userPwd) => {
    for (let i in likes) {
        let acctLikerLink = document.createElement('a')
        acctLikerLink.appendChild(document.createTextNode(likes[i].userName))
        acctLikerLink.style.color = "blue"
        clickToShowProfile(idCount, likes[i].userId, acctLikerLink, authUserId, userPwd)
        let acctLiker = document.createElement('li')
        acctLiker.appendChild(acctLikerLink)
        acctLiker.appendChild(document.createTextNode(", " + likes[i].userId));
        ulModalList.appendChild(acctLiker)
    }
}

// Show the likes modal pop up
const showLikesModal = (buttonId, modalId, modalCrossId) => {
    const button = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const cross = document.getElementById(modalCrossId);

    // open the modal when liked-by button is clicked
    button.addEventListener('click', () => {
        modal.style.display = "block";
    });

    // close modal when 'x' is clicked
    cross.addEventListener('click', () => {
        modal.style.display = "none";
    });
}

// Adding job like count
const addJobLikeCount = (postInteractions, likeCount, idCount) => {
    const postLikeCount = document.createElement('p')
    postLikeCount.className = 'job-like-count'
    postLikeCount.id = "job-like-count" + idCount
    postLikeCount.appendChild(document.createTextNode(likeCount + " Likes"))
    postInteractions.appendChild(postLikeCount)
    return postLikeCount
}

// Like the post button
const addJobLikeButton = (postInteractions, idCount) => {
    const postLikeButton = document.createElement('input')
    postLikeButton.classList = "like-button"
    postLikeButton.id = "like-button" + idCount
    postLikeButton.type = "submit"
    postLikeButton.value = "LIKE"
    postInteractions.appendChild(postLikeButton)
    return postLikeButton
}

// Adds job comments
const addJobComment = (newPost, postInteractions, commentCount, comments, idCount, authUserId, userPwd) => {
    
    addCommentInput(postInteractions, idCount)
    addCommentSubmit(postInteractions, idCount)
    addCommentCount(postInteractions, idCount, commentCount)

    // Adding list of people who have commented
    const postCommentList = document.createElement('ul')
    postCommentList.className = "comment-list"
    postCommentList.id = "comment-list" + idCount
    addListOfComments(comments, idCount, authUserId, userPwd)
    newPost.appendChild(postCommentList);
}

// Adds list of comments 
export const addListOfComments = (postCommentList, comments, idCount, authUserId, userPwd) => {
    for (let j in comments) {
        let commenterName = comments[j].userName
        let commenterId = comments[j].userId
        let commenterNameDisplay = document.createElement('a')
        commenterNameDisplay.appendChild(document.createTextNode(commenterName))
        commenterNameDisplay.style.color = "blue"
        clickToShowProfile(idCount, commenterId, commenterNameDisplay, authUserId, userPwd)
        let commentIteration = document.createElement('li');
        commentIteration.appendChild(commenterNameDisplay)
        commentIteration.appendChild(document.createTextNode(": " + comments[j].comment))
        postCommentList.appendChild(commentIteration)
    }
}

// Adding Comment Input
const addCommentInput = (postInteractions, idCount) => {
    
    const postCommentInput = document.createElement('input')
    postCommentInput.className = "comment-input"
    postCommentInput.id = "comment-input" + idCount
    postCommentInput.type = "text"
    postInteractions.appendChild(postCommentInput)
}

// Adding comment submit button
const addCommentSubmit = (postInteractions, idCount) => {
    // Adding Comment Submit button
    const postCommentSubmit = document.createElement('input')
    postCommentSubmit.type = "submit"
    postCommentSubmit.className = "comment-input-button"
    postCommentSubmit.id = "comment-input-button" + idCount
    postCommentSubmit.appendChild(document.createTextNode("COMMENT"))
    postInteractions.appendChild(postCommentSubmit)
}

// Comment count
const addCommentCount = (postInteractions, idCount, commentCount) => {
    const postCommentCount = document.createElement('p')
    postCommentCount.className = "comment-count"
    postCommentCount.id = "comment-count" + idCount
    postCommentCount.appendChild(document.createTextNode(commentCount + " comments"))
    postInteractions.appendChild(postCommentCount)
}

// Adding creator of post
const addPostCreator = (newPost, creatorId, idCount, authUserId) => {
    let creatorName = null;
    let postName = document.createElement('a')
    postName.className = 'posted-by'
    postName.id = 'posted-by' + idCount
    postName.style.cursor = "pointer"
    getJobPostName(creatorId).then((body) => {
        creatorName = body.name
        postName.appendChild(document.createTextNode(creatorName))
        newPost.appendChild(postName)
    })

    // If job post creator name tag is clicked, it will take you to their profile
    clickToShowProfile(idCount, creatorId, postName, authUserId)
}

// Adding time posted
export const addTimePosted = (newPost, createdAt) => {
    let postedTime = document.createElement('p')
    postedTime.className = "posted-time"
    let postedTimeParse = new Date(createdAt.replace('T', ' ').replace('Z', ''))
    let todayTime = new Date()
    let diffTime = todayTime - postedTimeParse
    if (diffTime < 86400000) {
        let minutes = Math.floor((diffTime / (1000 * 60) % 60))
        let hours = Math.floor((diffTime / (1000 * 60 * 60) % 24))
        postedTime.appendChild(document.createTextNode("Posted at: " + hours + " hours and " + minutes + " minutes ago"))
    } else {
        let formattedPostedDate = postedTimeParse.getDate() + '/' + (postedTimeParse.getMonth()+1) + '/' + postedTimeParse.getFullYear()
        postedTime.appendChild(document.createTextNode("Posted on: " + formattedPostedDate))
    }
    newPost.appendChild(postedTime);
}

// If job post creator name tag is clicked, it will take you to their profile
const clickToShowProfile = (idCount, id, tag, authUserId, userPwd) => {
    tag.addEventListener('click', () => {
        document.getElementById("news-feed").style.display = "none"
        getProfile(id).then((body) => {
            if (id == authUserId) {
                showProfile(body.name, body.email, userPwd, authUserId)
            } else {
                showOtherUserProfile(body, idCount, authUserId)
            }
        });
    })
}
