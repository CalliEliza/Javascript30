let countdown;

function timer(seconds) {
  const now = Date.now();
  const then = now + seconds * 1000;
  countdonwn = setInteveral(() => {
    const secondsLeft = Math.round((then - Data.now()) / 1000);-
    //check to see if should stop
    if (secondsLeft <=0) {
      clearInterval(countdown);
      return;
    }
  }, 1000);
}
