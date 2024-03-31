import * as d3 from "../../_npm/d3@7.9.0/+esm.js";
import { CONSTANTS } from "./constants.3f1b9e34.js";
import { rBubbleScale } from "./scales.f9ad98ee.js";
import {require} from "../../_npm/d3-require@1.3.0/+esm.js";
const cloud = await require("d3-cloud");

let generateWordsList = (data) => {
    let dedupeWords = {};
    data.forEach(record => { // TODO: filter d.data
        if(record.words.length>0){
            dedupeWords[record.id] = record.words;
        }
    });  
    let wordsList = [];
    Object.keys(dedupeWords).forEach(key => {
        wordsList = wordsList.concat(dedupeWords[key]);
    });     
    wordsList = d3.flatRollup(
        wordsList,
        v => v.length,
        d => d
    ).map(word => {return {"word": word[0], "size": word[1], "n": data[0].n}});
    wordsList = wordsList.sort((a, b) => d3.descending(a.size, b.size));
    wordsList = wordsList.slice(0, 10); // Top 10 words
    for(let i=0; i < Math.min(wordsList.length, 10); i++){
        wordsList[i]["rankSize"] = 10-i;  // Assign a ranking for size
    };
    return wordsList;
}

let drawFn = (selection) => {
    let draw = (words) => {
        selection
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
                .classed("word-cloud", true)
                .style("font-size", d => d.size)
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .text(d => d.word)
                .style("display", "none");  // Initialize as hidden
  }
  return draw
}

export let generateWordClouds = (gBubblePriority) => {
    let gWordCloud = gBubblePriority.append("g")
        .attr("class", d => `word-cloud word-cloud-${d.id}`)
        .attr("opacity", 0);  // Initialize as hidden
    Object.keys(CONSTANTS.priorityPositions).forEach(priority => {
        let selection = d3.select(`.word-cloud-${priority}`);
        let selectionData = selection.data()[0];
        let draw = drawFn(selection);
        let layout = cloud()
            .size([1.41*rBubbleScale(selectionData.n), 1.41*rBubbleScale(selectionData.n)])
            .words(generateWordsList(selectionData.data).map(d => { return {word: d.word, size: d.size, n: d.n, rankSize: d.rankSize}; }))  // Todo, turn rank into size, scale size based on radius and minimum font size
            .padding(5)
            .rotate(0)
            .spiral("archimedean")
            .fontSize(d => {
                let size = d3.scaleLinear()
                    .domain([1, 10])
                    .range([rBubbleScale(d.n) < 80 ? 8 : 10, rBubbleScale(d.n) < 80 ? 13 : 20])
                    (d.rankSize);
                return size;
            })
            .on("end", draw);

        layout.start();
    });
    return gWordCloud;
};

// This was very hacky...
// TODO mask: https://github.com/a10k/d3-cloud?tab=readme-ov-file#mask
