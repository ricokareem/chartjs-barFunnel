import { Chart, BarController } from "chart.js";

// class BarFunnel extends BarController {
//   updateElement(bar, index, reset, numBars) {
//     var meta = this.getMeta();
//     var xScale = this.getScaleForId(meta.xAxisID);
//     var yScale = this.getScaleForId(meta.yAxisID);

//     var yScalePoint;

//     if (yScale.min < 0 && yScale.max < 0) {
//       // all less than 0. use the top
//       yScalePoint = yScale.getPixelForValue(yScale.max);
//     } else if (yScale.min > 0 && yScale.max > 0) {
//       yScalePoint = yScale.getPixelForValue(yScale.min);
//     } else {
//       yScalePoint = yScale.getPixelForValue(0);
//     }

//     var chartOptions = this.chart.options;
//     var barElementOptions = this.chart.options.elements.bar;
//     var custom = bar.custom || {};
//     var dataset = this.getDataset();
//     var ruler = this._getRuler(this.index);
//     var helpers = Chart.helpers;

//     Object.assign(bar, {
//       // Utility
//       _chart: this.chart,
//       _xScale: xScale,
//       _yScale: yScale,
//       _datasetIndex: this.index,
//       _index: index,

//       // Desired view properties
//       _model: {
//         //   x: this.calculateBarX(index, this.index, ruler),
//         x: this._calculateBarValuePixels(index).head,
//         // y: reset ? yScalePoint : this.calculateBarY(index, this.index),
//         y: reset ? yScalePoint : this._calculateBarIndexPixels(index).base,

//         // Tooltip
//         label: this.chart.data.labels[index],
//         datasetLabel: dataset.label,

//         // Appearance
//         // base: reset ? yScalePoint : this.calculateBarBase(this.index, index),
//         base: reset ? yScalePoint : this._calculateBarValuePixels(index).base,
//         // width: this.calculateBarWidth(ruler),
//         // width: ruler.barSize,
//         // width: ruler.scale.width,
//         backgroundColor: custom.backgroundColor
//           ? custom.backgroundColor
//           : helpers.resolve(
//               dataset.backgroundColor,
//               this.chart.ctx,
//               index,
//               barElementOptions.backgroundColor
//             ),
//         borderSkipped: custom.borderSkipped
//           ? custom.borderSkipped
//           : barElementOptions.borderSkipped,
//         borderColor: custom.borderColor
//           ? custom.borderColor
//           : helpers.resolve(
//               dataset.borderColor,
//               this.chart.ctx,
//               index,
//               barElementOptions.borderColor
//             ),
//         // borderWidth: custom.borderWidth
//         //   ? custom.borderWidth
//         //   : helpers.resolve(
//         //       dataset.borderWidth,
//         //       this.chart.ctx,
//         //       index,
//         //       barElementOptions.borderWidth
//         //     ),
//         // stepLabelColor: barElementOptions.stepLabel.color
//         //   ? barElementOptions.stepLabel.color
//         //   : helpers.resolve(
//         //       dataset.borderColor,
//         //       this.chart.ctx,
//         //       index,
//         //       barElementOptions.borderColor
//         //     ),
//         // stepLabelFontSize: barElementOptions.stepLabel.fontSize
//         //   ? barElementOptions.stepLabel.fontSize
//         //   : chartOptions.defaultFontSize,
//       },

//       draw: () => {
//         var ctx = this.chart.ctx;
//         // var vm = this._view;
//         var vm = {
//           x: this._calculateBarValuePixels(this.index, ruler).head,
//           y: this._calculateBarIndexPixels(this.index, ruler).base,
//           base: this._calculateBarValuePixels(this.index, ruler).base,
//           width: ruler.scale.width,
//           borderWidth: 2,
//           borderColor: "0B84A5",
//           borderSkipped: "bottom",
//           stepLabel: {
//             display: true,
//             fontSize: 20,
//             //   color: "red",
//           },
//         };
//         var options = this.chart.config.options;

//         var halfWidth = vm.width / 2,
//           leftX = vm.x - halfWidth,
//           rightX = vm.x + halfWidth,
//           top = vm.base - (vm.base - vm.y),
//           halfStroke = vm.borderWidth / 2;

//         // Canvas doesn't allow us to stroke inside the width so we can
//         // adjust the sizes to fit if we're setting a stroke on the line
//         if (vm.borderWidth) {
//           leftX += halfStroke;
//           rightX -= halfStroke;
//           top += halfStroke;
//         }

//         ctx.beginPath();
//         ctx.fillStyle = vm.backgroundColor;
//         ctx.strokeStyle = vm.borderColor;
//         ctx.lineWidth = vm.borderWidth;

//         // Corner points, from bottom-left to bottom-right clockwise
//         // | 1 2 |
//         // | 0 3 |
//         var corners = [
//           [leftX, vm.base],
//           [leftX, top],
//           [rightX, top],
//           [rightX, vm.base],
//         ];

//         // Find first (starting) corner with fallback to 'bottom'
//         var borders = ["bottom", "left", "top", "right"];
//         var startCorner = borders.indexOf(vm.borderSkipped, 0);
//         if (startCorner === -1) startCorner = 0;

//         function cornerAt(index) {
//           return corners[(startCorner + index) % 4];
//         }

//         // Draw rectangle from 'startCorner'
//         ctx.moveTo.apply(ctx, cornerAt(0));
//         for (var i = 1; i < 4; i++) ctx.lineTo.apply(ctx, cornerAt(i));

//         ctx.fill();
//         if (vm.borderWidth) {
//           ctx.stroke();
//         }

//         if (barElementOptions.stepLabel.display && index != 0) {
//           var label = (dataset.data[index] / dataset.data[0]) * 100;

//           if (dataset.data[index] > 0) {
//             // Draw Step Label
//             ctx.font = vm.stepLabelFontSize + "px " + options.defaultFontFamily;
//             ctx.fillStyle = vm.stepLabelColor;
//             ctx.textAlign = "center";
//             ctx.fillText(
//               label.toFixed(0) + "%",
//               vm.x,
//               vm.y - vm.stepLabelFontSize
//             );
//           }
//         }

//         if (chartOptions.region.display && index < meta.data.length - 1) {
//           //   var nextVm = meta.data[index + 1]._view;
//           var nextVm = meta.data[index + 1];
//           nextVm.x = this._calculateBarValuePixels(index + 1, ruler).head;
//           nextVm.y = this._calculateBarIndexPixels(index + 1, ruler).base;
//           nextVm.base = this._calculateBarValuePixels(index + 1, ruler).base;
//           nextVm.width = ruler.scale.width;
//           nextVm.borderWidth = 2;
//           nextVm.borderColor = "0B84A5";
//           nextVm.borderSkipped = "bottom";
//           nextVm.stepLabel = {
//             display: true,
//             fontSize: 20,
//             //   color: "red",
//           };

//           var regionCorners = [
//             [vm.x + halfWidth, top],
//             [nextVm.x - halfWidth, nextVm.base - (nextVm.base - nextVm.y - 1)],
//             [nextVm.x - halfWidth, nextVm.base],
//             [vm.x + halfWidth, vm.base],
//           ];

//           ctx.beginPath();
//           ctx.strokeStyle = chartOptions.region.borderColor;
//           ctx.moveTo.apply(ctx, regionCorners[0]);
//           ctx.lineTo.apply(ctx, regionCorners[1]);
//           ctx.stroke();

//           ctx.beginPath();
//           ctx.strokeStyle = "transparent";
//           ctx.fillStyle = chartOptions.region.backgroundColor;
//           ctx.moveTo.apply(ctx, regionCorners[1]);
//           ctx.lineTo.apply(ctx, regionCorners[2]);
//           ctx.lineTo.apply(ctx, regionCorners[3]);
//           ctx.lineTo.apply(ctx, regionCorners[0]);
//           ctx.fill();
//           ctx.stroke();
//         }
//       },
//     });
//     // rectangle.pivot();
//   }
// }

// BarFunnel.id = "barFunnel";
// // BarFunnel.defaults.barFunnel = {
// BarFunnel.defaults = {
//   hover: {
//     mode: "label",
//   },

//   region: {
//     display: true,
//     borderColor: "#F6C85F",
//     backgroundColor: "rgba(246, 200, 95, 0.2)",
//   },

//   elements: {
//     bar: {
//       stepLabel: {
//         display: true,
//         fontSize: 20,
//         // color: "red"
//       },
//     },
//   },

//   indexAxis: "y",

//   scales: {
//     xAxes: [
//       {
//         type: "category",

//         // Specific to Bar Controller
//         categoryPercentage: 0.8,
//         barPercentage: 0.7,

//         // grid line settings
//         gridLines: {
//           offsetGridLines: true,
//         },
//       },
//     ],
//     yAxes: [
//       {
//         type: "linear",
//       },
//     ],
//   },
// };

// Chart.register(BarFunnel);

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

    for (let i = 0; i < chart.getDatasetMeta(0).data.length - 1; i++) {
      const label = chart.getDatasetMeta(0).data[i].$context.raw;

      if (chart.getDatasetMeta(0).data[i].$context.raw) {
        // Draw Step Label
        // ctx.font = 20 + "px " + chart.options.defaultFontFamily;
        ctx.font = 20 + "px ";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(
          label.toFixed(0),
          right,
          chart.getDatasetMeta(0).data[i].y
        );
      }

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
      ctx.closePath();

      ctx.stroke();
      ctx.fill();
    }
  },
};

const barChartData = {
  labels: ["Invited", "Accepted", "Sell Intents"],
  datasets: [
    {
      backgroundColor: "rgba(54, 162, 150, 1)",
      borderWidth: 0,
      data: [52, 40, 13],
      barPercentage: 0.25,
      barThickness: 11,
      plugins: {
        legend: { display: false },
      },
    },
  ],
};

window.onload = function () {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: {
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each bar to be 2px wide and green
      elements: {
        bar: {
          borderSkipped: "left",
          // stepLabel: {
          //   display: true,
          //   fontSize: 80,
          //   color: "green",
          // },
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
          ticks: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            borderWidth: 0,
            display: true,
            lineWidth: 11,
            offset: false,
          },
          // stepLabel: {
          //   display: true,
          //   fontSize: 80,
          //   color: "green",
          // },
          tickWidth: 0,
        },
      },
      title: {
        display: false,
      },
    },
    plugins: [barFunnelChart],
  });
};
