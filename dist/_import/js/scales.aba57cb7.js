import * as d3 from "../../_npm/d3@7.9.0/+esm.js";
import { CONSTANTS } from "./constants.5eea0e24.js";

const interpolateCap = CONSTANTS.interpolateCap;

export let rBubbleScale = (n) => {
    return d3.scaleSqrt()
        .domain([0, 222]) // d3.max(data, d => d.n)
        .range([30, 120])
        (n);
};

export let colorChallengeScale = (challenge) => {
    return d3.scaleSequential(d3.interpolateOrRd)(
        (1 - interpolateCap) 
        + interpolateCap 
        - (
            interpolateCap 
            * CONSTANTS.challenges[challenge] 
            / CONSTANTS.nChallenges
        )
    );
};

export let angleRadiansChallengeScale = (challenge, direction, isPie, isInner) => {
    let 
        offsetEdge = isPie * 0.5,
        offsetPadding = isInner * (1 - interpolateCap) / 2;
    return 2 
        * Math.PI 
        / CONSTANTS.nChallenges 
        * (
            CONSTANTS.challenges[challenge] 
            + direction 
            * (offsetEdge - offsetPadding) 
            + CONSTANTS.nChallenges / 2
        );
};

export let angleDegreesChallengeScale = (challenge) => {
    return 360 
        / CONSTANTS.nChallenges 
        * CONSTANTS.challenges[challenge];
};
