const multiStepForm = document.querySelector("[data-multi-step]")
const formSteps=[...multiStepForm.querySelectorAll("[data-step]")] //convert to ana array

let currentStep=formSteps.findIndex(step =>{
    return step.classList.contains("active")
})
if (currentStep < 0 ){
    currentStep=0
    showCurrentStep()
}

multiStepForm.addEventListener("click", e =>{
    console.log(e.target.matches("[data-next]"))
    if (e.target.matches("[data-next]")){
        currentStep += 1
    }else if (e.target.matches("[data-previous]")){
        currentStep -= 1
    }
    showCurrentStep()
})

console.log(currentStep)

function showCurrentStep(){
    formSteps.forEach((step, index) =>{
        step.classList.toggle("active", index === currentStep)
    })
}






