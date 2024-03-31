import * as d3 from "npm:d3";
import { CONSTANTS } from "./constants.js";

const interpolateCap = CONSTANTS.interpolateCap;

export let rBubbleScale = (n) => {
    return d3.scaleSqrt()
        .domain([0, 222]) // d3.max(data, d => d.n)
        .range([30, 120])
        (n);
};
export let fontBubbleScale = (n) => {
    return d3.scaleSqrt()
        .domain([0, 222]) // d3.max(data, d => d.n)
        .range([14, 60])
        (n);
};
export let fontBubbleScaleBottom = (n) => {
    return d3.scaleSqrt()
        .domain([0, 222]) // d3.max(data, d => d.n)
        .range([12, 20])
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
