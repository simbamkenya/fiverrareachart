<script>
  import { Chart, Tooltip, TooltipItem, Area, Axis, Point, Text, Highlight, Svg } from "layerchart";

  import { onMount } from "svelte";
  import { csv } from "d3-fetch";
  import { scaleLinear, scaleTime, scaleLog, scaleOrdinal,  } from "d3-scale";
  import { min, max, extent, bisector, group } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { axisLeft, axisBottom } from "d3-axis";
  import _ from "lodash";
  import { format as formatDate } from 'date-fns';

  import { format, Field, Switch, Toggle, PeriodType } from 'svelte-ux';

  export let formattedData;

  let dataByItem = group(formattedData, d => d.item)
  $: console.log('gro', dataByItem)
</script>


<div class="h-[300px] p-4 border rounded">
  <h1>Multine</h1>
    <Chart
      data={formattedData}
      x="date"
      xScale={scaleTime()}
      y="value"
      yDomain={[0, null]}
      yNice
      r="item"
      rScale={scaleOrdinal()}
      rDomain={Object.keys({})}
      rRange={Object.values({})}
      padding={{ left: 16, bottom: 24, right: 48 }}
      tooltip={{ mode: "voronoi" }}
      let:rScale
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          rule
        />
        {#each dataByItem as [fruit, data]}
          {@const color = rScale(fruit)}
          <Area
            {data}
            fill={color}
            fill-opacity={0.3}
            line={{ class: "stroke-2", stroke: color }}
          />
          <Point d={data[data.length - 1]} let:x let:y>
            <circle cx={x} cy={y} r={4} fill={color} />
            <Text
              {x}
              {y}
              value={fruit}
              verticalAnchor="middle"
              dx={6}
              dy={-2}
              class="text-xs"
              fill={color}
            />
          </Point>
        {/each}
        <Highlight points lines />
      </Svg>
      <Tooltip  let:data>
        <TooltipItem label={data.fruit} value={data.value} />
      </Tooltip>
    </Chart>
  </div>

  
<style>
</style>
