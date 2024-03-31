import * as d3 from "../../_npm/d3@7.9.0/+esm.js";
import { CONSTANTS } from "./constants.3f1b9e34.js";
import { updateBarChallenge, hideBarChallenge } from "./bars-challenge.984735f2.js";
import { updateCircleChallengeImpact, hideCircleChallengeImpact } from "./circles-challenge-impact.b29df484.js";
import { updateLineChallengeImpact, hideLineChallengeImpact } from "./lines-challenge-impact.ff84ba2f.js";

export let generateStepper = () => {
    var stepState = 0;
    var oldStepState;

    let switchAnnotation = (newStepId) => {
        d3.selectAll(".annotation-step")
            .transition().duration(CONSTANTS.transitionDuration)
            .style("opacity", 0.0);
        d3.selectAll(".legend-step")
            .transition().duration(CONSTANTS.transitionDuration)
            .style("opacity", 0.0);

        d3.select(`#annotation-step-${newStepId}`)
            .transition().duration(CONSTANTS.transitionDuration)
            .style("opacity", 1);
        d3.select(`#legend-step-${newStepId}`)
            .transition().duration(CONSTANTS.transitionDuration)
            .style("opacity", 1);
        
        if(newStepId === 0) {
            d3.select("#step-back")
                .transition().duration(CONSTANTS.transitionDuration)
                .style("opacity", 0);
        }
        if(newStepId > 0) {
            d3.select("#step-back")
                .transition().duration(CONSTANTS.transitionDuration)
                .style("opacity", 1);
        }
        if(newStepId === 3) {
            document.getElementById("step-next").innerHTML = "Start Over";
        }
        if(newStepId < 3) {
            document.getElementById("step-next").innerHTML = "Next"
        }
    }

    let switchStep = (oldStepId, newStepId) => {
        // Hide
        if(oldStepId==0){
            d3.selectAll(".respondents")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 0);
        }
        if(oldStepId==1){
            d3.selectAll(".bar")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 0);
            hideBarChallenge();
            d3.selectAll(".bar")
                .transition().delay(CONSTANTS.transitionDuration)
                .style("display", "none");
        }
        if(oldStepId==2){
            d3.selectAll(".axis, .line, .circle")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 0);
            hideCircleChallengeImpact();
            hideLineChallengeImpact();
        }
        if(oldStepId==3){
            d3.selectAll(".word-cloud")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 0);
            d3.selectAll(".word-cloud")
                .transition().delay(CONSTANTS.transitionDuration)
                .style("display", "none");
        }
        // Reveal
        if(newStepId==0){
            d3.selectAll(".respondents")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 1);
        }
        if(newStepId==1){
            d3.selectAll(".bar")
                .style("display", "block")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 1);
            updateBarChallenge();
        }
        if(newStepId==2){
            d3.selectAll(".axis, .line, .circle")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 1);
            updateCircleChallengeImpact();
            updateLineChallengeImpact();
        }
        if(newStepId==3){
            d3.selectAll(".word-cloud")
                .style("display", "block")
                .transition().duration(CONSTANTS.transitionDuration)
                .attr("opacity", 1);
        }
    }

    d3.selectAll("div#step-next")
        .on("click", () => {
            oldStepState = stepState;
            stepState++
            if(stepState > 3){
                stepState = 0;  // Start Over
            }
            switchAnnotation(stepState);
            switchStep(oldStepState, stepState);
        });
    d3.selectAll("div#step-back")
        .on("click", () => {
            oldStepState = stepState;
            stepState--
            if(stepState < 0){
                stepState = 0;  // Start Over
                return
            }
            switchAnnotation(stepState);
            switchStep(oldStepState, stepState);
        });
}