import { apiCall } from "./main.js"
import { fileToDataUrl } from "./helpers.js"

const createJobPost = (title, image, start, description) => {
    return apiCall('job', 'POST', {
        title, 
        image,
        start,
        description
    })
}

// When add jobs button is clicked in navbar, a modal prompt will pop up to populate with info
document.getElementById("add-jobs").addEventListener('click', () => {
    console.log("work")
    const modal = document.getElementById("create-job-modal")
    modal.style.display = "block"
    
    const close = document.getElementById("create-job-close")
    const post = document.getElementById("create-job-submit")

    close.addEventListener('click', () => {
        modal.style.display = "none"
    })

    post.addEventListener('click', () => {
        const title = document.getElementById("create-job-title").value
        const image = document.getElementById("create-job-image").files
        let start = document.getElementById("create-job-start").value
        const desc = document.getElementById("create-job-desc").value

        // Extra checks
        if (title == '' || image == '' || start == '' || desc == '') {
            jobErrorModal("Please ensure you fill out all fields.")
            return;
        } 
        
        if (desc.length < 50) {
            jobErrorModal("Please provide a longer job description.")
            return;
        }
        console.log(start)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(start)) {
            jobErrorModal("Please enter date format as: DD/MM/YYYY.")
            return;
        }

        start = start.split('/')
        const day = start[0]
        const month = start[1]
        const year = start[2]

        let zStart = new Date(year, month, day)
        zStart = zStart.toISOString()

        fileToDataUrl(image[0]).then((body) => {
            createJobPost(title, body, zStart, desc)
        })
        modal.style.display = "none"
    })

})

// Error uploading job modal
export const jobErrorModal = (errorMessage) => {
    const errorModal = document.getElementById("create-job-error-modal")
    const errorText = document.getElementById("create-job-error-text")
    const errorClose = document.getElementById("create-job-error-modal-close")

    errorModal.style.display = "block"
    errorText.innerText = errorMessage
    errorClose.addEventListener('click', () => {
        errorModal.style.display = "none"
    })
}