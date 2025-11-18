import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay); 
            } else {
                reject(delay); 
            }
        }, delay);
    })
}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const delayInput = form.elements.delay.value;
    const delay = Number(delayInput);
    const state = form.elements.state.value;

    const promise = createPromise(delay, state);
    promise
        .then((resultDelay) => {
            console.log(`✅ Fulfilled promise in ${resultDelay}ms`);
            
           iziToast.success({
               message: `✅ Fulfilled promise in ${resultDelay}ms`,
               position: 'topRight'
            }); 
        })
        .catch((errorDelay) => {
            console.log(`❌ Rejected promise in ${errorDelay}ms`);

            iziToast.error({
                message: `❌ Rejected promise in ${errorDelay}ms`,
                position: 'topRight'
            });
        });
    form.reset();
})