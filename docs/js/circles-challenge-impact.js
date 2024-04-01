import * as d3 from "npm:d3";
import { CONSTANTS } from "./constants.js";
import { rBubbleScale, angleDegreesChallengeScale, colorChallengeScale } from "./scales.js";

let calculateData = (d) => {
    let dataset = d3.flatRollup(
        d.data, 
        v => v.length, 
        d => d.challenge, 
        d => d.n,
        d => d.category
    );
    let scoreTotalCountByChallenge = d3.rollup(
        d.data.filter(e => e.category != "Did not answer"),
        v => v.length,
        d => d.challenge
    );
    let scoreCountByChallengeCategory = d3.rollup(
        d.data,
        v => v.length,
        d => d.challenge,
        d => d.category
    );
    dataset.forEach((element, index) => {
        dataset[index] = {
            "challenge": element[0],
            "n": element[1],
            "category": element[2],
            "scoreCount": element[3],
            "scoreTotalCount": scoreTotalCountByChallenge.get(element[0]),
            "scoreCumulativeCount": (
                (["No impact", "Minor impact", "Moderate impact", "Significant impact"].includes(element[2])   ? (scoreCountByChallengeCategory.get(element[0]).get("No impact") ?? 0) : 0)
                + (["Minor impact", "Moderate impact", "Significant impact"].includes(element[2])   ? (scoreCountByChallengeCategory.get(element[0]).get("Minor impact") ?? 0) : 0)
                + (["Moderate impact", "Significant impact"].includes(element[2])                   ? (scoreCountByChallengeCategory.get(element[0]).get("Moderate impact") ?? 0) : 0)
                + (["Significant impact"].includes(element[2])                                   ? (scoreCountByChallengeCategory.get(element[0]).get("Significant impact") ?? 0) : 0)
            ),
            "cY": d3.scaleLinear()
                .domain([0, 1])
                .range([0, rBubbleScale(element[1])])(
                    (
                        (["No impact", "Minor impact", "Moderate impact", "Significant impact"].includes(element[2])   ? (scoreCountByChallengeCategory.get(element[0]).get("No impact") ?? 0) : 0)
                        + (["Minor impact", "Moderate impact", "Significant impact"].includes(element[2])   ? (scoreCountByChallengeCategory.get(element[0]).get("Minor impact") ?? 0) : 0)
                        + (["Moderate impact", "Significant impact"].includes(element[2])                   ? (scoreCountByChallengeCategory.get(element[0]).get("Moderate impact") ?? 0) : 0)
                        + (["Significant impact"].includes(element[2])                                   ? (scoreCountByChallengeCategory.get(element[0]).get("Significant impact") ?? 0) : 0)
                    ) / scoreTotalCountByChallenge.get(element[0]) 
                    ?? 0
            )
        };
    });
    dataset = dataset.sort((a, b) => d3.ascending(CONSTANTS.challenges[a.challenge], CONSTANTS.challenges[b.challenge]));
    return dataset;
}

let generateCircle = (gChallengeImpact, impact) => {
    let g = gChallengeImpact
        .filter(d => d.category == impact)
        .append("g")
            .classed("circle-impact", true)
            .classed(impact.split(' ').join('-').toLowerCase(), true);
    g.append("circle")
        .classed(`circle-impact-${impact.slice(0, -7).toLowerCase()}`, true)
        .attr("transform", d => `rotate(${angleDegreesChallengeScale(d.challenge)})`)
        .style("stroke-width", 1)
        .style("stroke", "#ffffff")
        .attr("cy", 0)
        .attr("r", 5 )
        .attr("fill", d => colorChallengeScale(d.challenge))
        .on("mouseover", (e, d) => {
            d3.select("#tooltip")
                .classed("hidden", false)
                .style("left", `${e.layerX+50}px`)
                .style("top", `${e.pageY-100}px`)
                .html(`<strong>${(d.scoreCumulativeCount/d.scoreTotalCount*100).toFixed(0)}th Percentile: </strong> 
                ${d.scoreCumulativeCount} of ${d.scoreTotalCount} Respondents feeling up to ${impact}.
                <br><br><strong>${(d.scoreCount/d.scoreTotalCount*100).toFixed(1)}%</strong> (${d.scoreCount} of ${d.scoreTotalCount}) 
                feel that
                <strong style="color:${colorChallengeScale(d.challenge)}">${CONSTANTS.challengesClean[d.challenge]}</strong> 
                has a <strong>${impact}</strong> on their data visualization practice.`);
        })
        .on("mouseout", () => {d3.select("#tooltip").classed("hidden", true)});
    return g
}

export let generateCircleChallengeImpact = (gBubblePriority) => {
    let ggBubblePriority = gBubblePriority.append("g").classed("circle", true)
        .style("display", "none")
        .attr("opacity", 0);  // Initialize as hidden
    let gChallengeImpact = ggBubblePriority
        .selectAll("g.circle-impact")
        .data(d => calculateData(d))
        .enter();
    let gChallengeImpactNo = generateCircle(gChallengeImpact, "No impact");
    let gChallengeImpactMinor = generateCircle(gChallengeImpact, "Minor impact");
    let gChallengeImpactModerate = generateCircle(gChallengeImpact, "Moderate impact");
    return ggBubblePriority;
}

export let updateCircleChallengeImpact = () => {
    ["No impact", "Minor impact", "Moderate impact"].forEach(impact => {
        d3.selectAll(`.circle-impact-${impact.slice(0, -7).toLowerCase()}`)
            .transition().duration(CONSTANTS.transitionDuration)
            .attr("cy", d => d.cY); // Move to position
    });
}

export let hideCircleChallengeImpact = () => {
    ["No impact", "Minor impact", "Moderate impact"].forEach(impact => {
        d3.selectAll(`.circle-impact-${impact.slice(0, -7).toLowerCase()}`)
            .transition().duration(CONSTANTS.transitionDuration)
            .attr("cy", 0); // Move to center
    });
}
