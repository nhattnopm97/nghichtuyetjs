const canvas = document.querySelector('#canvas');

const c = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

class snow {
    constructor() {
        this.radius = Math.random() * 5;
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = -this.radius;
        this.color = '#FFF';
        this.speed = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 3 + 2,
        };
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.shadowColor = this.color;
        c.shadowBlur = 5;
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.y >= canvas.height) {
            this.speed.y = 0;
        }

        this.draw();
    }
}

const arr = [];

function init() {
  arr.push(new snow());
}

function animate() {
  c.clearRect(0,0, canvas.width, canvas.height);
  arr.forEach(function(item) {
    item.update();
  })
  if (arr.length > 1000) {
    arr.splice(0,1);
  }
  init();
  window.requestAnimationFrame(animate);
}

animate();
const chuyentrangtuyet = () =>{
    console.log("chuyeern trang");
    window.location.href = "http://127.0.0.1:5500/vebongtuyet.html"
}