let startTime, elapsedTime = 0;
let stopwatchInterval, countdownInterval;
let isRunning = false;

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${String(hours).padStart(2, '0')}:` +
         `${String(minutes).padStart(2, '0')}:` +
         `${String(seconds).padStart(2, '0')}.` +
         `${String(centiseconds).padStart(2, '0')}`;
}

function playBeep(duration = 100, frequency = 440) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

$(document).ready(function () {
  const $display = $('.stopwatch-display');
  const $lapList = $('.lap-times');
  const $startStopBtn = $('.start-stop');
  const $resetBtn = $('.reset');
  const $lapBtn = $('.lap');

  $startStopBtn.click(function () {
    if (!isRunning) {
      startTime = Date.now() - elapsedTime;
      stopwatchInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        $display.text(formatTime(elapsedTime));
      }, 10);
      isRunning = true;
      $(this).text('Pause').removeClass('btn-primary').addClass('btn-danger');
    } else {
      clearInterval(stopwatchInterval);
      isRunning = false;
      $(this).text('Start').removeClass('btn-danger').addClass('btn-primary');
    }
  });

  $resetBtn.click(function () {
    clearInterval(stopwatchInterval);
    isRunning = false;
    elapsedTime = 0;
    $display.text('00:00:00.00');
    $startStopBtn.text('Start').removeClass('btn-danger').addClass('btn-primary');
    $lapList.empty();
  });

  $lapBtn.click(function () {
    if (isRunning) {
      const time = formatTime(elapsedTime);
      const lapNumber = $lapList.children().length + 1;
      $lapList.append(`<li class="list-group-item">Lap ${lapNumber}: ${time}</li>`);
    }
  });

  $('#start-countdown').click(function () {
    const hours = parseInt($('#countdown-hours').val()) || 0;
    const minutes = parseInt($('#countdown-minutes').val()) || 0;
    const seconds = parseInt($('#countdown-seconds').val()) || 0;

    let totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalTime <= 0) return;

    $('#countdown-display').show().text(formatTime(totalTime));
    if (countdownInterval) clearInterval(countdownInterval);

    const start = Date.now();
    const end = start + totalTime;

    countdownInterval = setInterval(() => {
      const remaining = end - Date.now();
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        $('#countdown-display').text('00:00:00.00').hide();
        playBeep(300, 800);
        playBeep(300, 800);
        playBeep(300, 800);
        return;
      }

      $('#countdown-display').text(formatTime(remaining));

      // Play soft tick every second
      if (Math.floor(remaining / 1000) !== Math.floor((remaining + 10) / 1000)) {
        playBeep(30, 400);
      }
    }, 10);
  });
});
