/**
 * @class VisualArrayClass
 * @constructor
 * define an array visualisation with SVG*/
function VisualArrayClass(data, id) {

   this.svgWidth = 910;
   this.svgHeight = 150;
   this.relativeY = this.svgHeight / 2;
   this.compareAnimationDuration = 600;
   this.changeAnimationDuration = 600;
   this.fillColor = '#33C3F0';
   this.selectFillColor = '#1EAEDB';
   this.globalScaleBoost = 20;

   this.defaultTextStylling = {
      'text-anchor': 'middle',
      'dy': this.relativeY+5,
      'font-size' : '18px',
      'fill' : '#fff',
      'stroke-width': '1px',
      'stroke': '#fff'
   };
   this.defaultCircleStylling ={
      //'cx':function(d,i){ return 30 + 60*i},
      'cy': this.relativeY,
      //'d' is lib variable from d3.js
      'r': function (d) {
         return 20 + d
      },
      'stroke-width': '1px',
      'stroke':this.selectFillColor,
      'fill': this.fillColor
   };

   //prepare svg block
   var svg = d3.select('#' + id).append('svg').attr({
      'width': this.svgWidth,
      'height': this.svgHeight
   });

   //prepare <g> groups
   this.container = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr({
         'transform': function (d, i) {
            return "translate(" + (30 + 60 * i) + ",0)"
         },
         'stroke': '#f3f3f3', 'stroke-width': '1px', 'fill': this.fillColor
      });

   //set circle attributes
   this.circle = this.container
      .append('circle')
      .attr(this.defaultCircleStylling);

   //set text attributes
   this.text = this.container
      .append('text')
      .attr(this.defaultTextStylling)
      .text(function (d) {
         return d
      });

   //set taken array like svg data
   this.data = data;

   //combine indexes
   this.index = (function () {
      var r = [];
      for (var i = 0; i < data.length; i++) {
         r[i] = i
      }
      return r;
   })();

   //animation event list
   this.event = [];
}

/*** @method doCompareAnimation*/
VisualArrayClass.prototype.doCompareAnimation = function (id1, id2) {
   var temp = this, count = 0;
   temp.circle.transition().duration(temp.compareAnimationDuration)
      .attr('fill', function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? temp.selectFillColor : temp.fillColor
      })
      .attr("r", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? temp.globalScaleBoost + d * 2 : temp.globalScaleBoost + d
      })
      .attr("cy", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? 50 : temp.relativeY
      })
      .each('end', function () {
         if (!count) {
            count += 1;
            temp.event.shift();
            if (temp.event.length) {

               if (temp.event[0].event == 'doCompareAnimation') {
                  temp.doCompareAnimation(temp.event[0].id1, temp.event[0].id2)
               }
               if (temp.event[0].event == 'doSwapAnimation') {
                  temp.doSwapAnimation(temp.event[0].id1, temp.event[0].id2)
               }
               if (temp.event[0].event == 'finish') {
                  temp.setDefaultStyleAttributes();
               }
            }
         }
      });
   temp.text.transition().duration(temp.compareAnimationDuration)
      .attr("dy", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? 50+7 : 75+5
      })
      .attr("fill", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? '#36434A' : '#fff'
      })
      .attr("stroke", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? '#36434A' : '#fff'
      })
      .attr("font-size", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? '28px' : '18px'
      })
      };

   /** @method  setDefaultStyleAttributes*/
   VisualArrayClass.prototype.setDefaultStyleAttributes = function () {
      this.circle.transition().duration(this.compareAnimationDuration)
         .attr(this.defaultCircleStylling);
      this.text.transition().duration(this.compareAnimationDuration)
         .attr(this.defaultTextStylling);
   };

   /** @method doSwapAnimation*/
   VisualArrayClass.prototype.doSwapAnimation = function (id1, id2) {
      var temp = this, count = 0;
      //XOR swap analog
      this.index[id1] = this.index[id1] ^ this.index[id2];
      this.index[id2] = this.index[id1] ^ this.index[id2];
      this.index[id1] = this.index[id1] ^ this.index[id2];
      this.container = this.container.data(this.data);
      this.circle = this.circle.data(this.data);
      this.text = this.text.data(this.data);
      this.container.transition()
         .duration(temp.changeAnimationDuration).attr({
         'transform': function (d, i) {
            return "translate(" + (30 + 60 * temp.index.indexOf(i)) + ",0)"
         }
      }).each('end', function () {
         if (!count) {
            count += 1;
            temp.event.shift();
            if (temp.event.length) {
               if (temp.event[0].event == 'doCompareAnimation'){
                  temp.doCompareAnimation(temp.event[0].id1, temp.event[0].id2);
               }
               if (temp.event[0].event == 'doSwapAnimation'){
                  temp.doSwapAnimation(temp.event[0].id1, temp.event[0].id2);
               }
               if (temp.event[0].event == 'finish'){
                  temp.setDefaultStyleAttributes()
               }

            }
         }
      })
   };

   /** @method  bubbleSort*/
   VisualArrayClass.prototype.BubbleSort = function () {
      var data = this.data.slice(0);
      for (var i = data.length - 1, flag; i > 0; i--) {
         flag = true;
         for (var j = 0; j < i; j++) {
            this.event.push({event: 'doCompareAnimation', id1: j, id2: j + 1});
            if (data[j] > data[j + 1]) {
               flag = false;
               var temp = data[j];
               data[j] = data[j + 1];
               data[j + 1] = temp;
               this.event.push({event: 'doSwapAnimation', id1: j, id2: j + 1})
            }
         }
         if (flag) {
            break;
         }
      }
      this.event.push({event: 'finish'});
      if (this.event.length) {
         this.doCompareAnimation(this.event[0].id1, this.event[0].id2);
      }
   };

   /** @function  generateRandomShuffledArray*/
   function generateRandomShuffledArray(outputId, min, max) {
      if (max != 0) {
         var totalNumbers = max - min + 1,
            arrayTotalNumbers = [],
            arrayRandomNumbers = [],
            tempRandomNumber;

         while (totalNumbers--) {
            arrayTotalNumbers.push(totalNumbers + min);
         }

         while (arrayTotalNumbers.length) {
            tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
            arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
            arrayTotalNumbers.splice(tempRandomNumber, 1);
         }
         $(outputId).append("<p>Your randomly generated array is: x = [ " + arrayRandomNumbers + " ]</p>");

         return arrayRandomNumbers;
      }
      else {
         showErrorMessage(outputId, "Oops! Did you remember to set an array length ?");
         return false;
      }
   }


   /** @function showErrorMessage*/
   function showErrorMessage(outputId, message) {
      $(outputId).html("<p class='error-msg'>" + message + "</p>");
      $('input').val("");
   }


   /*region $().ready*/
   $().ready(function () {
      var vm = this;
      this.List = null;

      $('#formation').click(function () {
         clearSortInfo();
         $('#start').attr("disabled", false);
         vm.List = new VisualArrayClass(generateRandomShuffledArray('.output', 1, $('#arrayLength-7').val()), 'bubble');
      });

      $('#start').bind("click", function () {
         try {
            vm.List.BubbleSort();
            $('#start').attr("disabled", true);
         }
         catch (err) {
               showErrorMessage('.output', "Oops! You forgot construct array!");
         }
      });

      $('.clear').click(function () {
         clearSortInfo()
      });

      /** @function clearSortInfo*/
      function clearSortInfo() {
         $('.error-msg').remove();
         $('.output').empty();
         d3.select("svg").remove();
         vm.List = {};
      }

   });
/*endregion*/



