var canvas;
var context;
var voltage_input;
const canvas_width = 1000;
const canvas_height = 800;
var rect_width = 300;
var rect_height = 200;
var rect_x;
var rect_y;
const rect_start_speed = 5000;
const oil_radius = 50;
const max_voltage = 500;
const voltage_sensitivity = 0.1;
const voltage_exponential = 0.003;
var interval;
const drawing_interval = 20;
var oil_x = 800;
var oil_y;
var oil_dy;
var score;
var highscore;

function init(){
    canvas = document.getElementById('canvas');
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    context = canvas.getContext('2d');
    voltage_input = document.getElementById('voltage_input');
    voltage_input.max = max_voltage;
    highscore = localStorage.getItem('highscore');
    if (highscore == 'null' || highscore == null){
        highscore = 0;
        localStorage.setItem('highscore', highscore);
    }
    stop_game();
}

function start_game(){
    canvas.onclick = '';
    score = 0;
    rect_x = (-1 * rect_width);
    rect_y = (0.5 * canvas_height);
    oil_y = canvas_height / 2;
    oil_dy = 0;
    voltage_input.value = (max_voltage / 2);
    voltage_input.disabled = false;
    interval = setInterval(draw_circle, drawing_interval);
}

function stop_game(){
    clearInterval(interval);
    voltage_input.value = (max_voltage / 2);
    voltage_input.disabled = true;
    context.font = '50px monospace';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    if (score > highscore){
        highscore = score;
        localStorage.setItem('highscore', highscore);
        context.fillText(('New Highscore: ' + highscore), (canvas_width / 2), 300);
    } else if (score > 0){
        context.fillText(('Score: ' + score), (canvas_width / 2), 300);
    } else {
        context.fillText('Millikan-Masters', (canvas_width / 2), 300);
    }
    context.fillText('Klick to start', (canvas_width / 2), 500);
    canvas.onclick = start_game;
}

function draw_circle(){
    context.clearRect(0, 0, canvas_width, canvas_height);
    score += 1;
    var voltage = voltage_input.value;
    voltage = (voltage - (max_voltage / 2));
    oil_dy += (voltage * voltage_exponential);
    oil_y += oil_dy;
    oil_y += (voltage * voltage_sensitivity);
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.strokeRect(rect_x, rect_y, rect_width, rect_height);
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(oil_x, oil_y, oil_radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.font = '30px monospace';
    context.textAlign = 'right';
    context.fillStyle = 'white';
    context.fillText((score + ' HS: ' + highscore), (canvas_width - 10), 40);
    if ((oil_y <= oil_radius) || (oil_y >= (canvas_height - oil_radius))){
        stop_game();
    }
    if (rect_x > canvas_width){
        rect_x = -1 * rect_width;
        rect_y = Math.floor(Math.random() * (canvas_height - rect_height));
    } else {
        rect_x += ((rect_start_speed + score) / 600);
        if ((rect_x < (oil_x + oil_radius)) && ((rect_x + rect_width) > (oil_x - oil_radius))){
            if ((rect_y < (oil_y + oil_radius)) && ((rect_y + rect_height) > (oil_y - oil_radius))){
                stop_game();
            }
        }
    }
}
