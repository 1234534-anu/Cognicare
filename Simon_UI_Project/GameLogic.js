let sequence=[], user=[];
let colors=["green","red","yellow","blue"];
let score=0, speed=800;

const pads=document.querySelectorAll(".pad");
const progress=document.getElementById("progressBar");

pads.forEach(p=>p.onclick=()=>clickPad(p.id));

function setMode(){ startGame(); }

function startGame(){
    sequence=[];
    score=0;
    nextRound();
}

function nextRound(){
    user=[];
    sequence.push(colors[Math.floor(Math.random()*4)]);
    playSequence();
    document.getElementById("score").innerText="Score: "+score;
    progress.style.width=Math.min(sequence.length*8,100)+"%";
}

function playSequence(){
    let i=0;
    let interval=setInterval(()=>{
        flash(sequence[i]);
        i++;
        if(i>=sequence.length)clearInterval(interval);
    },speed);
}

function flash(c){
    let el=document.getElementById(c);
    el.classList.add("active");
    setTimeout(()=>el.classList.remove("active"),300);
}

function clickPad(c){
    user.push(c);
    flash(c);
    let i=user.length-1;
    if(user[i]!==sequence[i]){
        alert("Try again 😊");
        startGame();
        return;
    }
    if(user.length===sequence.length){
        score++;
        setTimeout(nextRound,800);
    }
}

/* NAVIGATION */
function quitGame(){ location.href="Home.html"; }
function showHelp(){ document.getElementById("helpModal").style.display="block"; }
function closeHelp(){ document.getElementById("helpModal").style.display="none"; }
