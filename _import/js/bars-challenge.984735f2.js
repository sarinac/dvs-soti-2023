import * as d3 from "../../_npm/d3@7.9.0/+esm.js";
import { CONSTANTS } from "./constants.3f1b9e34.js";
import { rBubbleScale, angleDegreesChallengeScale, angleRadiansChallengeScale, colorChallengeScale } from "./scales.f9ad98ee.js";

let calculateData = (d) => {
    let dataset = d3.flatRollup(
        d.data, 
        v => {
            return {
                "mean": d3.mean(v, d => d.score), 
                "sum": d3.sum(v, d => d.score), 
                "count": v.length
            }
        }, 
        d=>d.challenge, 
        d=>d.n  // Priority
    );
    let scoreMaxAvg = d3.max(dataset, d => d[2].mean);
    let scoreMaxLimit = Math.ceil(d3.max(dataset, d => d[2].sum) / 10) * 10;
    dataset.forEach((element, index) => {
        dataset[index] = {
            "challenge": element[0],
            "n": element[1],
            "scoreAvg": element[2].mean,
            "scoreSum": element[2].sum,
            "scoreCount": element[2].count,
            "scoreMaxAvg": scoreMaxAvg,
            "scoreMaxLimit": scoreMaxLimit,
            "rScale": d3.scaleLinear().domain([0, 1]).range([0, rBubbleScale(element[1])])
        };
    });
    // console.log(dataset);
    return dataset;
}

let generateBarChallenge = (gBarChallenge) => {
    let barChallenge = gBarChallenge
        .append("path")
        .attr("class", d => `bar-challenge-path bar-${d.challenge}-${d.n}`)
        .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(d => rBubbleScale(d.n)) 
            .startAngle(d => angleRadiansChallengeScale(d.challenge, -1, 1, 1))
            .endAngle(d => angleRadiansChallengeScale(d.challenge, 1, 1, 1))
        )
        .attr("fill", d => colorChallengeScale(d.challenge))
        .on("mouseover", (e, d) => {
            d3.select("#tooltip")
                .classed("hidden", false)
                .style("left", `${e.pageX-100}px`)
                .style("top", `${e.pageY-100}px`)
                .html(`<strong style="color:${colorChallengeScale(d.challenge)}">${CONSTANTS.challengesClean[d.challenge]}</strong> has a Relative Impact Score of <strong>${d.scoreAvg.toFixed(2)}</strong>.`);
        })
        .on("mouseout", () => {d3.select("#tooltip").classed("hidden", true)});
    return barChallenge;
}

export let updateBarChallenge = () => {
    d3.selectAll(".bar-challenge-path")
        .transition().duration(CONSTANTS.transitionDuration)
        .attr("d", d3.arc()
            .innerRadius(0) 
            .outerRadius(d => d.rScale(d.scoreAvg / d.scoreMaxAvg))   // could do `d.rScale(d.scoreAvg)` but it looks prettier to scale it
            .startAngle(d => angleRadiansChallengeScale(d.challenge, -1, 1, 1))
            .endAngle(d => angleRadiansChallengeScale(d.challenge, 1, 1, 1))
        );
}
export let hideBarChallenge = () => {
    d3.selectAll(".bar-challenge-path")
        .transition()
        .attr("d", d3.arc()
            .innerRadius(0) 
            .outerRadius(d => rBubbleScale(d.n)) 
            .startAngle(d => angleRadiansChallengeScale(d.challenge, -1, 1, 0))
            .endAngle(d => angleRadiansChallengeScale(d.challenge, 1, 1, 0))
        );
}


export let generateBarChallenges = (gBubblePriority) => {
    let ggBubblePriority = gBubblePriority.append("g").classed("bar", true)
        .style("display", "none")
        .attr("opacity", 0);  // Initialize as hidden
    let gChallenge = ggBubblePriority
        .selectAll("g.bar-challenge")
        .data(d => calculateData(d))
        .enter()
        .append("g")
            .attr("class", d => `bar-challenge ${d.challenge}`);

    let gBarChallenge = gChallenge
        .append("g")
            .classed("bars", true);

    let barChallenge = generateBarChallenge(gBarChallenge);
    return barChallenge;
}

export let generateAxisChallenges = (gBubblePriority) => {
    let ggBubblePriority = gBubblePriority.append("g").classed("axis", true)
    let gChallenge = ggBubblePriority
        .selectAll("g.axis-challenge")
        .data(d => calculateData(d))
        .enter()
        .append("g")
            .attr("class", d => `axis-challenge ${d.challenge}`);
    let gAxisChallenge = gChallenge
        .append("g")
            .classed("axis", true)
            .attr("opacity", 0);  // Initialize as hidden;
    let axisChallenge = gAxisChallenge
        .append("path")
            .attr("transform", d => `rotate(${angleDegreesChallengeScale(d.challenge)})`)
            .attr("d", d => d3.line()([[0, 0], [0, rBubbleScale(d.n)]]));
    return axisChallenge;
}