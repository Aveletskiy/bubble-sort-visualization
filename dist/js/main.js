//Class VizualArray
var VizualArray = function (data, id) {
   //prepare svg block size for vizualize
   var svg = d3.select('#' + id).append('svg').attr({
      'width': 910,
      'height': 300
   });
   //push element on it
   this.container = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr({
         'transform': function (d, i) {
            return "translate(" + (30 + 60 * i) + ",0)"
         },
         'stroke': '#000', 'stroke-width': '1px', 'fill': '#f3f3f3'
      });
   //attribute circle
   this.circle = this.container
      .append('circle')
      .attr({
         //'cx':function(d,i){ return 30 + 60*i},
         'cy': 100,
         'r': function (d, i) {
            return 20 + d
         },
         'stroke-width': '2px'
      });
   //attribute
   this.text = this.container
      .append('text')
      .attr({
         'dx': function (d, i) {
            return d >= 10 ? -8 : -4;
         },
         'dy': 100
      })
      .text(function (d) {
         return d
      });
   //attribute data
   this.data = data;
   //attribute index
   this.index = (function () {
      var r = [];
      for (var i = 0; i < data.length; i++) {
         r[i] = i
      }
      return r;
   })();
   //attribute index
   this.event = [];
};

//Method compare
VizualArray.prototype.compare = function (id1, id2) {
   var temp = this, count = 0;
   this.circle.transition().duration(700)
      .attr('fill', function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? '#abc' : '#f3f3f3'
      })
      .attr("r", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? 20 + d * 2 : 20 + d
      })//'cy':100,
      .attr("cy", function (d, i) {
         return (i == temp.index[id1] || i == temp.index[id2]) ? 90 : 100
      })
      .each('end', function () {
         if (!count) {
            count += 1;
            temp.event.shift();
            if (temp.event.length) {
               if (temp.event[0].event == 'compare') {
                  temp.compare(temp.event[0].id1, temp.event[0].id2)
               } else {
                  temp.change(temp.event[0].id1, temp.event[0].id2)
               }
            }
         }
      })
};
//Method set default
VizualArray.prototype.default = function (id1, id2) {
   //var temp = this, count = 0;
   this.circle.transition().duration(700)
      .attr('fill', '#f3f3f3')
      .attr("r", function (d) {
         return 20 + d
      })//'cy':100,
      .attr("cy", 100)
   //.each('end',function(){
   //   if(!count){
   //      count+=1;
   //      temp.event.shift();
   //      if(temp.event.length){
   //         if(temp.event[0].event == 'compare'){
   //            temp.compare(temp.event[0].id1,temp.event[0].id2)
   //         } else{
   //            temp.change(temp.event[0].id1,temp.event[0].id2)
   //         }
   //      }
   //   }
   //})
};

//Method change
VizualArray.prototype.change = function (id1, id2) {
   var temp = this, count = 0;
   //swap analog
   this.index[id1] = this.index[id1] ^ this.index[id2];
   this.index[id2] = this.index[id1] ^ this.index[id2];
   this.index[id1] = this.index[id1] ^ this.index[id2];
   this.container = this.container.data(this.data);
   this.circle = this.circle.data(this.data);
   this.text = this.text.data(this.data);
   this.container.transition()
      .duration(700).attr({
      'transform': function (d, i) {
         return "translate(" + (30 + 60 * temp.index.indexOf(i)) + ",0)"
      },
   }).each('end', function () {
      if (!count) {
         count += 1;
         temp.event.shift();
         if (temp.event.length) {
            if (temp.event[0].event === 'compare') {
               temp.compare(temp.event[0].id1, temp.event[0].id2)
            } else {
               temp.change(temp.event[0].id1, temp.event[0].id2)
            }
         }
      }
      else {
         //temp.default();

      }
   })
};

//Method  bubbleSort
VizualArray.prototype.BubbleSort = function () {
   var data = this.data.slice(0);
   for (var i = data.length - 1, flag; i > 0; i--) {
      flag = true;
      for (var j = 0; j < i; j++) {
         this.event.push({event: 'compare', id1: j, id2: j + 1});
         if (data[j] > data[j + 1]) {
            flag = false;
            var temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
            this.event.push({event: 'change', id1: j, id2: j + 1})
         }
      }
      if (flag) {
         break;
      }
   }
   if (this.event.length) {
      this.compare(this.event[0].id1, this.event[0].id2);
      console.log('point')
   }
};

$().ready(function () {
   var vm = this;
   this.List = null;
   $('#formation').click(function () {
      d3.select("svg").remove();
      $('.error-msg').remove();


      vm.List = null;
      vm.List = new VizualArray(getArray('.output', '#arrayLength-7', '#arrayRange-7'), 'bubble');

      //for (var i=0, t=7; i<t; i++) {
      //   data.push(Math.round(Math.random() * t))
      //}


   });

   $('#start').bind("click", function () {
      try {
         vm.List.BubbleSort();
      }
      catch (err) {
         errorMessage('.output', "Oops! You forgot construct array!");
      }
   });

   $('.clear').click(function () {
      $('.error-msg').remove();
      d3.select("svg").remove();
      vm.List = {}
   });


});


function errorMessage(outputId, message) {
   $(outputId).html("<p class='error-msg'>" + message + "</p>");
   $('input').val("");
}


function getArray(outputId, arrayLength, arrayRange) {
   var length = $(arrayLength).val();
   var range = $(arrayRange).val();
   dataArray = [];
   if (length != 0 && range != 0) {
      for (i = 0; i < length; i++) {
         ///dataArray[i] = Math.floor(((Math.random() * range * 2) - range) + 1);
         dataArray[i] = Math.round(Math.random() * (range - 1) + 1);
         dataArray.push(i);
      }
      dataArray.pop();
      //$(outputId).append("<p>Your randomly generated array is: x = [ "+dataArray+" ]</p>");
      console.log("Your randomly generated array is: x = [ " + dataArray + " ]");
      return dataArray;
   } else {
      errorMessage(outputId, "Oops! Did you remember to set an array length <i>and</i> a range for your array?");
      return false;
   }
}