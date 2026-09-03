/* =================================
   LEVEL UP V1
================================= */


/* =================================
   GAME DATA
================================= */

const missions = [

    {
        id: "soccer",
        icon: "⚽",
        title: "SOCCER TRAINING",
        description: "Complete today's soccer session",
        xp: 100
    },

    {
        id: "workout",
        icon: "🏋️",
        title: "WORKOUT",
        description: "Complete today's workout",
        xp: 100
    },

    {
        id: "water",
        icon: "💧",
        title: "WATER GOAL",
        description: "Complete your water goal",
        xp: 50
    },

    {
        id: "nutrition",
        icon: "🍎",
        title: "LOG YOUR FOOD",
        description: "Track today's meals",
        xp: 50
    },

    {
        id: "study",
        icon: "🧠",
        title: "STUDY SESSION",
        description: "Complete one focused study session",
        xp: 75
    }

];


/* =================================
   PLAYER DATA
================================= */

const defaultPlayer = {

    name: "FEIVEL",

    level: 1,

    xp: 0,

    streak: 0,

    skillPoints: 0,

    completedMissions: [],

    lastDate: null

};


let player = loadPlayer();


/* =================================
   LOCAL STORAGE
================================= */

function loadPlayer() {

    const saved =
        localStorage.getItem(
            "LEVEL_UP_V1"
        );

    if (!saved) {

        return {
            ...defaultPlayer
        };

    }

    return {
        ...defaultPlayer,
        ...JSON.parse(saved)
    };

}


function savePlayer() {

    localStorage.setItem(

        "LEVEL_UP_V1",

        JSON.stringify(player)

    );

}


/* =================================
   XP SYSTEM
================================= */

function xpRequired() {

    return 500 +
        ((player.level - 1) * 150);

}


/* =================================
   DATE
================================= */

function getToday() {

    const date =
        new Date();

    return date
        .toISOString()
        .split("T")[0];

}


function formatDate() {

    return new Date()
        .toLocaleDateString(
            undefined,
            {
                weekday: "short",
                month: "short",
                day: "numeric"
            }
        );

}


/* =================================
   DAILY RESET
================================= */

function checkNewDay() {

    const today =
        getToday();


    if (
        player.lastDate !==
        today
    ) {

        if (
            player.lastDate !==
            null
        ) {

            /*
              If the player completed
              all missions yesterday,
              continue the streak.
            */

            if (
                player.completedMissions.length ===
                missions.length
            ) {

                player.streak++;

            } else {

                player.streak = 0;

            }

        }


        player.completedMissions = [];

        player.lastDate = today;

        savePlayer();

    }

}


/* =================================
   ADD XP
================================= */

function addXP(amount) {

    player.xp += amount;


    let leveledUp = false;


    while (
        player.xp >= xpRequired()
    ) {

        player.xp -=
            xpRequired();

        player.level++;

        player.skillPoints++;

        leveledUp = true;

    }


    savePlayer();

    render();


    if (leveledUp) {

        showLevelUp();

    }

}


/* =================================
   COMPLETE MISSION
================================= */

function completeMission(id) {

    if (
        player.completedMissions
            .includes(id)
    ) {

        return;

    }


    const mission =
        missions.find(
            mission =>
                mission.id === id
        );


    if (!mission) {

        return;

    }


    player.completedMissions
        .push(id);


    addXP(mission.xp);


    savePlayer();

    render();

}


/* =================================
   RENDER MISSIONS
================================= */

function renderMissions() {

    const container =
        document.getElementById(
            "missions"
        );


    container.innerHTML = "";


    missions.forEach(
        mission => {

            const completed =
                player.completedMissions
                    .includes(
                        mission.id
                    );


            const element =
                document.createElement(
                    "button"
                );


            element.className =
                "mission";


            if (completed) {

                element.classList.add(
                    "done"
                );

            }


            element.innerHTML = `

                <div class="mission-icon">
                    ${mission.icon}
                </div>

                <div>

                    <span class="mission-title">
                        ${mission.title}
                    </span>

                    <span class="mission-sub">
                        ${mission.description}
                    </span>

                </div>

                <div>

                    <span class="mission-reward">
                        +${mission.xp} XP
                    </span>

                    <span class="mission-check">
                        ${completed ? "✓" : ""}
                    </span>

                </div>

            `;


            element.addEventListener(
                "click",
                () => {

                    completeMission(
                        mission.id
                    );

                }
            );


            container.appendChild(
                element
            );

        }
    );

}


/* =================================
   RENDER PLAYER
================================= */

function renderPlayer() {

    document.getElementById(
        "playerName"
    ).textContent =
        player.name;


    document.getElementById(
        "level"
    ).textContent =
        player.level;


    document.getElementById(
        "xp"
    ).textContent =
        player.xp;


    document.getElementById(
        "xpNeeded"
    ).textContent =
        xpRequired();


    document.getElementById(
        "streak"
    ).textContent =
        player.streak;


    document.getElementById(
        "missionsCompleted"
    ).textContent =
        player.completedMissions.length;


    document.getElementById(
        "skillPoints"
    ).textContent =
        player.skillPoints;


    const percent =
        (
            player.xp /
            xpRequired()
        ) * 100;


    document.getElementById(
        "xpProgress"
    ).style.width =
        `${Math.min(percent, 100)}%`;


    document.getElementById(
        "date"
    ).textContent =
        formatDate();

}


/* =================================
   LEVEL UP POPUP
================================= */

function showLevelUp() {

    const popup =
        document.getElementById(
            "levelUpPopup"
        );


    document.getElementById(
        "newLevel"
    ).textContent =
        `LEVEL ${player.level}`;


    popup.classList.add(
        "show"
    );

}


/* =================================
   CLOSE POPUP
================================= */

document
    .getElementById(
        "continueButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "levelUpPopup"
                )
                .classList.remove(
                    "show"
                );

        }
    );


/* =================================
   MAIN RENDER
================================= */

function render() {

    renderPlayer();

    renderMissions();

}


/* =================================
   START APP
================================= */

checkNewDay();

render();
