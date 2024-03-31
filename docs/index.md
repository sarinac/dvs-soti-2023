---
title: Sarina Soti 2023
toc: false
style: custom.css
---

```js
import { FileAttachment } from "npm:@observablehq/stdlib";

```

<div class="hero">
  <h1>Data Visualization Challenges and Inspiration</h1>
  <p>The Data Visualization Society launched their annual <a href="https://www.datavisualizationsociety.org/soti-challenge-2023">State of the Industry survey</a> for 2023. One section of the survey asked people about their challenges faced during their data visualization practices and how much it affected their work. The following section asked people on how they look ahead by understanding where they want to improve next and where they find inspiration.</p>
  <p>Explore the different stages of the respondents' data visualization journeys. The interactive chart below will walk you through the respondents' next area of focus, then the common challenges experienced so far, and finally the recommended resources they provided to help others similar to them in the community.
  </p>
</div>

<div class="main-section">
  <div class="text-description-container">
    <div id="stepper-container">
      <div class="text-description annotation-step" id="annotation-step-0">
                <h1>What Is The Distribution of Priorities For Respondents?</h1>
                <p>
                    Each bubble represents a unique area of focus that the respondent wants to pursue next. The size is based on the number of respondents.
                </p>
                <p>
                    Within each bubble, there will be data for each of the 14 challenges asked in the survey. Each challenge is positioned radially and takes up a slice in their bubble. Click "Next" to proceed.
                </p>
      </div>
      <div class="text-description annotation-step" id="annotation-step-1">
                <h1>How Much Does Each Challenge Affect Respondents In Their Data Visualization Work?</h1>
                <p>
                    Each bar with a corresponding color within a bubble represents a challenge. The height of each bar is based on their relative impact score. The larger the bar, the more affected the respondents are by that challenge.
                </p>
      </div>
      <div class="text-description annotation-step" id="annotation-step-2">
                <h1>What % Of Respondents Are Affected By Each Level Of Impact Of Challenges?</h1>
                <p>
                    Sometimes understanding relative impact as a single number does not provide enough detail. Some respondents could be completely unaffected while others could be on the oppositie spectrum, entirely bogged down by it. This is the disitribution of each challenges' level of impact. You can see the percentage of respondents for each level.
                </p>
        </div>
        <div class="text-description annotation-step" id="annotation-step-3">
                <h1>Who Or What Do Respondents Recommend To Get Inspiration?</h1>
                <p>
                    Lhjkh
                </p>
        </div>
    </div>
    <div class="legend-container">
        <img id="legend-step-0" class="legend-step" src="img/legend-base.svg" alt="Legend for Priority and Challenges" />
        <img id="legend-step-1" class="legend-step" src="img/legend-variable-1.svg" alt="Legend for (1) Challenges" />
        <img id="legend-step-2" class="legend-step" src="img/legend-variable-2.svg" alt="Legend for (2) Challenge Distributions" />
        <img id="legend-step-3" class="legend-step" src="img/legend-variable-3.svg" alt="Legend for (3) Recommendations" />
    </div>
    <div id="stepper-nav">
            <div id="step-back" class="step-button">Back</div>
            <div id="step-next" class="step-button">Next</div>
    </div>
  </div>
  <div id="chart"></div>
</div>
<div class="footer">
  <div>Created by <a href="https://ifcolorful.com/">Sarina Chen</a>.</div>
</div>


```js
import * as d3 from "npm:d3";
import { CONSTANTS } from "./js/constants.js";
import { generateCirclePriority } from "./js/circles-priority.js";
import { generateAxisChallenges, generateBarChallenges, updateBarChallenge } from "./js/bars-challenge.js";
import { generateAreaChallengeImpact, generateLineChallengeImpact } from "./js/lines-challenge-impact.js";
import { generateCircleChallengeImpact } from "./js/circles-challenge-impact.js";
import { generateWordClouds } from "./js/word-cloud.js";
import { generateStepper } from "./js/stepper.js";
```

```js

let svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", CONSTANTS.svgWidth)
    .attr("height", CONSTANTS.svgHeight);

FileAttachment("./data/data.json").json().then((data) => {

    console.log(data);

    let gBubblePriority = generateCirclePriority(data, svg);

    let barChallenge = generateBarChallenges(gBubblePriority);

    let areaChallenge = generateAreaChallengeImpact(gBubblePriority);
    let axisChallenge = generateAxisChallenges(gBubblePriority)
    let lineChallenge = generateLineChallengeImpact(gBubblePriority);
    let circleChallenge = generateCircleChallengeImpact(gBubblePriority);

    let gWordCloud = generateWordClouds(gBubblePriority);

    generateStepper();

    let tooltip = svg
      .append("div")
        .classed("tooltip", true)
        .classed("hidden", true);

});
```