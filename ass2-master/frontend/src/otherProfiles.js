import { apiCall, getProfile, userPwd, clearDisplayProfile } from './main.js'
import { addPost, addJobTitle, addJobImage, 
    addJobStartDate, addJobDesc, addTimePosted} from './feed.js';
import { addEditOption, addDeleteOption, showProfile } from './myProfile.js';

/**
 * Follow and unfollow backend response
 * @param {*} email persons email that you want to follow
 * @param {*} turnon true or false?
 * @returns 
 */

export const followUnfollow = (email, turnon) => {
    return apiCall("user/watch", 'PUT', {
        email,
        turnon
    });
}

/** Shows users own profile -> move to feedactions later
*   @param {Object} body Body that contains other user information
*   @param {Integer} idCount a counter that helps loop through jobs + create specific id's
*   @param {Integer} authUserId the user that is logged in, their ID 
*/
export const showOtherUserProfile = (body, idCount, authUserId) => {
    const name = body.name;
    const email = body.email;
    const id = body.id
    const followers = body.watcheeUserIds;
    const image = body.hasOwnProperty("image") ? body.image : null;
    const jobs = body.jobs;

    document.getElementById("news-feed").style.display = "none"

    const otherProfile = document.querySelector('.other-profiles')
    otherProfile.style.display = "flex"
    if (otherProfile.contains(document.getElementById("profile-page" + id))) {
        return;
    }

    const userProfile = document.createElement('div')
    userProfile.id = "profile-page" + id
    userProfile.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center
    `
    otherProfile.appendChild(userProfile)
    if (image === null) {
        const userNoImage = document.createElement('h6')
        userNoImage.appendChild(document.createTextNode("(USER HAS NO IMAGE)"))
        userProfile.appendChild(userNoImage)
    } else {
        const userImage = document.createElement('img')
        userImage.id = "other-profile-image" + id
        userImage.src = image
        userImage.style.cssText = `
            height: 45px;
            widhth: 45px;
        `
        userProfile.appendChild(userImage)
    }

    createFollowButton(userProfile, id);
    followUnfollowAction(id, authUserId, "profile")
    
    // Creates other users name
    displayOthersName(userProfile, name)
    
    // Creates other users email
    displayOthersEmail(userProfile, email)

    // Creates other users followers list
    displayOthersFollowers(userProfile, followers)

    // Allows followers to click onto other peoples followers in the profile
    // view page
    followers.forEach(id => {
        document.getElementById("user-follower-" + id).addEventListener('click', () => {
            getProfile(id).then((body) => {
                if (authUserId == body.id) {
                    showProfile(body.name, body.email, userPwd, authUserId, idCount)
                } else {
                    clearDisplayProfile(".other-profiles")
                    showOtherUserProfile(body, idCount, authUserId)
                }
            });
        })
    })
    
    // Displays all of the other users job posts
    let boldedText = document.createElement('b')
    boldedText.style.fontWeight = "bold"
    boldedText.appendChild(document.createTextNode("Job(s): "))
    userProfile.appendChild(boldedText)
    for (let i in jobs) {
        showJobPostsProfile(jobs[i], idCount, authUserId, userProfile, "other")
        idCount++
    }
};

/**
 * Shows all the jobs posts on the persons profile
 * @param {*} body array of jobs
 * @param {*} idCount id count
 * @param {*} authUserId users id
 * @param {*} userProfile div of user profile
 */
export const showJobPostsProfile = (body, idCount, authUserId, userProfile, userOrOther) => {
    const createdAt = body.createdAt
    const creatorId = body.creatorId
    const desc = body.description
    const image = body.image
    const startDate = body.start
    const title = body.title
    
    // Creates container for all the posts
    const postContainer = document.createElement('div')
    postContainer.className = "news-feed-container"
    postContainer.id = "job-post" + idCount
    // Creates new post within the container
    const newPost = addPost(postContainer);
    // Adds job title
    addJobTitle(newPost, title, idCount);
    // Adds job image
    addJobImage(newPost, image, idCount);
    // Adds job start date
    addJobStartDate(newPost, startDate);
    // Adds job description
    addJobDesc(newPost, desc);
    // Adds time posted
    addTimePosted(newPost, createdAt)
    // Adds Edit and delete options for the job post
    // only viewable in persons own profile
    if (userOrOther == "profile") {
        addEditOption(body, idCount, newPost)
        addDeleteOption(body, idCount, newPost)
    }
    postContainer.appendChild(newPost)
    userProfile.appendChild(postContainer)
} 

// Display other user name
const displayOthersName = (userProfile, name) => {
    const userName = document.createElement('p')
    let boldedText = document.createElement('b')
    boldedText.style.fontWeight = "bold"
    boldedText.appendChild(document.createTextNode("Name: "))
    userName.appendChild(boldedText)
    userName.appendChild(document.createTextNode(name))
    userProfile.appendChild(userName)
}

// Display other user email
const displayOthersEmail = (userProfile, email) => {
    const userEmail = document.createElement('p')
    let boldedText = document.createElement('b')
    boldedText.style.fontWeight = "bold"
    boldedText.appendChild(document.createTextNode("Email: "))
    userEmail.appendChild(boldedText)
    userEmail.appendChild(document.createTextNode(email))
    userProfile.appendChild(userEmail)
}

// Display other users followers in a list
export const displayOthersFollowers = (userProfile, followers) => {
    const followersText = document.createElement('p')
    followersText.style.fontWeight = "bold"
    followersText.appendChild(document.createTextNode("Followers: "))
    userProfile.appendChild(followersText)

    const userFollowersList = document.createElement('ul')
    followers.forEach(followerId => {
        let userFollower = document.createElement('li')
        let userFollowersLink = document.createElement('a')
        userFollowersLink.style.cursor = "pointer"
        userFollowersLink.id = "user-follower-" + followerId
        let followersName = null
        getProfile(followerId).then((body) => {
            followersName = body.name
            userFollowersLink.appendChild(document.createTextNode(followersName))
        })
        userFollower.appendChild(userFollowersLink)
        userFollowersList.appendChild(userFollower)
    })
    userProfile.appendChild(userFollowersList)
}

// Create follow button on other users' profile pages
export const createFollowButton = (userProfile, profileId) => {
    let followButton = document.createElement('button')
    followButton.classList = "follow-profile-button"
    followButton.id = "follow-profile-button-" + profileId
    followButton.appendChild(document.createTextNode("FOLLOW"))
    userProfile.appendChild(followButton)
}

// Follow and unfollowing action - not made live yet
export const followUnfollowAction = (profileId, authUserId) => {
    let followBool = false
    let profileEmail = null
    let profileFollowers = null
    let profileCall = document.getElementById("follow-profile-button-" + profileId)

    getProfile(profileId).then((body) => {
        profileEmail = body.email
        profileFollowers = body.watcheeUserIds
        if (profileFollowers.includes(authUserId)) {
            profileCall.classList.add("yes-followed")
            profileCall.innerText = "UNFOLLOW"
        }
    })

    document.getElementById("follow-profile-button-" + profileId).addEventListener('click', (e) => {
        e.target.classList.toggle("yes-followed")
        // Follow the user
        if (e.target.innerText == "FOLLOW") {
            followBool = true
            console.log("your now following")
            e.target.innerText = "UNFOLLOW"
        }
        // Unfollow the user
        else {
            followBool = false
            console.log("you just unfollowed :(")
            e.target.innerText = "FOLLOW"
        }
        followUnfollow(profileEmail, followBool).then((body) => {
            console.log(body)
        })
    })
}