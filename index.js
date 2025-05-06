// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let selectedLevel = "";
let quizQuestions = [];
let answeredQuestions = [];
let audioContext;

// Timer functionality
let questionTimer;
let timeLeft = 30; // 30 seconds per question
const timerDisplay = document.createElement("div");
timerDisplay.id = "timerDisplay";
timerDisplay.className = "timer";
document.querySelector(".quiz-container").appendChild(timerDisplay);

// Elements
const startScreen = document.getElementById("startScreen");
const levelSelect = document.getElementById("levelSelect");
const quizContainer = document.getElementById("quizContainer");
const resultsContainer = document.getElementById("resultsContainer");
const progressContainer = document.getElementById("progressContainer");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressBar = document.getElementById("progressBar");
const questionNumberEl = document.getElementById("questionNumber");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const finalScoreEl = document.getElementById("finalScore");
const resultsMessageEl = document.getElementById("resultsMessage");
const badgeEl = document.getElementById("badge");
const startBtn = document.getElementById("startBtn");
const levelBtns = document.querySelectorAll(".level-btn");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");
const hintBtn = document.getElementById("hintBtn");
const hintText = document.getElementById("hintText");
const notationDisplay = document.getElementById("notationDisplay");
const playSoundBtn = document.getElementById("playSoundBtn");

// Quiz Questions
const beginnerQuestions = [
    {
        question: "What is the value of a semibreve (whole note)?",
        image: createNoteImage("semibreve"),
        options: ["1 beat", "2 beats", "3 beats", "4 beats"],
        correctAnswer: "4 beats",
        sound: "semibreve",
        hint: "This is the longest common note value used in music notation."
    },
    {
        question: "What is the value of a minim (half note)?",
        image: createNoteImage("minim"),
        options: ["1 beat", "2 beats", "3 beats", "4 beats"],
        correctAnswer: "2 beats",
        sound: "minim",
        hint: "It has an open note head with a stem, half the duration of a semibreve."
    },
    {
        question: "What is the value of a crotchet (quarter note)?",
        image: createNoteImage("crotchet"),
        options: ["1/4 beat", "1/2 beat", "1 beat", "2 beats"],
        correctAnswer: "1 beat",
        sound: "crotchet",
        hint: "It has a filled note head with a stem, it's the most common reference unit for beats."
    },
    {
        question: "What is the value of a quaver (eighth note)?",
        image: createNoteImage("quaver"),
        options: ["1/8 beat", "1/4 beat", "1/2 beat", "1 beat"],
        correctAnswer: "1/2 beat",
        sound: "quaver",
        hint: "It has a filled note head with a stem and one flag."
    },
    {
        question: "What is the value of a semiquaver (sixteenth note)?",
        image: createNoteImage("semiquaver"),
        options: ["1/2 beat", "1/4 beat", "1/8 beat", "1/16 beat"],
        correctAnswer: "1/4 beat",
        sound: "semiquaver",
        hint: "It has a filled note head with a stem and two flags."
    },
    {
        question: "What does a dotted note indicate?",
        image: createNoteImage("dotted-crotchet"),
        options: ["The note is staccato", "The note is shortened", "The note is extended by half its value", "The note should be played louder"],
        correctAnswer: "The note is extended by half its value",
        hint: "A dot after a note affects its duration."
    },
    {
        question: "Which rest symbol represents 4 beats of silence?",
        image: createRestImage("semibreve"),
        options: ["Minim rest", "Crotchet rest", "Quaver rest", "Semibreve rest"],
        correctAnswer: "Semibreve rest",
        hint: "This rest hangs from the fourth line of the staff."
    },
    {
        question: "Which rest represents 1 beat of silence?",
        image: createRestImage("crotchet"),
        options: ["Minim rest", "Crotchet rest", "Quaver rest", "Semiquaver rest"],
        correctAnswer: "Crotchet rest",
        hint: "This rest looks like a zigzag and sits on the middle of the staff."
    },
    {
        question: "What is the total value of these two tied notes?",
        image: createNoteImage("tied-notes"),
        options: ["1 beat", "2 beats", "3 beats", "4 beats"],
        correctAnswer: "3 beats",
        hint: "Add the values of each note. A tie connects two notes of the same pitch."
    },
    {
        question: "What's the purpose of beaming in music notation?",
        image: createNoteImage("beamed-notes"),
        options: ["To make the music look better", "To group notes for easier reading", "To change the pitch of notes", "To indicate a change in time signature"],
        correctAnswer: "To group notes for easier reading",
        hint: "Beaming replaces individual flags on notes and helps organize rhythmic patterns."
    }
];

const intermediateQuestions = [
    {
        question: "In 4/4 time signature, what does the top number represent?",
        image: createTimeSignatureImage("4/4"),
        options: ["How many beats in a measure", "Which note gets one beat", "The tempo of the piece", "The key of the music"],
        correctAnswer: "How many beats in a measure",
        hint: "The top number in a time signature tells you about measure organization."
    },
    {
        question: "In a 3/4 time signature, which note gets one beat?",
        image: createTimeSignatureImage("3/4"),
        options: ["Semibreve (whole note)", "Minim (half note)", "Crotchet (quarter note)", "Quaver (eighth note)"],
        correctAnswer: "Crotchet (quarter note)",
        hint: "The bottom number in a time signature tells you which note value gets one beat."
    },
    {
        question: "Which time signature is typically used for a waltz?",
        options: ["2/4", "3/4", "4/4", "6/8"],
        correctAnswer: "3/4",
        sound: "waltz",
        hint: "A waltz has a distinctive ONE-two-three rhythm."
    },
    {
        question: "What type of time signature is 6/8?",
        image: createTimeSignatureImage("6/8"),
        options: ["Simple duple", "Simple triple", "Compound duple", "Compound triple"],
        correctAnswer: "Compound duple",
        hint: "In compound time signatures, divide the top number by 3 to find the number of beats."
    },
    {
        question: "How many main beats are felt in one measure of 9/8 time?",
        image: createTimeSignatureImage("9/8"),
        options: ["3 beats", "6 beats", "8 beats", "9 beats"],
        correctAnswer: "3 beats",
        hint: "In compound time, divide the top number by 3 to find the number of main beats."
    },
    {
        question: "What is the most common time signature in Western music?",
        options: ["2/4", "3/4", "4/4", "6/8"],
        correctAnswer: "4/4",
        hint: "This time signature is so common it's often called 'common time'."
    },
    {
        question: "What symbol is used to separate measures in music notation?",
        image: createBarLineImage("simple"),
        options: ["Clef", "Bar line", "Ledger line", "Beam"],
        correctAnswer: "Bar line",
        hint: "These vertical lines divide music into measures based on the time signature."
    },
    {
        question: "What does a double bar line typically indicate?",
        image: createBarLineImage("double"),
        options: ["A mistake in the music", "The end of a section or piece", "A change in key signature", "A repeat section"],
        correctAnswer: "The end of a section or piece",
        hint: "Double bar lines are used to mark significant structural points in music."
    },
    {
        question: "In 12/8 time, what note value gets one beat?",
        image: createTimeSignatureImage("12/8"),
        options: ["Eighth note", "Quarter note", "Dotted quarter note", "Half note"],
        correctAnswer: "Dotted quarter note",
        hint: "In compound time, the beat is typically a dotted note."
    },
    {
        question: "How many eighth notes (quavers) are in one measure of 3/4 time?",
        image: createTimeSignatureImage("3/4"),
        options: ["3", "4", "6", "8"],
        correctAnswer: "6",
        hint: "Think about how many eighth notes equal one quarter note, then multiply by the number of beats."
    }
];

const advancedQuestions = [
    {
        question: "Which tempo marking indicates a very slow speed?",
        options: ["Allegro", "Andante", "Adagio", "Largo"],
        correctAnswer: "Largo",
        hint: "This is the slowest of the common tempo markings."
    },
    {
        question: "What does 'Allegro' indicate about the tempo of a piece?",
        options: ["Very slow", "Walking pace", "Moderate speed", "Fast"],
        correctAnswer: "Fast",
        sound: "allegro",
        hint: "Allegro is an Italian term suggesting a brisk, lively tempo."
    },
    {
        question: "For notes above the middle line of the staff, which direction should stems point?",
        image: createNoteImage("stem-direction"),
        options: ["Up", "Down", "Either direction", "No stem needed"],
        correctAnswer: "Down",
        hint: "Stem direction helps keep notation clear and organized on the staff."
    },
    {
        question: "What is the purpose of a tie in music notation?",
        image: createNoteImage("tie"),
        options: ["To indicate a slur", "To connect notes of different pitches", "To combine the duration of notes of the same pitch", "To mark a phrase"],
        correctAnswer: "To combine the duration of notes of the same pitch",
        hint: "A tie is a curved line connecting two notes of the same pitch."
    },
    {
        question: "What is the value of a dotted minim (dotted half note)?",
        image: createNoteImage("dotted-minim"),
        options: ["2 beats", "2.5 beats", "3 beats", "4 beats"],
        correctAnswer: "3 beats",
        hint: "A dot adds half of the original note's value."
    },
    {
        question: "What tempo marking indicates 'walking pace'?",
        options: ["Largo", "Adagio", "Andante", "Moderato"],
        correctAnswer: "Andante",
        sound: "andante",
        hint: "This Italian term literally means 'going' or 'walking'."
    },
    {
        question: "What distinguishes a filled (solid) note head from an open (hollow) one?",
        image: createNoteImage("note-heads"),
        options: ["The pitch", "The loudness", "The duration", "The articulation"],
        correctAnswer: "The duration",
        hint: "Note head types are used to indicate different note values."
    },
    {
        question: "What is the typical stem direction for a note on the middle line of the staff?",
        options: ["Always up", "Always down", "Either up or down", "No stem"],
        correctAnswer: "Either up or down",
        hint: "Notes on the middle line have flexible stem direction based on context."
    },
    {
        question: "In music notation, what is the function of beaming?",
        image: createNoteImage("beaming-example"),
        options: ["To indicate articulation", "To show dynamics", "To group notes according to beats", "To change the pitch"],
        correctAnswer: "To group notes according to beats",
        hint: "Beaming helps clarify rhythmic patterns and beat divisions."
    },
    {
        question: "Which tempo marking indicates 'very fast'?",
        options: ["Moderato", "Allegro", "Andante", "Presto"],
        correctAnswer: "Presto",
        sound: "presto",
        hint: "This is one of the fastest standard tempo markings."
    }
];

// SVG Functions for creating notation images
function createNoteImage(type) {
    switch(type) {
        case "semibreve":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
            </svg>`;
        case "minim":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
            </svg>`;
        case "crotchet":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
            </svg>`;
        case "quaver":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
                <path d="M65,0 Q80,10 85,25" stroke="black" stroke-width="1" fill="none" />
            </svg>`;
        case "semiquaver":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
                <path d="M65,0 Q80,10 85,25" stroke="black" stroke-width="1" fill="none" />
                <path d="M65,8 Q75,18 80,30" stroke="black" stroke-width="1" fill="none" />
            </svg>`;
        case "dotted-crotchet":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
                <circle cx="75" cy="25" r="3" fill="black" />
            </svg>`;
        case "dotted-minim":
            return `<svg viewBox="0 0 100 50" class="notation-image">
                <ellipse cx="50" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
                <line x1="65" y1="25" x2="65" y2="0" stroke="black" stroke-width="1" />
                <circle cx="75" cy="25" r="3" fill="black" />
            </svg>`;
        case "tied-notes":
            return `<svg viewBox="0 0 150 50" class="notation-image">
                <ellipse cx="40" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
                <line x1="55" y1="25" x2="55" y2="0" stroke="black" stroke-width="1" />
                <ellipse cx="40" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
                <line x1="55" y1="25" x2="55" y2="0" stroke="black" stroke-width="1" />
                <ellipse cx="90" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="105" y1="25" x2="105" y2="0" stroke="black" stroke-width="1" />
                <path d="M55,20 C65,15 80,15 90,20" stroke="black" stroke-width="1" fill="none" />
            </svg>`;
        case "beamed-notes":
            return `<svg viewBox="0 0 150 50" class="notation-image">
                <ellipse cx="30" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="45" y1="25" x2="45" y2="0" stroke="black" stroke-width="1" />
                <ellipse cx="80" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="95" y1="25" x2="95" y2="0" stroke="black" stroke-width="1" />
                <ellipse cx="130" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="145" y1="25" x2="145" y2="0" stroke="black" stroke-width="1" />
                <rect x="45" y="0" width="100" height="5" fill="black" />
            </svg>`;
        case "stem-direction":
            return `<svg viewBox="0 0 150 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="140" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="140" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="140" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="140" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="140" y2="60" stroke="black" stroke-width="1" />
                <!-- Notes -->
                <ellipse cx="40" cy="60" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="50" y1="60" x2="50" y2="40" stroke="black" stroke-width="1" />
                <ellipse cx="80" cy="40" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="70" y1="40" x2="70" y2="20" stroke="black" stroke-width="1" />
                <ellipse cx="120" cy="20" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="110" y1="20" x2="110" y2="40" stroke="black" stroke-width="1" />
            </svg>`;
        case "tie":
            return `<svg viewBox="0 0 150 50" class="notation-image">
                <ellipse cx="40" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="55" y1="25" x2="55" y2="0" stroke="black" stroke-width="1" />
                <ellipse cx="100" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
                <line x1="115" y1="25" x2="115" y2="0" stroke="black" stroke-width="1" />
                <path d="M55,20 C70,10 85,10 100,20" stroke="black" stroke-width="1" fill="none" />
            </svg>`;
        case "note-heads":
            return `<svg viewBox="0 0 150 50" class="notation-image">
                <ellipse cx="40" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="none" />
                <ellipse cx="100" cy="25" rx="15" ry="10" stroke="black" stroke-width="1" fill="black" />
            </svg>`;
        case "beaming-example":
            return `<svg viewBox="0 0 200 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="190" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="190" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="190" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="190" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="190" y2="60" stroke="black" stroke-width="1" />
                <!-- Notes -->
                <ellipse cx="40" cy="50" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="50" y1="50" x2="50" y2="20" stroke="black" stroke-width="1" />
                <ellipse cx="80" cy="40" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="90" y1="40" x2="90" y2="20" stroke="black" stroke-width="1" />
                <ellipse cx="120" cy="30" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="130" y1="30" x2="130" y2="20" stroke="black" stroke-width="1" />
                <ellipse cx="160" cy="40" rx="10" ry="7" stroke="black" stroke-width="1" fill="black" />
                <line x1="170" y1="40" x2="170" y2="20" stroke="black" stroke-width="1" />
                <!-- Beams -->
                <rect x="50" y="20" width="120" height="5" fill="black" />
            </svg>`;
        default:
            return "";
    }
}

function createRestImage(type) {
    switch(type) {
        case "semibreve":
            return `<svg viewBox="0 0 100 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="90" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="90" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="black" stroke-width="1" />
                <!-- Semibreve rest -->
                <rect x="40" y="37" width="20" height="5" fill="black" />
            </svg>`;
        case "minim":
            return `<svg viewBox="0 0 100 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="90" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="90" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="black" stroke-width="1" />
                <!-- Minim rest -->
                <rect x="40" y="40" width="20" height="5" fill="black" />
            </svg>`;
        case "crotchet":
            return `<svg viewBox="0 0 100 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="90" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="90" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="black" stroke-width="1" />
                <!-- Crotchet rest -->
                <path d="M50,30 L45,40 L55,50 L45,60" stroke="black" stroke-width="2" fill="none" />
            </svg>`;
        case "quaver":
            return `<svg viewBox="0 0 100 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="10" y1="20" x2="90" y2="20" stroke="black" stroke-width="1" />
                <line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="1" />
                <line x1="10" y1="40" x2="90" y2="40" stroke="black" stroke-width="1" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="black" stroke-width="1" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="black" stroke-width="1" />
                <!-- Quaver rest -->
                <path d="M45,30 L55,40 L45,50 C55,45 55,35 45,30 Z" stroke="black" stroke-width="1" fill="black" />
            </svg>`;
        default:
            return "";
    }
}

function createTimeSignatureImage(signature) {
    switch(signature) {
        case "4/4":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Time signature -->
                <text x="25" y="35" font-size="20" font-family="serif" text-anchor="middle">4</text>
                <text x="25" y="55" font-size="20" font-family="serif" text-anchor="middle">4</text>
            </svg>`;
        case "3/4":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Time signature -->
                <text x="25" y="35" font-size="20" font-family="serif" text-anchor="middle">3</text>
                <text x="25" y="55" font-size="20" font-family="serif" text-anchor="middle">4</text>
            </svg>`;
        case "6/8":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Time signature -->
                <text x="25" y="35" font-size="20" font-family="serif" text-anchor="middle">6</text>
                <text x="25" y="55" font-size="20" font-family="serif" text-anchor="middle">8</text>
            </svg>`;
        case "9/8":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Time signature -->
                <text x="25" y="35" font-size="20" font-family="serif" text-anchor="middle">9</text>
                <text x="25" y="55" font-size="20" font-family="serif" text-anchor="middle">8</text>
            </svg>`;
        case "12/8":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Time signature -->
                <text x="25" y="35" font-size="16" font-family="serif" text-anchor="middle">12</text>
                <text x="25" y="55" font-size="20" font-family="serif" text-anchor="middle">8</text>
            </svg>`;
        default:
            return "";
    }
}

function createBarLineImage(type) {
    switch(type) {
        case "simple":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Bar line -->
                <line x1="25" y1="20" x2="25" y2="60" stroke="black" stroke-width="1" />
            </svg>`;
        case "double":
            return `<svg viewBox="0 0 50 80" class="notation-image">
                <!-- Staff lines -->
                <line x1="5" y1="20" x2="45" y2="20" stroke="black" stroke-width="1" />
                <line x1="5" y1="30" x2="45" y2="30" stroke="black" stroke-width="1" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="black" stroke-width="1" />
                <line x1="5" y1="50" x2="45" y2="50" stroke="black" stroke-width="1" />
                <line x1="5" y1="60" x2="45" y2="60" stroke="black" stroke-width="1" />
                <!-- Double bar line -->
                <line x1="25" y1="20" x2="25" y2="60" stroke="black" stroke-width="1" />
                <line x1="30" y1="20" x2="30" y2="60" stroke="black" stroke-width="2" />
            </svg>`;
        default:
            return "";
    }
}

// Audio functions
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return true;
    } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return false;
    }
}

function playSound(type) {
    if (!audioContext) {
        if (!initAudio()) return;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set sound type based on the note or tempo
    let frequency = 440; // A4
    let duration = 1;
    
    switch(type) {
        case "semibreve":
            duration = 4;
            break;
        case "minim":
            duration = 2;
            break;
        case "crotchet":
            duration = 1;
            break;
        case "quaver":
            duration = 0.5;
            break;
        case "semiquaver":
            duration = 0.25;
            break;
        case "waltz":
            playWaltzPattern();
            return;
        case "allegro":
            playTempoExample(120);
            return;
        case "andante":
            playTempoExample(80);
            return;
        case "presto":
            playTempoExample(160);
            return;
        default:
            break;
    }
    
    // Standard note sound
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playWaltzPattern() {
    if (!audioContext) {
        if (!initAudio()) return;
    }
    
    const now = audioContext.currentTime;
    const tempo = 100; // BPM
    const beatDuration = 60 / tempo;
    
    // Play 2 measures of waltz 3/4
    for (let measure = 0; measure < 2; measure++) {
        playNote(440, now + measure * 3 * beatDuration, beatDuration, 0.5); // Stronger first beat
        playNote(392, now + (measure * 3 + 1) * beatDuration, beatDuration, 0.3);
        playNote(392, now + (measure * 3 + 2) * beatDuration, beatDuration, 0.3);
    }
}

function playTempoExample(bpm) {
    if (!audioContext) {
        if (!initAudio()) return;
    }
    
    const now = audioContext.currentTime;
    const beatDuration = 60 / bpm;
    
    // Play 4 beats to demonstrate the tempo
    for (let i = 0; i < 4; i++) {
        playNote(440, now + i * beatDuration, 0.1, 0.3);
    }
}

function playNote(frequency, startTime, duration, volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Quiz functionality
function startQuiz() {
    startScreen.classList.add("hidden");
    levelSelect.classList.remove("hidden");
}

function selectLevel(level) {
    selectedLevel = level;
    
    switch(level) {
        case "beginner":
            quizQuestions = beginnerQuestions;
            break;
        case "intermediate":
            quizQuestions = intermediateQuestions;
            break;
        case "advanced":
            quizQuestions = advancedQuestions;
            break;
    }
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = new Array(quizQuestions.length).fill(false);
    
    // Show quiz interface
    levelSelect.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    progressContainer.classList.remove("hidden");
    scoreDisplay.classList.remove("hidden");
    
    // Load first question
    loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
    const question = quizQuestions[index];
    
    questionNumberEl.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
    questionEl.innerHTML = question.question + ' <button class="hint-btn" id="hintBtn">?</button>';
    hintText.textContent = question.hint;
    hintText.style.display = "none";
    
    // Set up the notation display if available
    if (question.image) {
        notationDisplay.innerHTML = question.image;
        notationDisplay.classList.remove("hidden");
    } else {
        notationDisplay.classList.add("hidden");
    }
    
    // Set up the sound button if available
    if (question.sound) {
        playSoundBtn.classList.remove("hidden");
        playSoundBtn.onclick = function() {
            playSound(question.sound);
        };
    } else {
        playSoundBtn.classList.add("hidden");
    }
    
    // Create options
    optionsEl.innerHTML = "";
    question.options.forEach((option, i) => {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.textContent = option;
        
        // If question already answered, show correct/incorrect
        if (answeredQuestions[index]) {
            button.classList.add("disabled");
            if (option === question.correctAnswer) {
                button.classList.add("correct");
            } else if (option === question.userAnswer) {
                button.classList.add("incorrect");
            }
        } else {
            button.addEventListener("click", () => selectAnswer(option));
        }
        
        optionsEl.appendChild(button);
    });
    
    // Hide feedback
    feedbackEl.style.display = "none";
    
    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = !answeredQuestions[index];
    
    // Update progress bar
    const progress = answeredQuestions.filter(Boolean).length / quizQuestions.length * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update score display
    document.getElementById("currentScore").textContent = score;
    
    // Reset hint button
    document.getElementById("hintBtn").addEventListener("click", showHint);
    
    clearInterval(questionTimer);
    startTimer();
}

function selectAnswer(answer) {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;
    
    // Save user's answer
    question.userAnswer = answer;
    answeredQuestions[currentQuestionIndex] = true;
    
    // Update score if correct
    if (isCorrect) {
        score++;
        document.getElementById("currentScore").textContent = score;
    }
    
    // Highlight correct/incorrect options
    const optionButtons = optionsEl.querySelectorAll(".option-btn");
    optionButtons.forEach(button => {
        button.classList.add("disabled");
        
        if (button.textContent === question.correctAnswer) {
            button.classList.add("correct");
        } else if (button.textContent === answer && !isCorrect) {
            button.classList.add("incorrect");
        }
    });
    
    // Show feedback
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.textContent = isCorrect ? 
        "Correct! Well done!" : 
        `Incorrect. The correct answer is ${question.correctAnswer}.`;
    feedbackEl.style.display = "block";
    
    // Enable Next button
    nextBtn.disabled = false;
    
    // Update progress bar
    const progress = answeredQuestions.filter(Boolean).length / quizQuestions.length * 100;
    progressBar.style.width = `${progress}%`;
    
    // Check if quiz is complete
    if (answeredQuestions.every(Boolean)) {
        // Enable a slight delay before showing the results
        setTimeout(showResults, 1500);
    }
    
    clearInterval(questionTimer);
    playSoundEffect(isCorrect ? "correct" : "incorrect");
}

function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function showHint() {
    hintText.style.display = hintText.style.display === "none" ? "block" : "none";
}

function showResults() {
    quizContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    
    finalScoreEl.textContent = score;
    
    // Determine badge and message based on score
    let badgeClass = "";
    let message = "";
    
    const percentage = (score / quizQuestions.length) * 100;
    
    if (percentage >= 90) {
        badgeClass = "gold";
        message = "Outstanding! You're a music theory master!";
        badgeEl.innerHTML = "🏆";
    } else if (percentage >= 70) {
        badgeClass = "silver";
        message = "Great job! You have a solid understanding of music theory!";
        badgeEl.innerHTML = "🎵";
    } else if (percentage >= 50) {
        badgeClass = "bronze";
        message = "Good effort! With more practice, you'll master these concepts.";
        badgeEl.innerHTML = "🎼";
    } else {
        message = "Keep practicing! Music theory takes time to learn.";
        badgeEl.innerHTML = "📚";
    }
    
    badgeEl.className = `badge ${badgeClass}`;
    resultsMessageEl.textContent = message;
    
    updateProgress();
    adjustDifficulty();
}

function retryQuiz() {
    // Reset quiz with same level
    selectLevel(selectedLevel);
}

function goHome() {
    // Reset and go back to start screen
    resultsContainer.classList.add("hidden");
    startScreen.classList.remove("hidden");
    progressContainer.classList.add("hidden");
    scoreDisplay.classList.add("hidden");
}

// Event listeners
startBtn.addEventListener("click", startQuiz);

levelBtns.forEach(btn => {
    btn.addEventListener("click", () => selectLevel(btn.dataset.level));
});

nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
retryBtn.addEventListener("click", retryQuiz);
homeBtn.addEventListener("click", goHome);

// Timer functionality
function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    questionTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 10) {
        timerDisplay.classList.add("warning");
    } else {
        timerDisplay.classList.remove("warning");
    }
}

function handleTimeUp() {
    const question = quizQuestions[currentQuestionIndex];
    if (!answeredQuestions[currentQuestionIndex]) {
        selectAnswer(null); // Time's up - mark as incorrect
        playSoundEffect("timeup");
    }
}

// Sound effects system
function playSoundEffect(type) {
    if (!audioContext) {
        if (!initAudio()) return;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case "correct":
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
            break;
        case "incorrect":
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.1);
            break;
        case "timeup":
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.1);
            break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Progress tracking system
const progressData = {
    beginner: { attempts: 0, highScore: 0, lastScore: 0 },
    intermediate: { attempts: 0, highScore: 0, lastScore: 0 },
    advanced: { attempts: 0, highScore: 0, lastScore: 0 }
};

function updateProgress() {
    const level = selectedLevel;
    progressData[level].attempts++;
    progressData[level].lastScore = score;
    
    if (score > progressData[level].highScore) {
        progressData[level].highScore = score;
        showNewHighScore();
    }
    
    saveProgress();
}

function showNewHighScore() {
    const highScoreMessage = document.createElement("div");
    highScoreMessage.className = "high-score-message";
    highScoreMessage.textContent = "🎉 New High Score! 🎉";
    document.body.appendChild(highScoreMessage);
    
    setTimeout(() => {
        highScoreMessage.remove();
    }, 3000);
}

function saveProgress() {
    localStorage.setItem('musicQuizProgress', JSON.stringify(progressData));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('musicQuizProgress');
    if (savedProgress) {
        Object.assign(progressData, JSON.parse(savedProgress));
    }
}

// Difficulty adjustment system
function adjustDifficulty() {
    const level = selectedLevel;
    const lastScore = progressData[level].lastScore;
    const totalQuestions = quizQuestions.length;
    const scorePercentage = (lastScore / totalQuestions) * 100;
    
    if (scorePercentage >= 90 && level === "beginner") {
        suggestLevelUp("intermediate");
    } else if (scorePercentage >= 90 && level === "intermediate") {
        suggestLevelUp("advanced");
    } else if (scorePercentage < 50 && level === "advanced") {
        suggestLevelDown("intermediate");
    } else if (scorePercentage < 50 && level === "intermediate") {
        suggestLevelDown("beginner");
    }
}

function suggestLevelUp(newLevel) {
    const suggestion = document.createElement("div");
    suggestion.className = "level-suggestion";
    suggestion.innerHTML = `
        <p>You're doing great! Ready for a challenge?</p>
        <button onclick="selectLevel('${newLevel}')">Try ${newLevel} level</button>
    `;
    document.body.appendChild(suggestion);
    
    setTimeout(() => {
        suggestion.remove();
    }, 5000);
}

function suggestLevelDown(newLevel) {
    const suggestion = document.createElement("div");
    suggestion.className = "level-suggestion";
    suggestion.innerHTML = `
        <p>Want to strengthen your basics?</p>
        <button onclick="selectLevel('${newLevel}')">Try ${newLevel} level</button>
    `;
    document.body.appendChild(suggestion);
    
    setTimeout(() => {
        suggestion.remove();
    }, 5000);
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    // Pre-load the audio context if possible
    initAudio();
    loadProgress();
});