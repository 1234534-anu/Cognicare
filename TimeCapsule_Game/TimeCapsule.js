const board = document.getElementById("boardCanvas");
const piecesC = document.getElementById("piecesCanvas");
const bctx = board.getContext("2d");
const pctx = piecesC.getContext("2d");
// ================= BACKEND TRACKING =================
const GAME_ID = "time_capsule";

let sessionId = null;
let startTime = null;
let hintsUsed = 0;
let movesCount = 0;

let img = new Image();
let pieces = [];
let grid = 2;
let ghost = false;
let pieceSize = 0;

/* ================= DEFAULT IMAGES ================= */
const defaults = ["img1.jpg","img2.jpg","img3.jpg","img4.jpg"];

function loadDefault(i){
    img.onload = createPuzzle;
    img.src = defaults[i-1];
}

/* ================= UPLOAD IMAGE ================= */
document.getElementById("upload").onchange = e=>{
    if(!e.target.files[0]) return;
    img.onload = createPuzzle;
    img.src = URL.createObjectURL(e.target.files[0]);
};

/* ================= CONTROL BUTTONS ================= */
function setPieces(n){
    grid = Math.sqrt(n);
    createPuzzle();
}

function toggleGhost(){
    ghost = !ghost;
    hintsUsed++; // 👈 TRACK HINTS
    document.getElementById("ghostBtn").classList.toggle("active",ghost);
    draw();
}


/* ================= START BUTTON ================= */
document.getElementById("startBtn").onclick = async ()=>{
    if(!img.src){
        alert("Please select an image first");
        return;
    }

    startTime = Date.now();
    hintsUsed = 0;
    movesCount = 0;

    const { data, error } = await supabaseClient
      .from("game_sessions")
      .insert({
        user_id: currentUser.id,
        game_id: GAME_ID
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to start session", error);
      return;
    }

    sessionId = data.session_id;
    console.log("Session started:", sessionId);

    createPuzzle();
};

/* ================= CREATE PUZZLE ================= */
function createPuzzle(){
    pieces = [];
    pieceSize = 360 / grid;

    for(let r=0;r<grid;r++){
        for(let c=0;c<grid;c++){
            pieces.push({
                sx: c * (img.width / grid),
                sy: r * (img.height / grid),
                sw: img.width / grid,
                sh: img.height / grid,
                x: Math.random() * (260 - pieceSize),
                y: Math.random() * (360 - pieceSize),
                cx: c * pieceSize,
                cy: r * pieceSize,
                placed: false
            });
        }
    }
    draw();
}

/* ================= DRAW ================= */
function draw(){
    bctx.clearRect(0,0,360,360);
    pctx.clearRect(0,0,260,360);

    if(ghost){
        bctx.globalAlpha = 0.25;
        bctx.drawImage(img,0,0,360,360);
        bctx.globalAlpha = 1;
    }

    pieces.forEach(p=>{
    if(p === activePiece){
        // draw floating piece at cursor
        const size = pieceSize;
        bctx.drawImage(
            img, p.sx, p.sy, p.sw, p.sh,
            cursorX - board.getBoundingClientRect().left - size/2,
            cursorY - board.getBoundingClientRect().top - size/2,
            size, size
        );
    }
    else if(p.placed){
        bctx.drawImage(
            img, p.sx, p.sy, p.sw, p.sh,
            p.cx, p.cy, pieceSize, pieceSize
        );
    }
    else{
        pctx.drawImage(
            img, p.sx, p.sy, p.sw, p.sh,
            p.x, p.y, pieceSize, pieceSize
        );
    }
});

}

/* ===================== DRAG SYSTEM (FLOATING PIECE) ===================== */

let activePiece = null;
let draggingFrom = null; // "pieces" or "board"
let cursorX = 0;
let cursorY = 0;

/* PICK UP PIECE FROM PIECES AREA */
piecesC.addEventListener("pointerdown", e=>{
    const rect = piecesC.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for(let i = pieces.length - 1; i >= 0; i--){
        const p = pieces[i];
        if(!p.placed &&
           mx >= p.x && mx <= p.x + pieceSize &&
           my >= p.y && my <= p.y + pieceSize){

            activePiece = p;
            draggingFrom = "pieces";
            cursorX = e.clientX;
            cursorY = e.clientY;
            piecesC.setPointerCapture(e.pointerId);
            break;
        }
    }
});

/* PICK UP PIECE FROM BOARD (IF ALREADY DROPPED THERE) */
board.addEventListener("pointerdown", e=>{
    const rect = board.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for(let i = pieces.length - 1; i >= 0; i--){
        const p = pieces[i];
        if(p.placed &&
           mx >= p.cx && mx <= p.cx + pieceSize &&
           my >= p.cy && my <= p.cy + pieceSize){

            activePiece = p;
            draggingFrom = "board";
            p.placed = false; // temporarily lift
            cursorX = e.clientX;
            cursorY = e.clientY;
            board.setPointerCapture(e.pointerId);
            break;
        }
    }
});

/* MOVE WITH CURSOR */
document.addEventListener("pointermove", e=>{
    if(!activePiece) return;

    cursorX = e.clientX;
    cursorY = e.clientY;
    draw();
});

/* DROP */
document.addEventListener("pointerup", e=>{
    if(!activePiece) return;

    const boardRect = board.getBoundingClientRect();

    // Dropped over board
    if(
        e.clientX >= boardRect.left &&
        e.clientX <= boardRect.right &&
        e.clientY >= boardRect.top &&
        e.clientY <= boardRect.bottom
    ){
        const bx = e.clientX - boardRect.left;
        const by = e.clientY - boardRect.top;

        const col = Math.floor(bx / pieceSize);
        const row = Math.floor(by / pieceSize);

        if(
            Math.abs(col * pieceSize - activePiece.cx) < pieceSize / 2 &&
            Math.abs(row * pieceSize - activePiece.cy) < pieceSize / 2
        ){
            activePiece.placed = true;
            activePiece.cx = col * pieceSize;
            activePiece.cy = row * pieceSize;
            movesCount++;

            checkCompletion();
        }
    }

    activePiece = null;
    draggingFrom = null;
    draw();
});


/* ================= COMPLETION CHECK ================= */
function checkCompletion(){
    if(pieces.length > 0 && pieces.every(p => p.placed)){
        showCompletion();
    }
}

/* ================= COMPLETION MODAL ================= */
async function showCompletion(){
    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - startTime) / 1000);

    const compliments = [
        "Well done! 🎉",
        "Excellent work! 👏",
        "Great job! 😊",
        "You completed it! ⭐"
    ];

    document.getElementById("complimentText").textContent =
        compliments[Math.floor(Math.random()*compliments.length)];

    document.getElementById("completeModal").style.display = "block";

    // 🔐 SAVE METRICS
    await supabaseClient.from("session_metrics").insert([
        {
            session_id: sessionId,
            metric_name: "Completion Time",
            value: durationSeconds,
            unit: "seconds"
        },
        {
            session_id: sessionId,
            metric_name: "Hints Used",
            value: hintsUsed,
            unit: "count"
        },
        {
            session_id: sessionId,
            metric_name: "Moves",
            value: movesCount,
            unit: "count"
        },
        {
            session_id: sessionId,
            metric_name: "Difficulty",
            value: grid * grid,
            unit: "pieces"
        }
    ]);

    await supabaseClient
      .from("game_sessions")
      .update({ ended_at: new Date() })
      .eq("session_id", sessionId);

    console.log("Session saved successfully");
}


function restartPuzzle(){
    document.getElementById("completeModal").style.display = "none";
    createPuzzle();
}

/* ================= NAVIGATION ================= */
function quitGame(){
    location.href = "Home.html";
}
function openHelp(){
    helpModal.style.display = "block";
}
function closeHelp(){
    helpModal.style.display = "none";
}
