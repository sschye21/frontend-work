import { apiCall, getProfile, clearDisplayProfile } from './main.js'
import { fileToDataUrl } from './helpers.js';
import { showJobPostsProfile, displayOthersFollowers, showOtherUserProfile } from './otherProfiles.js';
import { jobErrorModal } from './jobActions.js'

// Updates job post details if called
const updateJobPost = (id, title, image, start, description) => {
    return apiCall("job", 'PUT', {
        id,
        title,
        image,
        start,
        description
    });
}

// Delete job post from database
const deleteJobPost = (id) => {
    return apiCall("job", "DELETE", {id})
}

// Updating users own profile info
const updateProfileInfo = (email, password, name, image, emailChange) => {
    if (emailChange) {
        return apiCall('user', 'PUT', {
            password,
            name,
            image
        });
    }
    return apiCall('user', 'PUT', {
        email,
        password,
        name,
        image
    });
}

// Shows users own profile
export const showProfile = (userName, userEmail, userPwd, userId, idCount) => {
    document.getElementById("profile-page").style.display = 'flex';
    document.querySelector(".other-profiles").style.display = "none";
    document.getElementById('profile-name').value = userName
    document.getElementById('profile-email').value = userEmail
    document.getElementById('profile-password').value = userPwd

    let image = null
    let profileImg = document.getElementById('profile-image')
    let preExistingEmail = null;
    let followers = null
    
    getProfile(userId).then((body) => {
        followers = body.watcheeUserIds
        preExistingEmail = body.email
        image = body.hasOwnProperty("image") && body.image.length != 0 ? body.image : null;
        if (image == null) {
            let profileTextNone = document.getElementById("profile-image-text-none")
            profileTextNone.innerText = "Upload a Profile Photo!"
        } else {
            profileImg.src = image
        }
        const ownFollowersDisplay = document.querySelector(".own-followers")
        // Displays followers
        displayOthersFollowers(ownFollowersDisplay, followers)
        followers.forEach(id => {
            // if a follower is clicked on, take them to the profile page of that follower
            document.getElementById("user-follower-" + id).addEventListener('click', () => {
                clearDisplayProfile(".own-followers")
                getProfile(id).then((body) => {
                    document.querySelector(".profile-page").style.display = "none"
                    showOtherUserProfile(body, idCount, userId)
                });
            })
        })
    })
    
    // When save details is clicked
    document.getElementById('profile-save').addEventListener('click', () => {
        let profileImgUpload = document.getElementById("profile-image-upload").files
        console.log(profileImgUpload)
        let dataURL = null
        let confirmPassword = document.getElementById('profile-confirm-password').value
        let password = document.getElementById('profile-password').value
        let name = document.getElementById('profile-name').value
        let email = document.getElementById('profile-email').value
        let emailChange = false

        // If email is unchanged, pass in the same email
        if (email === preExistingEmail) {
            emailChange = true
            updateProfileInfo(email, password, name, profileImg.src, emailChange)
        }

        // If password and confirm password do not match
        if (password != confirmPassword) {
            let pwdModal = document.getElementById("pwd-modal")
            let cross = document.getElementById("pwd-modal-close");
            pwdModal.style.display = "block"
            cross.addEventListener('click', () => {
                pwdModal.style.display = "none";
            });
            return;
        }

        // Image upload - if image is unchagned, then pass the original image else pass
        // new image
        if (profileImgUpload.length !== 0) {
            fileToDataUrl(profileImgUpload[0]).then((body) => {
                dataURL = body
                updateProfileInfo(email, password, name, dataURL, emailChange).then((body) => {
                    profileImg.src = dataURL
                    console.log(body)
                })
            })
        } else {
            updateProfileInfo(email, password, name, profileImg.src, emailChange).then((body) => {
                console.log(body)
            })
        } 
        
    });

    // Displays all the users jobs that they have posted
    const userProfile = document.querySelector(".userProfile")
    getProfile(userId).then((body) => {
        let idCount = 0
        const jobs = body.jobs
        for (let i in jobs) {
            showJobPostsProfile(jobs[i], idCount, userId, userProfile, "myProfile")
            idCount++
        }
    });    
};

// Adds the edit option for user on their own job posts
export const addEditOption = (job, idCount, newPost) => {
    const updateButton = document.createElement('button')
    updateButton.id = "update-jobs" + idCount
    updateButton.innerText = "EDIT JOB"
    newPost.appendChild(updateButton)
    
    updateButton.addEventListener('click', () => {
        const modal = document.getElementById("create-job-modal")
        modal.style.display = "block"
        const close = document.getElementById("create-job-close")

        let form = document.getElementById("job-image-form")
        form.reset();

        let title = document.getElementById("create-job-title")
        let image = document.getElementById("create-job-image")
        let startDate = document.getElementById("create-job-start")
        let desc = document.getElementById("create-job-desc")
        let submit = document.getElementById("create-job-submit")
        let dataURL = null
        const currentImg = image.files[0]
        
        title.value = job.title
        let startDateParse = new Date(job.start.replace('T', ' ').replace('Z', ''))
        startDate.value = startDateParse.getDate() + "/" + startDateParse.getMonth() + "/" + startDateParse.getFullYear()
        desc.value = job.description

        submit.addEventListener('click', () => {
            let newStart = startDate.value.split('/')
            console.log(newStart)
            const day = newStart[0]
            const month = newStart[1]
            const year = newStart[2]

            let zStart = new Date(year, month, day)
            zStart = zStart.toISOString()
            
            if (desc.length < 50) {
                jobErrorModal("Please provide a longer job description.")
                return;
            }
            if (image.files.length == 0) {
                image = currentImg
                updateJobPost(job.id, title.value, image, zStart, desc.value)
            } else {
                fileToDataUrl(image.files[0]).then((body) => {
                    dataURL = body
                    updateJobPost(job.id, title.value, dataURL, zStart, desc.value)
                })
            }
            modal.style.display = "none"
        })

        close.addEventListener('click', () => {
            modal.style.display = "none"
        })
    })
}

// Adds the delete options for user on their own job posts
export const addDeleteOption = (job, idCount, newPost) => {
    const deleteButton = document.createElement('button')
    deleteButton.id = "delete-jobs" + idCount
    deleteButton.innerText = "DELETE JOB"
    newPost.appendChild(deleteButton)
    console.log(job.id)

    deleteButton.addEventListener('click', () => {
        const deleteModal = document.getElementById("delete-job-modal")
        deleteModal.style.display = "block"
        const close = document.getElementById("delete-job-close")
        const confirmDelete = document.getElementById("delete-job-button")

        close.addEventListener('click', () => {
            deleteModal.style.display = "none"
        })

        confirmDelete.addEventListener('click', () => {
            deleteJobPost(job.id)
            deleteModal.style.display = "none"
        })
    })
}
