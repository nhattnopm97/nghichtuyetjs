var ctx = document.getElementById("hoatuyet1").getContext("2d")

class Wind {
    constructor() {
        this.speedX = Math.random() * 4 - 1; // Gió ban đầu có vận tốc ngang ngẫu nhiên
    }

    // Hàm thay đổi gió sau mỗi 5 giây
    changeWind() {
        setInterval(() => {
            this.speedX = Math.random() * 2 - 1; // Gió thay đổi vận tốc ngang ngẫu nhiên
            console.log("Gió thay đổi: ", this.speedX); // In ra vận tốc gió để theo dõi
        }, 5000); // Cứ sau 5 giây thay đổi gió một lần
    }
    stopWindChange() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId); // Xóa interval
            this.intervalId = null; // Đặt lại ID để tránh xóa nhiều lần
        }
    }
}

// Class Snowflake để vẽ một bông hoa tuyết
class Snowflake {
    constructor(pos, dir, thin = 2) {
        this.lengthOfFlow = Math.floor(Math.random() * 20)
        this.pos = pos; // vị trí [x, y] của bông hoa tuyết
        this.dir = dir; // hướng (tính theo độ)
        this.thin = thin; // độ dày của đường vẽ
        this.history = { x: 0, y: 0, dir: dir }; // lịch sử vị trí để quay lại
        this.speed = {
            x: Math.random() * 2 - 1, // Tốc độ di chuyển ngẫu nhiên theo trục x
            y: Math.random() * 1 + 0.5 // Tốc độ di chuyển ngẫu nhiên theo trục y
        };
    }

    // Hàm vẽ một đường thẳng
    drawLine(a, b, color = "blue") {
        const [x1, y1] = a, [x2, y2] = b;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.thin;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Hàm vẽ đường theo chiều dài length
    draw(length) {
        const [x, y] = this.pos;
        this.history.x = x;
        this.history.y = y;
        this.history.dir = this.dir;
        let dirRadian = this.dir * (Math.PI / 180);
        let x_end = x + length * Math.cos(dirRadian);
        let y_end = y + length * Math.sin(dirRadian);
        this.drawLine([x, y], [x_end, y_end], "blue");
        this.pos = [x_end, y_end];
    }

    // Hàm xoay trái
    turnLeft(angle) {
        this.dir += angle;
        if (this.dir >= 360) this.dir -= 360;
    }

    // Hàm xoay phải
    turnRight(angle) {
        this.dir -= angle;
        if (this.dir < 0) this.dir += 360;
    }

    // Nhảy tới một vị trí mới mà không vẽ
    jump(length) {
        const [x, y] = this.pos;
        this.history.x = x;
        this.history.y = y;
        this.history.dir = this.dir;
        let dirRadian = this.dir * (Math.PI / 180);
        let x_end = x + length * Math.cos(dirRadian);
        let y_end = y + length * Math.sin(dirRadian);
        this.pos = [x_end, y_end];
    }

    // Quay lại vị trí trước đó
    jumpBack() {
        const [x, y] = this.pos;
        let x_end = this.history.x;
        let y_end = this.history.y;
        this.history.x = x;
        this.history.y = y;
        this.history.dir = this.dir;
        this.pos = [x_end, y_end];
    }

    // Hàm vẽ một bông hoa tuyết
    drawAFlower() { //lengthOfFlow
        let r = this.lengthOfFlow //Math.floor(Math.random()*10); // Làm bông hoa tuyết nhỏ hơn 
        for (let i = 0; i < 6; i++) {
            this.draw(r);
            this.turnLeft(180);
            this.jump(2 * r / 3);
            this.turnLeft(135);
            this.draw(Math.sqrt(2) * r / 3);
            this.jumpBack();
            this.turnLeft(90);
            this.draw(Math.sqrt(2) * r / 3);
            this.jumpBack();
            this.turnRight(45);
            this.jump(r / 3);
            this.turnLeft(45);
            this.draw(Math.sqrt(2) * r / 6);
            this.jumpBack();
            this.turnRight(90);
            this.draw(Math.sqrt(2) * r / 6);
            this.jumpBack();
            this.turnLeft(45 + 180);
            this.jump(2 * r / 3);
            this.turnLeft(180 + 360 / 6);
        }
    }

    // Hàm cập nhật vị trí của bông hoa tuyết để tạo chuyển động
    update(windSpeedX=0) {
        this.pos[0] += this.speed.x + windSpeedX; // Cập nhật vị trí x
        this.pos[1] += this.speed.y; // Cập nhật vị trí y

        // Kiểm tra nếu hoa tuyết ra khỏi màn hình thì bắt đầu lại từ phía trên
        if (this.pos[1] > window.innerHeight) {
            this.pos[1] = -50; // Đưa bông hoa tuyết trở về trên cùng màn hình
            this.pos[0] = Math.random() * window.innerWidth; // Đặt vị trí x ngẫu nhiên
        }

        // Vẽ lại bông hoa tuyết
        this.drawAFlower();
    }
}

// Mảng để lưu các bông hoa tuyết
let snowflakes = [];
// Khởi tạo đối tượng gió
let wind = new Wind();
wind.changeWind();
window.addEventListener('beforeunload', function() {
    wind.stopWindChange(); // Dừng interval khi người dùng chuyển trang
});
// Hàm khởi tạo nhiều bông hoa tuyết
function initSnowflakes(num) {
    for (let i = 0; i < num; i++) {
        let snowflake = new Snowflake(
            [Math.random() * window.innerWidth, Math.random() * window.innerHeight],
            Math.random() * 360,
            2
        );
        snowflakes.push(snowflake);
    }
}

// Hàm để vẽ và cập nhật tất cả bông hoa tuyết
function animateSnowflakes() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // Xóa canvas trước khi vẽ khung mới
    snowflakes.forEach(snowflake => {
        snowflake.update(wind.speedX); // Cập nhật và vẽ lại bông hoa tuyết
    });
    requestAnimationFrame(animateSnowflakes); // Lặp lại hàm animate để tạo hiệu ứng động
}

// Khởi tạo và vẽ nhiều bông hoa tuyết
initSnowflakes(50); // Tạo 50 bông hoa tuyết
animateSnowflakes(); // Bắt đầu vẽ và cập nhật chuyển động


const chuyentrangtuyet = () =>{
    window.location.href = 'http://127.0.0.1:5500/tuyetclone.html'
}