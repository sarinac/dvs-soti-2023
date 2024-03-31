export const CONSTANTS = {
    svgWidth: 640,
    svgHeight: 800,
    nChallenges: 13,
    challenges: {
        "lacktime": 1,
        "lackdesignexpertise": 2,
        "lacktechskill": 3,
        "learningnewtoolsetc": 4,
        "accessingdata": 5,
        "infooverload": 6,
        "lackcollaboration": 7,
        "lackmentorship": 8,
        "lowdataliteracy": 9,
        "dataviznotrespected": 10,
        "toolstechlimits": 11,
        "nonvizactivity": 12,
        "datavolume": 13
    },
    priorityPositions: {  // See simulation-scratchwork.js for how I did this
        "unknown": "translate(19.306462568067715,261.30389553765247)",
        "improving-my-design-skills": "translate(-86.8586074002201,-164.88935172234832)",
        "improving-my-data-skills": "translate(137.31284098520142,-201.53159987047218)",
        "i-dont-feel-i-need-to-improve-my-data-visualization-skills-currently": "translate(206.08134593743307,183.7579035893415)",
        "improving-my-communication-or-teamwork": "translate(16.420930917529638,-319.675813076258)",
        "improving-my-skills-with-an-existing-technical-tool-or-library": "translate(85.81187222683959,21.87596534782982)",
        "learning-a-new-technical-tool-or-library": "translate(-156.3001478160884,72.00672079837248)"
    },
    impactPositions: {
        "No impact": 0, 
        "Minor impact": 1, 
        "Moderate impact": 2, 
        "Significant impact": 3
    },
    interpolateCap: 0.8
};