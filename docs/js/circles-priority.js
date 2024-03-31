import { CONSTANTS } from "./constants.js";
import { rBubbleScale, fontBubbleScale, fontBubbleScaleBottom } from "./scales.js";


let generatePriorityGroup = (data, svg) => {
    let gPriority = svg
        .append("g")
            .attr("id", "priority")
            .attr("transform", `translate(${CONSTANTS.svgWidth/2},${CONSTANTS.svgHeight/2})`);

    let gBubblePriority = gPriority
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
            .classed("g-bubble-priority", true)
            .attr("id", d => `priority-${d.id}`)
            .attr("transform", d => CONSTANTS.priorityPositions[d.id]);

    return gBubblePriority;
}

let generateCircle = (gBubblePriority) => {
    let bubblePriority = gBubblePriority
        .append("circle")
            .classed("bubble-priority", true)
            .attr("r", d => rBubbleScale(d.n));
    return bubblePriority;
}

let generateText = (gBubblePriority) => {
    let gText = gBubblePriority
        .append("g")
            .classed("g-text-priority", true);

    let gBubblePriorityTextPath = gText
        .append("path")
            .classed("text-priority-path", true)
            .classed("hidden", true)
            .attr("d", d => `M${-rBubbleScale(d.n) - 5.2} 0 A${rBubbleScale(d.n) + 5.2} ${rBubbleScale(d.n) + 5.2}, 0, 1, 1, ${rBubbleScale(d.n) + 5.2} 0`)
            .attr("id", d => `text-priority-${d.id}`);

    let gBubblePriorityText = gText
        .append("text")
            .classed("text-priority", true)
            .append("textPath")
                .attr("xlink:href", d => `#text-priority-${d.id}`)
                .attr("startOffset", "35%")
                .text(d => d.priorityShort);

    return gBubblePriorityText;
}

let generateTextInner = (gBubblePriority) => {
    let gText = gBubblePriority.append("g").classed("respondents", true);
    gText
        .append("text")
            .text(d => d.n)
            .classed("respondents-number", true)
            .attr("y", 0)
            .style("font-size", d => fontBubbleScale(d.n))
            ;
    gText.append("text")
        .text("Respondents")
            .classed("respondents-text", true)
            .attr("y", d => fontBubbleScaleBottom(d.n) > 15 ? 18 : 10)
            .style("font-size", d => fontBubbleScaleBottom(d.n))
    return gText;
}

export let generateCirclePriority = (data, svg) => {

    let gBubblePriority = generatePriorityGroup(data, svg)
    let bubblePriority = generateCircle(gBubblePriority);
    let gBubblePriorityText = generateText(gBubblePriority);
    let gBubblePriorityTextInner = generateTextInner(gBubblePriority);

    return gBubblePriority;
}
