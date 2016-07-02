//var d3 = require("d3");

var MyArray = function(data, id){
   var svg = d3.select('#' + id)
      .append('svg')
      .attr({
         'width': 900,
         'height': 300
      });

   this.container = svg.selectAll('g').
      data(data).enter().
      append('g').
      attr({
      'transform': function(d,i){ return  "translate(" + (30 + 60 * i) + ",100)"},
      'stroke':'#000',
      'stroke-width':'1px',
      'fill':'#f3f3f3'
      });

   this.circle = this.container
      .append('circle')
      .attr({
         'cy':100,
         'r':function(d,i){ return 20 + d},
         'stroke-width':'2px'});

   this.text = this.container
      .append('text')
      .attr({
         'dx':function(d, i){
            return d>=10?-8:-4;
         },
         'dy':100
      })
      .text(function(d){return d});

   this.data = data;

   this.index = (function(){
      var r = [];
      for (var i = 0; i< data.length; i++ ){
         r[i] = i
      }
      return r;
   })();

   this.event = [];
};

MyArray.prototype.draw = function(){

}

MyArray.prototype.compare = function(id1, id2){
   var temp = this, count = 0;
   this.circle.transition().duration(800)
      .attr('stroke', function(d, i){
         return (i == temp.index[id1] || i == temp.index[id2]) ? 'blue': 'red'
      })
      .each('end',function(){
         if(!count){
            count+=1;

            temp.event.shift();
            if(temp.event.length){
               if(temp.event[0].event == 'compare'){
                  temp.compare(temp.event[0].id1,temp.event[0].id2)
               } else{
                  temp.change(temp.event[0].id1,temp.event[0].id2)
               }
            }
         }
      })
};

MyArray.prototype.change = function(id1, id2){
   var temp = this, count = 0;
   //this.data[id1] = this.data[id1]^this.data[id2];
   //this.data[id2] = this.data[id1]^this.data[id2];
   //this.data[id1] = this.data[id1]^this.data[id2];
   this.index[id1] = this.index[id1]^this.index[id2];
   this.index[id2] = this.index[id1]^this.index[id2];
   this.index[id1] = this.index[id1]^this.index[id2];
   this.container = this.container.data(this.data)
   this.circle = this.circle.data(this.data)
   this.text = this.text.data(data)
   this.container.transition()
      .duration(800).attr({
      'transform': function(d,i){
         //if(i == id1){
         //  return  "translate(" + (30 + 60 * id2) + ",0)"
         //} else if (i == id2){
         //  return  "translate(" + (30 + 60 * id1) + ",0)"
         //}
         return  "translate(" + (30 + 60 * temp.index.indexOf(i)) + ",0)"},
   }).each('end',function(){
      if(!count){
         count+=1;
         temp.event.shift();
         if(temp.event.length){
            if(temp.event[0].event == 'compare'){
               temp.compare(temp.event[0].id1,temp.event[0].id2)
            } else{
               temp.change(temp.event[0].id1,temp.event[0].id2)
            }
         }
      }
   })
}

var data = [9,3,16,5,1,6,2,4,10,7,8,14,-1];



MyArray.prototype.BubbleSort = function () {
   var data = this.data.slice(0);
   for (var i = data.length - 1, flag; i > 0; i--) {
      flag = true;
      for (var j = 0; j < i; j++) {
         this.event.push({event:'compare', id1:j, id2:j+1})
         if (data[j] > data[j + 1]) {
            flag = false;
            var temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
            this.event.push({event:'change', id1:j, id2:j+1})
         }
      }
      if (flag) {
         break;
      }
   }
   if(this.event.length){
      this.compare(this.event[0].id1,this.event[0].id2);
   }
}



var List2 = new MyArray(data, 'bubble');
List2.BubbleSort();

