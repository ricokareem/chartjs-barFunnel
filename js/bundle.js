(function (chart_js) {
  'use strict';

  const barFunnelChart = {
    id: "barFunnelChart",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, left, bottom, right, width, height },
        scales: { x, y },
      } = chart;

      ctx.save();

      for (let i = 0; i < chart.getDatasetMeta(0).data.length; i++) {
        const label = chart.getDatasetMeta(0).data[i].$context.raw;
        const font = '16px "Helvetica Neue", Helvetica, Arial, sans-serif';

        if (chart.getDatasetMeta(0).data[i].$context.raw) {
          // Draw Step Label (the numbers on the right side of the chart)
          // Since there is no padding concept, use a rect that contains text in order to get the padding effect

          // Start with creating a background rect assuming height of font to hold the label
          // and make sure the rect extends beyond the width of longest text value
          const RECT_WIDTH = 100;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            right - RECT_WIDTH,
            chart.getDatasetMeta(0).data[i].y - 6,
            RECT_WIDTH,
            20
          );

          // Add text label => (the value of the data point)
          ctx.font = font;
          ctx.fillStyle = "#4B5662";
          ctx.textAlign = "right";
          ctx.fillText(
            label.toFixed(0),
            right - RECT_WIDTH / 2,
            chart.getDatasetMeta(0).data[i].y
          );
        }

        // Draw a polygon for region to simulate a funnel
        ctx.beginPath();
        ctx.fillStyle = "rgba(181, 219, 214, 1)";
        ctx.strokeStyle = "#E3E8ED";

        ctx.moveTo(
          chart.getDatasetMeta(0).data[i].base,
          chart.getDatasetMeta(0).data[i].y +
            chart.getDatasetMeta(0).data[i].height / 2
        );
        ctx.lineTo(
          chart.getDatasetMeta(0).data[i].x,
          chart.getDatasetMeta(0).data[i].y +
            chart.getDatasetMeta(0).data[i].height / 2
        );
        if (chart.getDatasetMeta(0).data[i + 1]) {
          ctx.lineTo(
            chart.getDatasetMeta(0).data[i + 1].x,
            chart.getDatasetMeta(0).data[i + 1].y -
              chart.getDatasetMeta(0).data[i + 1].height / 2
          );
          ctx.lineTo(
            chart.getDatasetMeta(0).data[i + 1].base,
            chart.getDatasetMeta(0).data[i + 1].y -
              chart.getDatasetMeta(0).data[i + 1].height / 2
          );
        }
        ctx.closePath();

        ctx.stroke();
        ctx.fill();

        // Hide chart legend
        chart.legend.options.display = false;
      }
    },
  };

  const barChartData = {
    labels: ["Invited", "Accepted", "Sell Intents"],
    datasets: [
      {
        backgroundColor: "rgba(54, 162, 150, 1)",
        borderWidth: 0,
        data: [102, 40, 13],
        barPercentage: 0.25,
        barThickness: 11,
      },
    ],
  };

  window.onload = function () {
    const ctx = document.getElementById("canvas").getContext("2d");
    window.myBar = new chart_js.Chart(ctx, {
      type: "bar",
      data: barChartData,
      options: {
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each bar to be 2px wide and green
        elements: {
          bar: {
            borderSkipped: "left",
          },
        },
        indexAxis: "y",
        region: {
          display: true,
        },
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            max: 180,
            ticks: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              drawBorder: false,
              drawTicks: false,
              lineWidth: 11,
              offset: false,
            },
            paddingTop: 0,
            ticks: {
              color: "rgba(171, 181, 196, 1)",
              font: { size: "16px", weight: "bold" },
              mirror: true,
              padding: 100,
            },
          },
        },
        title: {
          display: false,
        },
      },
      plugins: [barFunnelChart],
    });
  };

})(Chart);
