import * as d3 from "npm:d3";
import { CONSTANTS } from "./constants.js";
import { rBubbleScale, angleRadiansChallengeScale } from "./scales.js";

let calculateData = (d) => {
    let scoreCountByChallengeCategory = d3.rollup(
        d.data,
        v => v.length,
        d => d.challenge,
        d => d.category
    );
    let scoreCountByChallenge = d3.rollup(
        d.data.filter(e => e.category != "Did not answer"),
        v => v.length, 
        d => d.challenge
    );
    let dataset = [];
    for (let category of ["No impact", "Minor impact", "Moderate impact", "Significant impact", "Did not answer"]) {
        dataset.push({
            "category": category,
            "priority": d.priority,
            "id": d.id,
            "n": d.n,
            "challenges": Object.keys(CONSTANTS.challenges),
            "challengesScoreCount": Object.keys(CONSTANTS.challenges).map(challenge => {return {"challenge": challenge, "scoreCount": scoreCountByChallengeCategory.get(challenge).get(category) ?? 0}}),
            "challengesCY": Object.keys(CONSTANTS.challenges).map(challenge => {
                return d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, rBubbleScale(d.n)])(
                        (
                            (["No impact", "Minor impact", "Moderate impact", "Significant impact"].includes(category)   ? (scoreCountByChallengeCategory.get(challenge).get("No impact") ?? 0) : 0)
                            + (["Minor impact", "Moderate impact", "Significant impact"].includes(category)   ? (scoreCountByChallengeCategory.get(challenge).get("Minor impact") ?? 0) : 0)
                            + (["Moderate impact", "Significant impact"].includes(category)                   ? (scoreCountByChallengeCategory.get(challenge).get("Moderate impact") ?? 0) : 0)
                            + (["Significant impact"].includes(category)                                   ? (scoreCountByChallengeCategory.get(challenge).get("Significant impact") ?? 0) : 0)
                        ) / scoreCountByChallenge.get(challenge) 
                        ?? 0 
                    )
            })
        });
    }
    dataset = dataset.sort((a, b) => d3.ascending(CONSTANTS.challenges[a.challenge], CONSTANTS.challenges[b.challenge]));
    dataset = dataset.sort((a, b) => d3.descending(CONSTANTS.impactPositions[a.category], CONSTANTS.impactPositions[b.category]));  // TODO: sort by impact
    
    return dataset;
}

let generateLine = (g, category) => {
    return g
        .filter(d => category === d.category)
        .append("path")
            .attr("class", d => `impact-curve-path impact-curve-path-${d.n}-${d.category.slice(0, -7).toLowerCase()}`)
            .attr("fill", "none")
            .attr("d", () => {
                let path = d3.line()
                    .x(0)
                    .y(0)
                    .curve(d3.curveCatmullRomClosed.alpha(1))
                    ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
                return path;
            });
};

export let updateLineChallengeImpact = () => {
    d3.selectAll(".impact-curve-path")
        .transition().duration(CONSTANTS.transitionDuration)
        .attr("d", d => {
            let path = d3.line()
                .x(i => d.challengesCY[i] * Math.cos(-1.58+angleRadiansChallengeScale(d.challenges[i], 0, 0, 0)) ?? 0)
                .y(i => d.challengesCY[i] * Math.sin(-1.58+angleRadiansChallengeScale(d.challenges[i], 0, 0, 0)) ?? 0)
                .curve(d3.curveCatmullRomClosed.alpha(1))
                ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            return path;
        });
};

export let hideLineChallengeImpact = () => {
    d3.selectAll(".impact-curve-path")
        .transition().duration(CONSTANTS.transitionDuration)
        .attr("d", () => {
            let path = d3.line()
                .x(0)
                .y(0)
                .curve(d3.curveCatmullRomClosed.alpha(1))
                ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            return path;
        });
    d3.selectAll(".area-impact")
        .attr("opacity", 0); // Hide area hover
};

export let generateAreaChallengeImpact = (gBubblePriority) => {
    let ggBubblePriority = gBubblePriority.append("g").classed("area", true);
    let gImpact = ggBubblePriority
        .selectAll("g.section-area-impact")
        .data(d => calculateData(d))
        .enter()
        .append("g")
            .classed("section-area-impact", true);
    ["Significant impact", "Moderate impact", "Minor impact", "No impact"].forEach(c => {
        let area = generateLine(gImpact, c).classed("area-impact", true);
        area  
            .attr("fill", "#ffffff")
            .attr("opacity", 0)  // Only for initializing so bar chart doesn't look cut off
            .on("mouseover", d => {
                let priority = d.srcElement.__data__.n;
                let impact = d.srcElement.__data__.category;
                // Color this in
                d3.selectAll(`.area-impact.impact-curve-path-${priority}-${impact.slice(0, -7).toLowerCase()}`)
                    .attr("opacity", 0.2)
                    .attr("fill", "#ec6143");
                // Make all the other ones white
                ["Significant impact", "Moderate impact", "Minor impact", "No impact"].forEach(i => {
                    if(i!=impact){
                        d3.selectAll(`.area-impact.impact-curve-path-${priority}-${i.slice(0, -7).toLowerCase()}`)
                            .attr("opacity", 1)
                            .attr("fill", "#ffffff");
                    }
                })
            })
            .on("mouseout", d => {
                let priority = d.srcElement.__data__.n;
                let impact = d.srcElement.__data__.category;
                d3.selectAll(`.area-impact.impact-curve-path-${priority}-${impact.slice(0, -7).toLowerCase()}`)
                    .transition().duration(CONSTANTS.hoverDuration)
                    .attr("opacity", 1)
                    .attr("fill", "#ffffff");
            });
    })
    return ggBubblePriority;
}

export let generateLineChallengeImpact = (gBubblePriority) => {
    let ggBubblePriority = gBubblePriority.append("g").classed("line", true)
        .attr("opacity", 0);  // Initialize as hidden;
    let gImpact = ggBubblePriority
        .selectAll("g.line-impact")
        .data(d => calculateData(d))
        .enter()
        .append("g")
            .classed("line-impact", true);
    let gImpactLine = gImpact
        .append("g")
        .classed("section-line-impact", true);
    ["No impact", "Minor impact", "Moderate impact"].forEach(c => {
        let gLine = generateLine(gImpactLine, c);
        gLine
            .classed("line-impact-curve", true)
            .style("stroke-width", 1)
            .style("stroke", "#000000"); 
    })
    return ggBubblePriority;
}
