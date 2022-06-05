// Steven Chye, z5257742

function checkFirstName() {
    let firstName = dynamicForm.firstName.value
    let firstNameLength = dynamicForm.firstName.value.length
    if (firstName === "" || firstNameLength < 3 || firstNameLength > 50) {
        document.getElementById("resultText").innerHTML = "Please input a valid firstname"
    } else {
        document.getElementById("resultText").innerHTML = ""
    }
}

function checkLastName() {
    let lastName = dynamicForm.lastName.value
    let lastNameLength = dynamicForm.lastName.value.length
    if (lastName === "" || lastNameLength < 3 || lastNameLength > 50) {
        document.getElementById("resultText").innerHTML = "Please input a valid lastname"
    } else {
        document.getElementById("resultText").innerHTML = ""
    }
}

function checkDOB() {
    let DOB = dynamicForm.DOB.value
    let DOBregex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/ig
    let DOBresult = DOBregex.test(DOB)
    if (!DOBresult) {
        document.getElementById("resultText").innerHTML = "Please enter a valid date of birth"
    } else {
        document.getElementById("resultText").innerHTML = ""
    }
}

function resetValues() {
    dynamicForm.reset()
    document.getElementById("resultText").innerHTML = ""
}

function renderOutput() {
    let firstName = dynamicForm.firstName.value
    let lastName = dynamicForm.lastName.value
    let DOB = dynamicForm.DOB.value
    let favouriteAnimal = dynamicForm.animal.value

    let parse = DOB.split("/")
    let DOByear = parse[2]
    let age = new Date().getFullYear() - DOByear
    
    let cityArray = []
    let sydney = document.getElementById("Syd")
    let melb = document.getElementById("Melb")
    let adelaide = document.getElementById("Adelaide")
    
    if (sydney.checked) cityArray.push(sydney.value)
    if (melb.checked) cityArray.push(melb.value)
    if (adelaide.checked) cityArray.push(adelaide.value)

    cityResult = cityArray.length === 0 ? "no cities" : cityArray
    
    resultOutput = "Hello " + firstName + " " + lastName + ", you are " + 
        age + " years old, your favourite animal is " + favouriteAnimal + 
        " and you've lived in " + cityResult + "."

    document.getElementById("resultText").innerHTML = resultOutput
}