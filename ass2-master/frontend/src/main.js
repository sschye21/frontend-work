import { BACKEND_PORT } from './config.js';
import { showJobPost, addListOfComments, addListOfLikers } from './feed.js'
import { showProfile } from './myProfile.js'
import { followUnfollow } from './otherProfiles.js'

let authToken = null;
let authUserId = null;
let startValue = 0;
let userEmail = null;
let userName = null;
export let userPwd = null;

/**
 * 
 * @param {*} path the path (eg. auth/register)
 * @param {*} method either POST, PUT, GET, DELETE
 * @param {*} body has information and is used as per spec
 * @returns 
 */
export const apiCall = (path, method, body) => {
    return new Promise((resolve, reject) => {
        const init = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: (path === 'auth/register' || path === 'auth/login') ? undefined : authToken,
            },
            body: method == 'GET' ? undefined : JSON.stringify(body),
        };
        fetch(`http://localhost:${BACKEND_PORT}/${path}`, init)
            .then(response => response.json())
            .then(body => {
                if (body.error) {
                    console.log(body.error)
                    const modal = document.getElementById("base-error-modal")
                    modal.style.display = "block"
                    const close = document.getElementById("base-error-modal-close")
                    const text = document.getElementById("base-error-text")
                    text.innerText = body.error
                    close.addEventListener('click', () => {
                        modal.style.display = "none"
                    });
                } else {
                    resolve(body);
                }
            });
    });
}

// Register user
const register = (name, email, password) => {
    return apiCall('auth/register', 'POST', {
        name,
        email,
        password,
    });
}

// Login user
const login = (email, password) => {
    return apiCall('auth/login', 'POST', {
        email,
        password,
    });
}

// Getter for user profile
export const getProfile = (userId) => {
    return apiCall(`user?userId=${userId}`, 'GET', {});
}

// News Feed
export const showNewsFeed = (start) => {
    return apiCall(`job/feed?start=${start}`, 'GET', {});
}

// When login button is pressed
document.getElementById("btn-login").addEventListener('click', () => {
    const loginEmail = document.getElementById('login-email').value;
    const loginPwd = document.getElementById('login-password').value;
    userPwd = loginPwd;
    login(loginEmail, loginPwd).then((body) => {
        authToken = body.token;
        authUserId = body.userId;
        goToNewsFeed();
    });
});

// BONUS: password when registering must be minimum 8 characters and 1 number
document.getElementById("password-strength").disabled = true
document.getElementById("register-password").addEventListener('input', (e) => {
    const strength = document.getElementById("password-strength")
    strength.style.color = "black"
    // Minimum 8 characters and must have 1 number
    const pwdRequirements = /^(?=.*\d).{8,}$/
    if (!pwdRequirements.test(e.target.value)) {
        strength.style.backgroundColor = "red"
        strength.innerText = "WEAK"
    } else {
        strength.style.backgroundColor = "lightgreen"
        strength.innerText = "STRONG"
    }
})

// When register button is pressed
document.getElementById("btn-register").addEventListener('click', () => {
    const registerName = document.getElementById('register-name').value;
    const registerEmail = document.getElementById('register-email').value;
    const registerPwd = document.getElementById('register-password').value;
    const registerPwdConfirm = document.getElementById('register-confirm-password').value;

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ig
    const emailRegexResult = emailRegex.test(registerEmail)

    // If no name register attempt
    if (registerName == '') {
        let nameModal = document.getElementById("name-modal")
        let cross = document.getElementById("name-modal-close");
        nameModal.style.display = "block"
        cross.addEventListener('click', () => {
            nameModal.style.display = "none";
        });
        return;
    }

    // If no email register attempt
    if (registerEmail == '') {
        let emailModal = document.getElementById("email-modal")
        let cross = document.getElementById("email-modal-close");
        emailModal.style.display = "block"
        cross.addEventListener('click', () => {
            emailModal.style.display = "none";
        });
        return;
    }

    // If email is not of valid format
    if (!emailRegexResult) {
        let emailRegexModal = document.getElementById("email-regex-modal")
        let cross = document.getElementById("email-regex-modal-close");
        emailRegexModal.style.display = "block"
        cross.addEventListener('click', () => {
            emailRegexModal.style.display = "none";
        });
        return;
    }

    // If passwords do not match
    if (registerPwd !== registerPwdConfirm) {
        let pwdModal = document.getElementById("pwd-modal")
        let cross = document.getElementById("pwd-modal-close");
        pwdModal.style.display = "block"
        cross.addEventListener('click', () => {
            pwdModal.style.display = "none";
        });
        return;
    }

    register(registerName, registerEmail, registerPwd).then((body) => {
        authToken = body.token;
        authUserId = body.userId;
        goToLoginScreen();
    });
});

// Go to Profile Page
document.getElementById('profile-link-nav').addEventListener('click', () => {
    document.getElementById("news-feed").style.display = 'none';
    clearDisplayProfile(".other-profiles")
    showProfile(userName, userEmail, userPwd, authUserId)
});

// Switch to Jobs Board
document.getElementById('jobs-board-link-nav').addEventListener('click', () => {
    document.querySelector(".other-profiles").style.display = "none"
    document.getElementById("news-feed").style.display = 'block';
    document.getElementById("profile-page").style.display = 'none';
    clearDisplayProfile(".other-profiles")
    clearDisplayProfile(".userProfile")
    clearDisplayProfile(".own-followers")
});

// Switches to Login Screen
const goToLoginScreen = () => {
    document.getElementById("login-screen").style.display = 'flex';
    document.getElementById("register-screen").style.display = 'none';
};

// Switches to Register Screen
const goToRegisterScreen = () => {
    document.getElementById("login-screen").style.display = 'none';
    document.getElementById("register-screen").style.display = 'flex';
};

// Switches to news feed
const goToNewsFeed = () => {
    document.getElementById("login-screen").style.display = 'none';
    document.getElementById("register-screen").style.display = 'none';
    document.getElementById('navbar').style.display = 'block'
    document.getElementById("news-feed").style.display = 'block';
    getProfile(authUserId).then((body) => {
        userEmail = body.email;
        userName = body.name;
    });
    
    showNewsFeed(startValue).then((body) => {
        let idCount = 0
        console.log(body)
        for (let i in body) {
            showJobPost(body[i], idCount, authUserId, userName, userPwd)
            idCount++
        }
    })
    updateLive()
};

// Clears the other profile view div for good UI
export const clearDisplayProfile = (className) => {
    const otherProfiles = document.querySelector(className)
    while (otherProfiles.firstChild) {
        otherProfiles.removeChild(otherProfiles.lastChild)
    }
}

document.getElementById("register-switch-btn").addEventListener('click', goToRegisterScreen);
document.getElementById("login-switch-btn").addEventListener('click', goToLoginScreen);  

// following someone from job feed
document.getElementById("follow-someone").addEventListener('click', () => {
    const modal = document.getElementById("follow-someone-input-modal")
    modal.style.display = "block"
    const cross = document.getElementById("feed-follow-close")
    const submit = document.getElementById("feed-follow-submit")

    // close modal when 'x' is clicked
    cross.addEventListener('click', () => {
        modal.style.display = "none";
        return
    });

    submit.addEventListener('click', () => {
        const email = document.getElementById("feed-follow-input").value
        if (email == userEmail) {
            const sameEmailError = document.createElement('p')
            const inputContainer = document.querySelector(".follow-someone-input-container")
            sameEmailError.appendChild(document.createTextNode("You cant follow yourself..."))
            inputContainer.appendChild(sameEmailError)
            return;
        }
        followUnfollow(email, true).then(() => {
            console.log("your now following")
        })
        modal.style.display = "none";
    })
})

// Updates likes and comments live
const updateLive = () => {
    setInterval(function() {
        let idCount = 0
        showNewsFeed(startValue).then((body) => { 
            for (let i in body) {
                // Updates the likes count and list
                let likes = body[i].likes
                let comments = body[i].comments
                updateLikesLive(likes, idCount)
                updateCommentsLive(comments, idCount)
                idCount++
            }
        })
    }, 1500)
}

// Updates the likes and list of who has likes live
const updateLikesLive = (likes, idCount) => {
    let likeCounter = document.getElementById("job-like-count" + idCount);
    likeCounter.innerText = likes.length + " Likes"

    let ulModalList = document.getElementById("ulModalId" + idCount)
    ulModalList.innerText = ''
    
    addListOfLikers(ulModalList, likes, idCount, authUserId, userPwd)
}

const updateCommentsLive = (comments, idCount) => {
    let commentCounter = document.getElementById("comment-count" + idCount)
    commentCounter.innerText = comments.length + " comments"

    let postCommentList = document.getElementById("comment-list" + idCount)
    postCommentList.innerText = ''

    addListOfComments(postCommentList, comments, idCount, authUserId, userPwd)
}

