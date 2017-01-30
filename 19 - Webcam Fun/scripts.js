const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// get video and displays it in the
// upper righthand corner
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
  .then(localMediaStream => {
    //console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.error("Oh NO!", err);
  });
}

//gets video shot and show in canvas below
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0,0,width,height);
    // take pixels out
    let pixels = ctx.getImageData(0,0,width,height);
     // add filter
    //pixels = redEffect(pixels);
    //pixels = rgbSplit(pixels);
  //  pixels = greenScreen(pixels);
    ctx.globalAlpha =0.1;
    //put them back
    ctx.putImageData(pixels, 0,0);
  }, 30);
}

function takePhoto() {
  snap.currentTime =0 ;
  snap.play();
  //take data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  //console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`;
  //link.textContent = 'Downlad Image';
  strip.insertBefore(link, strip.firstChild);
}

//filter functions
function redEffect(pixels) {
  for (let i =0;i<pixels.data.length;i+=4) {
    pixels[i+0] = pixels.data[i+0] + 100;//red
    pixels[i+1] = pixels.data[i+1] - 50;//green
    pixels[i+2] = pixels.data[i+2] * 0.5;//blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i =0;i<pixels.data.length;i+=4) {
    pixels[i-150] = pixels.data[i+0];//red
    pixels[i+500] = pixels.data[i+1];//green
    pixels[i-500] = pixels.data[i+2];//blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels ={};

  [...document.querySelectorAll('.rgb input')].forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i=0;i<pixels.data.length;i=i+4) {
    red = pixels.data[i+0];
    green = pixels.data[i+1];
    blue = pixels.data[i+2];
    alpha = pixels.data[i+3];

    if (red >= levels.rmin
       && green >= levels.gmin
       && blue >= levels.bmin
       && red <=levels.rmax
       && green <= levels.gmax
       && blue <= levels.bmax) {
      pixels.data[i+3] =0;
    }
  }
}

function black&White(pixels) {
  for (let i =0;i<pixels.data.length;i+=4) {
    pixels[i+0] = pixels.data[i+0] + 50;//red
    pixels[i+1] = pixels.data[i+1] + 100;//green
    pixels[i+2] = pixels.data[i+2] + 25;//blue
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
