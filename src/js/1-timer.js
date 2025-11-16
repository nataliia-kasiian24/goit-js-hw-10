import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    datetimePicker: document.getElementById('datetime-picker'),
    startButton: document.querySelector('[data-start]'),
    timerFields: {
        days: document.querySelector('[data-days]'),
        hours: document.querySelector('[data-hours]'),
        minutes: document.querySelector('[data-minutes]'),
        seconds: document.querySelector('[data-seconds]'),
    }
};

let userSelectedDate = null;
let countdownInterval = null;

refs.startButton.disabled = true;


function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerFields({ days, hours, minutes, seconds }) {
    refs.timerFields.days.textContent = addLeadingZero(days);
    refs.timerFields.hours.textContent = addLeadingZero(hours);
    refs.timerFields.minutes.textContent = addLeadingZero(minutes);
    refs.timerFields.seconds.textContent = addLeadingZero(seconds);
};

const timer = {
    start() {
        if (countdownInterval) {
            return;
        }
        refs.startButton.disabled = true;
        refs.datetimePicker.disabled = true;

        const targetTime = userSelectedDate.getTime();

        countdownInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = targetTime - currentTime;
            if (timeDifference <= 0) {
                this.stop();
                updateTimerFields({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const time = convertMs(timeDifference);
            updateTimerFields(time);
        }, 1000);
    },
    stop() {
        clearInterval(countdownInterval);
        countdownInterval = null;
        refs.datetimePicker.disabled = false; 
        iziToast.success({
            title: 'Success',
            message: 'Countdown finished!',
            position: 'topRight',
        });
    }

}


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      console.log(selectedDates);
        const now = new Date();

        if (selectedDate.getTime() <= now.getTime()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
            });
            refs.startButton.disabled = true; 
            userSelectedDate = null;
        } else {
            userSelectedDate = selectedDate;
            refs.startButton.disabled = false;
        }
    },
  

};

flatpickr(refs.datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

refs.startButton.addEventListener('click', () => {
    timer.start()
});