<script>
 import AreaChart from "./components/AreaChart.svelte";
 import TailwindCss from "./components/TailwindCSS.svelte";
</script>

<main>
  <AreaChart />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
