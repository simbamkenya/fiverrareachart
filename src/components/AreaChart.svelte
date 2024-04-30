<script>
  import { onMount } from "svelte";
  import { csv } from "d3-fetch";
  import { scaleLinear, scaleTime, scaleLog } from "d3-scale";
  import { min, max, extent, bisector } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { axisLeft, axisBottom } from "d3-axis";
  import _ from "lodash";

  import TooltipLine from "./TooltipLine.svelte";
  import TooltipPoint from "./TooltipPoint.svelte";

  let data = [];
  let colors = [
    "#DDA0DD",
    "#B0C4DE",
    "#20B2AA",
    "#168AD0",
    "#F1683C",
    "#DBDC25",
    "#8FBC8B",
    "#D2B48C",
  ];

  onMount(async () => {
    let fetchedData = await csv("../../processed_weeks.csv", (data) => ({
      armsAndArmourQuantities: +data["ARMS & ARMOUR_quantities"],
      adventuringEquipmentQuantities: +data["ADVENTURING EQUIPMENT_quantities"],
      toolsAndKitsQuantities: +data["TOOLS & KITS_quantities"],
      positionsAndScrollsQuantities: +data["POTIONS & SCROLLS_quantities"],
      animalsAndTransportationQuantities:
        +data["ANIMALS & TRANSPORTATION_quantities"],
      jewelryQuantities: +data["JEWELRY_quantities"],
      summoningDeviceQuantities: +data["SUMMONING DEVICE_quantities"],
      musicalInstrumentQuantities: +data["MUSICAL INSTRUMENT_quantities"],
      startDate: new Date(data["Start_Date"]),
    }));
    data = [...fetchedData];
  });

  const points = [
    { x: 1979, y: 7.19 },
    { x: 1980, y: 7.83 },
    { x: 1981, y: 7.24 },
    { x: 1982, y: 7.44 },
    { x: 1983, y: 7.51 },
    { x: 1984, y: 7.1 },
    { x: 1985, y: 6.91 },
    { x: 1986, y: 7.53 },
    { x: 1987, y: 7.47 },
    { x: 1988, y: 7.48 },
    { x: 1989, y: 7.03 },
    { x: 1990, y: 6.23 },
    { x: 1991, y: 6.54 },
    { x: 1992, y: 7.54 },
    { x: 1993, y: 6.5 },
    { x: 1994, y: 7.18 },
    { x: 1995, y: 6.12 },
    { x: 1996, y: 7.87 },
    { x: 1997, y: 6.73 },
    { x: 1998, y: 6.55 },
    { x: 1999, y: 6.23 },
    { x: 2000, y: 6.31 },
    { x: 2001, y: 6.74 },
    { x: 2002, y: 5.95 },
    { x: 2003, y: 6.13 },
    { x: 2004, y: 6.04 },
    { x: 2005, y: 5.56 },
    { x: 2006, y: 5.91 },
    { x: 2007, y: 4.29 },
    { x: 2008, y: 4.72 },
    { x: 2009, y: 5.38 },
    { x: 2010, y: 4.92 },
    { x: 2011, y: 4.61 },
    { x: 2012, y: 3.62 },
    { x: 2013, y: 5.35 },
    { x: 2014, y: 5.28 },
    { x: 2015, y: 4.63 },
    { x: 2016, y: 4.72 },
    { x: 2017, y: 4.82 },
    { x: 2018, y: 4.79 },
    { x: 2019, y: 4.36 },
    { x: 2020, y: 4 },
    { x: 2021, y: 4.92 },
  ];

  let attributes = [
    "armsAndArmourQuantities",
    "adventuringEquipmentQuantities",
    "toolsAndKitsQuantities",
    "positionsAndScrollsQuantities",
    "animalsAndTransportationQuantities",
    "jewelryQuantities",
    "summoningDeviceQuantities",
    "musicalInstrumentQuantities",
  ];

  let ref1;
  let ref2;
  let active = false;
  let yValues = [];

  $: for (let i = 0; i < data.length; i++) {
    yValues = [...yValues, ...Object.values(_.pick(data[i], attributes))];
    yValues = yValues;
  }

  //$: console.log("y", yValues);
  let margin = { top: 25, right: 10, bottom: 75, left: 20 };

  $: xScale1 = scaleTime()
    .domain([min(data, (d) => d.startDate), max(data, (d) => d.startDate)])
    .range([margin.left, width - margin.right]);

  $: yScale1 = scaleLinear()
    .domain([0, max(data, (d) => d.armsAndArmourQuantities)])
    .range([height - margin.bottom, margin.top]);

  let xAxis;
  let yAxis;

  $: {
    select(yAxis).call(axisLeft(yScale1));
    select(xAxis)
      .call(axisBottom(xScale1))
      .selectAll(".tick > text")
      .attr("y", 0)
      .attr("dy", "0.35em")
      .attr("dx", "-1em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");
  }

  const yTicks = [0, 2, 4, 6, 8];
  const xTicks = [1980, 1990, 2000, 2010];

  const padding = { top: 20, right: 15, bottom: 20, left: 25 };

  let width = 800;
  let height = 400;

  $: xScale = scaleLinear()
    .domain([minX, maxX])
    .range([padding.left, width - padding.right]);

  $: yScale = scaleLinear()
    .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
    .range([height - padding.bottom, padding.top]);

  $: maxValue = max(data, (d) => d.startDate);
  $: minValue = min(data, (d) => d.startDate);

  $: path1 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.armsAndArmourQuantities)}`).join("L")}`;
  $: area1 = `${path1}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path2 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.adventuringEquipmentQuantities)}`).join("L")}`;
  $: area2 = `${path2}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path3 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.toolsAndKitsQuantities)}`).join("L")}`;
  $: area3 = `${path3}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path4 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.positionsAndScrollsQuantities)}`).join("L")}`;
  $: area4 = `${path4}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path5 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.animalsAndTransportationQuantities)}`).join("L")}`;
  $: area5 = `${path5}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path6 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.jewelryQuantities)}`).join("L")}`;
  $: area6 = `${path6}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path7 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.summoningDeviceQuantities)}`).join("L")}`;
  $: area7 = `${path7}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: path8 = `M${data.map((d) => `${xScale1(d.startDate)},${yScale1(d.musicalInstrumentQuantities)}`).join("L")}`;
  $: area8 = `${path8}L${xScale1(maxValue)},${yScale1(0)}L${xScale1(minValue)},${yScale1(0)}Z`;

  $: minX = points[0].x;
  $: maxX = points[points.length - 1].x;

  $: path = `M${points.map((p) => `${xScale(p.x)},${yScale(p.y)}`).join("L")}`;
  $: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

  function formatMobile(tick) {
    return "'" + tick.toString().slice(-2);
  }

  // d3's bisector function
  var bisect = bisector((d) => d.startDate).right;

  let m = { x: 0, y: 0 };
  let point = data[0];

  // $: console.log('pointoo', point)

  function handleMousemove(event) {
    m.x = event.offsetX;
    m.y = event.offsetY;

    // console.log('moving', xScale1.invert(m.x))
    // returns point to right of our current mouse position
    let i = bisect(data, xScale1.invert(m.x));
    // console.log('ii 3', i)

    if (i < data.length) {
      point = data[i]; // update point
    }
  }

  // coords for vertical tooltip line
  let vline = {};
  $: vline.y1 = 0;
  $: vline.y2 = height - margin.bottom;
  $: vline.x1 = xScale1(point?.startDate);
  $: vline.x2 = xScale1(point?.startDate);
</script>

<main>
  <h2>Arctic sea ice minimum</h2>
  {point?.musicalInstrumentQuantities}
  <div class="chart">
    <svg on:mousemove={handleMousemove} {width} {height}>
      <!-- {#each data as d, i}
        <path class="path-area" d={area1} />
        <path class="path-line" d={path1} />
      {/each} -->

      <path
        bind:this={ref1}
        on:mouseover={(e) => (ref1.style.opacity = "0.3")}
        on:focus={(e) => (e) => (ref1.style.opacity = "0.3")}
        on:mouseleave={(e) => (ref1.style.opacity = "1")}
        class="opacity path-area1"
        d={area1}
      />
      <path class="opacity line path-line1" d={path1} />

      <path
        bind:this={ref2}
        on:mouseover={(e) => (ref2.style.opacity = "0.4")}
        on:focus={(e) => (ref2.style.opacity = "0.4")}
        on:mouseleave={(e) => (ref2.style.opacity = "1")}
        class="opacity path-area2"
        d={area2}
      />
      <path class="line path-line2" d={path2} />

      <path class="path-area3" d={area3} />
      <path class="line path-line3" d={path3} />

      <path class="path-area4" d={area4} />
      <path class="line path-line4" d={path4} />

      <path class="path-area5" d={area5} />
      <path class="line path-line5" d={path5} />

      <path class="path-area6" d={area6} />
      <path class="line path-line6" d={path6} />

      <path class="path-area7" d={area7} />
      <path class="line path-line7" d={path7} />

      <path class="path-area8" d={area8} />
      <path class="line path-line8" d={path8} />

      <g transform="translate(0, {height - margin.bottom})" bind:this={xAxis} />

      <g transform="translate({margin.left}, 0)" bind:this={yAxis} />

      <TooltipPoint x={xScale1(point?.x)} y={yScale1(point?.y)} />
      <TooltipLine {vline} />
    </svg>
  </div>

  <!-- <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
    <svg>
    
      <g class="axis y-axis" transform="translate(0, {padding.top})">
        {#each yTicks as tick}
          <g
            class="tick tick-{tick}"
            transform="translate(0, {yScale(tick) - padding.bottom})"
          >
            <line x2="100%" />
            <text y="-4">{tick} {tick === 8 ? " million sq km" : ""}t</text>
          </g>
        {/each}
      </g>


      <g class="axis x-axis">
        {#each xTicks as tick}
          <g
            class="tick tick-{tick}"
            transform="translate({xScale(tick)},{height})"
          >
            <line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0" />
            <text y="-2">{width > 380 ? tick : formatMobile(tick)}</text>
          </g>
        {/each}
      </g>

      <path class="path-area" d={area} />
      <path class="path-line" d={path} />
    </svg>
  </div> -->
</main>

<style>
  .chart,
  h2,
  p {
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  svg {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: visible;
  }

  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .tick line {
    stroke: #888;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #888;
    text-anchor: start;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }

  .x-axis .tick text {
    text-anchor: middle;
  }

  .line {
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
    fill: none;
  }

  /* ['#DDA0DD', '#B0C4DE', '#20B2AA', '#168AD0', '#F1683C', '#DBDC25', '#8FBC8B', '#D2B48C'] */
  .path-line1 {
    stroke: rgb(221, 160, 221, 0.2);
  }
  .path-area1 {
    fill: rgb(221, 160, 221, 0.6);
  }
  #path-area1:hover {
    fill: rgb(221, 160, 221, 0.4);
  }

  .path-line2 {
    stroke: rgb(176, 196, 222);
  }
  .path-area2 {
    fill: rgb(176, 196, 222);
  }
  #path-area2:hover {
    fill: rgb(176, 196, 222, 0.4);
  }

  .path-line3 {
    /* stroke: rgb(32, 178, 170); */
    stroke: rgb(255, 199, 0);
  }
  .path-area3 {
    /* fill: rgb(32, 178, 170, 0.2); */
    fill: rgb(255, 199, 0, 0.2);
  }
  .path-area3:hover {
    fill: rgb(32, 178, 170, 0.4);
  }

  .path-line4 {
    stroke: rgb(22, 138, 208);
  }
  .path-area4 {
    fill: rgb(22, 138, 208, 0.02);
  }
  .path-area4:hover {
    fill: rgb(22, 138, 208, 0.2);
  }

  .path-line5 {
    stroke: rgb(241, 104, 60);
  }
  .path-area5 {
    fill: rgb(241, 104, 60, 0.02);
  }
  .path-area5:hover {
    fill: rgb(241, 104, 60, 0.4);
  }

  .path-line6 {
    stroke: rgb(22, 138, 208);
  }
  .path-area6 {
    fill: rgb(22, 138, 208, 0.02);
  }
  .path-area6:hover {
    fill: rgb(22, 138, 208, 0.4);
  }

  .path-line7 {
    stroke: rgb(79, 207, 67);
  }
  .path-area7 {
    fill: rgb(79, 207, 67, 0.02);
  }
  .path-area7:hover {
    fill: rgb(143, 188, 139, 0.4);
  }

  .path-line8 {
    stroke: rgb(192, 139, 92);
  }
  .path-area8 {
    fill: rgb(192, 139, 92, 0.4);
  }

  .path-area8:hover {
    fill: rgb(210, 180, 140, 0.4);
  }

  .opacity {
    opacity: 0.7;
  }
</style>
