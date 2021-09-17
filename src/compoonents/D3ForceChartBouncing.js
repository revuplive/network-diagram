import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import './D3forceChart.css';
// import './D3ForceChartUpdatable.css';
import './D3ForceChartBouncing.css';

class D3ForceChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Team A'
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.positions = {};
    // set up initial nodes and links
    //  - nodes are known by 'id', not by index in array.
    //  - reflexive edges are indicated on the node (as a bold black circle).
    //  - links are always source < target; edge directions are set by 'left' and 'right'.
    // [
    //   { id: 0, reflexive: false, value: 40,name: 'AGGR', label: 'Aggregation', group: 'Team C', value: 20, category:2},
    //   { id: 1, reflexive: true, value: 80 },
    //   { id: 2, reflexive: false, value: 40 }
    // ];
    // this.lastNodeId = 2;
    // this
    this.dataset = {
      nodes: [
        { id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team B', value: 20, category: 2 },
        { id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', value: 60, category: 1 },
        { id: 3, name: 'CALC', label: 'Final Calc', group: 'Team A', value: 30, category: 3 },
        { id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', value: 40, category: 1 },
        { id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', value: 20, category: 2 },
        { id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team A', value: 60, category: 3 },
        { id: 7, name: 'GROW', label: 'Growth Model', group: 'Team B', value: 60, category: 2 },
        { id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', value: 100, category: 4 },
        { id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', value: 80, category: 2 },
        { id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', value: 20, category: 1 },
        { id: 11, name: 'REPT', label: 'Reporting', group: 'Team B', value: 240, category: 4 },
        { id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', value: 30, category: 1 },
        { id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team C', value: 40, category: 0 }
      ], links: [
        { source: 1, target: 3 },
        { source: 6, target: 1 },
        { source: 7, target: 1 },
        { source: 9, target: 1 },
        { source: 2, target: 6 },
        { source: 2, target: 7 },
        { source: 2, target: 8 },
        { source: 2, target: 9 },
        { source: 10, target: 3 },
        { source: 3, target: 11 },
        { source: 8, target: 5 },
        { source: 8, target: 11 },
        { source: 6, target: 9 },
        { source: 7, target: 9 },
        { source: 8, target: 9 },
        { source: 9, target: 11 },
        { source: 12, target: 9 },
        { source: 13, target: 11 },
        { source: 13, target: 2 },
        { source: 13, target: 4 },
        { source: 13, target: 5 },
        { source: 13, target: 8 },
        { source: 13, target: 9 },
        { source: 13, target: 10 },
        { source: 4, target: 7 },
        { source: 10, target: 5 },
        { source: 4, target: 2 },
        { source: 5, target: 3 }
      ]
    };
    // this.nodesByGroups = d3.nest().key(d => d.group).entries(this.dataset.nodes);

  }

  componentDidMount() {
    // console.log("D3 FORRCE CHART componentDidUpdate ", this.props);
    // this.chart(this.props.nodes, this.props.links, this.props.relationSelected);
    this.chart(this.dataset);
    // this.table(this.dataset);
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  componentDidUpdate() {
    // // this.init();
    // // this.updateData(this.props.data);
    // console.log("componentDidUpdmate", this.props);
    this.chart(this.dataset);
    // this.table(this.dataset);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // // console.log("ForcePage, shouldComponentUpdate", !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links && nextProps.relationSelected === this.props.relationSelected))
  //   // return !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links);
  // }

  onResize = () => {
    this.chart(this.dataset);
    // this.table(this.dataset);
  }

  chart(dataset) {
    let that = this;

    let freeNode = false;
    let nodesById = dataset.nodes.reduce((acc, el) => {
      acc[el.id] = el;
      return acc;
    }, {});
    // console.log("nodesById", nodesById);
    // let groupedBySource = d3.nest().key(d=>d.source).entries(dataset.links);

    let nodesByGroups = d3.nest().key(d => d.group).entries(dataset.nodes);
    console.log("nodesByGroups", nodesByGroups);
    that.selectedGroup = that.selectedGroup || "Team A";

    that.group = nodesByGroups.filter(d => d.key === that.selectedGroup);
    that.groupValues = that.group[0].values;
    console.log("groupValues", that.groupValues);
    // let groupHeaders = nodesByGroups.map(d => d.key);
    // console.log("groupHeaders", groupHeaders);

    const element = this.viz || document.querySelector('body');
    const chartElement = this.chartViz || document.querySelector('body');
    d3.select(element).selectAll("*").remove();
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    // set up SVG for D3
    const width = (element.offsetWidth - (margin.left + margin.right) * 2);
    const height = 700;
    // const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
      .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
      .range(['#ff9e6d', '#86cbff', '#c2e5a0', '#9e79db', '#fff686']);

    let valueExtent = d3.extent(dataset.nodes, (d) => d.value);//d3.extent(dataset.nodes, d => d.value);
    let lineStrokeScale = d3.scaleLinear()
      .domain(valueExtent)
      .range([2, 10]);
    let lineWidthScale = d3.scaleLinear()
      .domain(valueExtent)
      .range([17, 50]);
    const svg = d3.select(element)
      .append("svg")
      // .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      ;
    d3.select(chartElement).selectAll("*").remove();
    const chartDiv = d3.select(chartElement)
      .append("div")
      .attr("class", "table-div")
      .style('border', "1px solid #000")
      // .style('width', "25%")
      ;
    chartDiv
      .append("h2")
      .attr("class", "container-header")
      .text("Groups");

    let tableHeaderContainer = chartDiv
      .append("div")
      .attr("class", "tableHeaderContainer");

    tableHeaderContainer
      .selectAll('div')
      .data(nodesByGroups, d => d.key)
      .enter()
      .append("div")
      .attr("class", d => d.key === that.selectedGroup ? "container-header-item active" : "container-header-item")
      // .attr("key", d => {
      //   console.log("d0,", d);
      //   return d
      // })
      .text(d => d.key)
      .on("click", (d) => {
        console.log("handleChange", d);
        that.selectedGroup = d.key;
        restart();
      })
      ;

    // chartDiv
    //   .append("br");

    // groupItemsRender() {
    //   let group = this.nodesByGroups.filter(d => d.key === this.state.value);
    //   if (group && group[0] && group[0].values) {
    //     group = group[0].values
    //   }
    //   console.log("group", group);
    //   return group.map((d, i) => {
    //     return (
    //       <div className="group-item" value={d.id} key={d.id + "_" + d.name}>
    //         <p>{`Name: ${d.name}`}</p>
    //         <p>{`Value: ${d.value}`}</p>
    //       </div>
    //     )
    //   })
    // }


    //   <option value={d.key} key={d.key + "_" + i}>{d.key}</option>
    // <select value={this.state.value} onChange={this.handleChange}>


    svg.append("text")
      .text("Chart example v3")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", 25)
      .style("font-size", "20px");
    var yCenter = [height / 8, height * 2 / 6, height * 3 / 6, height * 4 / 6, height * 7 / 8];

    // // Mac Firefox doesn't distinguish between left/right click when Ctrl is held... 
    const drag = d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
      .filter(() => d3.event.button === 0 || d3.event.button === 2)
      .on("start", dragstarted) //start - after a new pointer becomes active (on  mousedown or touchstart).
      .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
      .on('end', dragend)
      ;


    function constant(_) {
      return function () { return _ }
    }


    function rectCollide() {
      var nodes, sizes, masses
      var size = constant([0, 0])
      var strength = 1
      var iterations = 1

      function force() {
        var node, size, mass, xi, yi
        var i = -1
        while (++i < iterations) { iterate() }

        function iterate() {
          var j = -1
          var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

          while (++j < nodes.length) {
            node = nodes[j]
            size = sizes[j]
            mass = masses[j]
            xi = xCenter(node)
            yi = yCenter(node)

            tree.visit(apply)
          }
        }

        function apply(quad, x0, y0, x1, y1) {
          var data = quad.data
          var xSize = (size[0] + quad.size[0]) / 2
          var ySize = (size[1] + quad.size[1]) / 2
          if (data) {
            if (data.index <= node.index) { return }

            var x = xi - xCenter(data)
            var y = yi - yCenter(data)
            var xd = Math.abs(x) - xSize
            var yd = Math.abs(y) - ySize

            if (xd < 0 && yd < 0) {
              var l = Math.sqrt(x * x + y * y)
              var m = masses[data.index] / (mass + masses[data.index])

              if (Math.abs(xd) < Math.abs(yd)) {
                node.vx -= (x *= xd / l * strength) * m
                data.vx += x * (1 - m)
              } else {
                node.vy -= (y *= yd / l * strength) * m
                data.vy += y * (1 - m)
              }
            }
          }

          return x0 > xi + xSize || y0 > yi + ySize ||
            x1 < xi - xSize || y1 < yi - ySize
        }

        function prepare(quad) {
          if (quad.data) {
            quad.size = sizes[quad.data.index]
          } else {
            quad.size = [0, 0]
            var i = -1
            while (++i < 4) {
              if (quad[i] && quad[i].size) {
                quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
              }
            }
          }
        }
      }

      function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2 }
      function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2 }

      force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
      }

      force.size = function (_) {
        return (arguments.length
          ? (size = typeof _ === 'function' ? _ : constant(_), force)
          : size)
      }

      force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
      }

      force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
      }

      return force
    }

    function boundedBox() {
      var nodes, sizes;
      var bounds = [[0, 0], [width, height]];
      var size = constant([0, 0]);

      function force() {
        var node, size
        var xi, x0, x1, yi, y0, y1
        var i = -1
        while (++i < nodes.length) {
          node = nodes[i]
          size = sizes[i]
          xi = node.x + node.vx
          x0 = bounds[0][0] + (0) - xi
          x1 = bounds[1][0] - (node.radius || 17) - (xi + size[0])
          yi = node.y + node.vy
          y0 = bounds[0][1] + (0) - yi
          y1 = bounds[1][1] - (node.radius || 17) - (yi + size[1])
          if (x0 > 0 || x1 < 0) {
            node.x += node.vx
            node.vx = -node.vx
            if (node.vx < x0) { node.x += x0 - node.vx }
            if (node.vx > x1) { node.x += x1 - node.vx }
          }
          if (y0 > 0 || y1 < 0) {
            node.y += node.vy
            node.vy = -node.vy
            if (node.vy < y0) { node.vy += y0 - node.vy }
            if (node.vy > y1) { node.vy += y1 - node.vy }
          }
        }
      }

      force.initialize = function (_) {
        sizes = (nodes = _).map(size)
      }

      force.bounds = function (_) {
        return (arguments.length ? (bounds = _, force) : bounds)
      }

      force.size = function (_) {
        return (arguments.length
          ? (size = typeof _ === 'function' ? _ : constant(_), force)
          : size)
      }

      return force
    }

    function recursive(sourceNodeWeight, _node) {
      // console.log("recursive", nodesById[_node.id]);
      dataset.links.forEach(link => {
        if (_node.id === link.source.id) {
          // dataset.nodes.forEach(node => {
          //   if(node.id === link.source.id){
          //     node.value = sourceNodeWeight + node.value;
          //     recursive(sourceNodeWeight, node);
          //   } 
          // });
          let node = nodesById[link.target.id];
          // console.log("node", node);
          node.value = node.value + sourceNodeWeight;
          recursive(sourceNodeWeight, node);
        }
      });
    }

    var collisionForce = rectCollide()
      .size(function (d) { return [lineWidthScale(d.value) * 2, lineWidthScale(d.value) * 2] })

    var boxForce = boundedBox()
      .bounds([[0, 0], [width, height]])
      .size(function (d) { return [lineWidthScale(d.value) * 2, lineWidthScale(d.value) * 2] })


    // valueExtent = d3.extent(dataset.links, d => d.source.value + d.target.value);
    // console.log("valueExtent", valueExtent);
    const distanceScale = d3.scaleLinear()
      .domain(valueExtent)
      .range([150, 250])

    // init D3 force layout
    const forceSimulation = d3.forceSimulation()
      // .velocityDecay(0)
      // .alphaTarget(0)
      // .alpha(0.1)
      .force("link", d3.forceLink()
        .id(d => d.id)
        // .distance(d => distanceScale(d.source ? d.source.value : d.value))
        .distance(140)
      )
      .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion (if it's negative) between nodes. 
      .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      // .force('x', d3.forceX().x(function (d) {
      //   return width / 2
      // }).strength(0.1))
      // .force('y', d3.forceY().y(d => {
      //   return yCenter[d.category]
      //   // return height / 2
      // }).strength(0.1))
      // .force('collision', d3.forceCollide().radius(function (d) {
      //   return 17 + d.value / 10;
      // }))
      // .force('box', boxForce)
      // .force("collide",d3.forceCollide().strength(1).radius(17))
      // .force('collision', collisionForce)
      .on('tick', ticked);


    let markerSize = 6;
    svg.append('defs')
      .append('marker')
      .attr("id", 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr('refX', 0) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', markerSize)
      .attr('markerHeight', markerSize)
      .attr('xoverflow', 'visible')
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none')
      ;

    // line displayed when dragging new nodes
    const dragLine = svg.append('line')
      .attr('class', 'link dragline hidden')
      // .attr("x1", 0)
      // .attr("y1", 0)
      // .attr("x2", 0)
      // .attr("y2", 0)
      // .attr('d', 'M0,0L0,0')
      ;

    // handles to link and node element groups
    let path = svg.append('g').selectAll('line');
    let node = svg.append('g').selectAll('g');

    // mouse event vars
    let selectedNode = null;
    let selectedLink = null;
    let mousedownLink = null;
    let sourceNode = null;
    let targetNode = null;
    let defaultNodeWeight = 40;
    let maxVelocity = 20

    function resetMouseVars() {
      sourceNode = null;
      targetNode = null;
      mousedownLink = null;
    }

    setInterval(function () {
      forceSimulation.alpha(0.1);
    }, 250);

    // update force layout (called automatically each iteration)

    let checkCollision = (ball1, ball2) => {
      ball2.posX = ball2.x;
      ball2.posY = ball2.y;
      ball2.radius = lineWidthScale(ball2.value);

      var absx = Math.abs(parseFloat(ball2.posX) - parseFloat(ball1.posX));
      var absy = Math.abs(parseFloat(ball2.posY) - parseFloat(ball1.posY));

      // find distance between two balls.
      var distance = (absx * absx) + (absy * absy);
      distance = Math.sqrt(distance);
      // check if distance is less than sum of two radius - if yes, collision
      if (distance < (parseFloat(ball1.radius) + parseFloat(ball2.radius))) {
        return true;
      }
      return false;
    }

    let move = (thisobj) => {
      // var svg = thisobj.svg;
      thisobj.radius = lineWidthScale(thisobj.value);
      thisobj.vx = 0;
      thisobj.vy = 0;
      thisobj.posX += thisobj._vx;
      thisobj.posY += thisobj._vy;
      // console.log("thisobj._vx", thisobj._vx);
      // console.log("thisobj._vy", thisobj._vy);

      if (width <= (thisobj.posX + thisobj.radius)) {
        thisobj.posX = width - thisobj.radius - 1;
        thisobj.aoa = Math.PI - thisobj.aoa;
        thisobj._vx = -thisobj._vx;
      }

      if (thisobj.posX < thisobj.radius) {
        thisobj.posX = thisobj.radius + 1;
        thisobj.aoa = Math.PI - thisobj.aoa;
        thisobj._vx = -thisobj._vx;
      }

      if (height < (thisobj.posY + thisobj.radius)) {
        thisobj.posY = height - thisobj.radius - 1;
        thisobj.aoa = 2 * Math.PI - thisobj.aoa;
        thisobj._vy = -thisobj._vy;
      }

      if (thisobj.posY < thisobj.radius) {
        thisobj.posY = thisobj.radius + 1;
        thisobj.aoa = 2 * Math.PI - thisobj.aoa;
        thisobj._vy = -thisobj._vy;
      }

      // **** NOT USING AOA except during initilization. Just left this for future reference ***** 
      if (thisobj.aoa > 2 * Math.PI)
        thisobj.aoa = thisobj.aoa - 2 * Math.PI;
      if (thisobj.aoa < 0)
        thisobj.aoa = 2 * Math.PI + thisobj.aoa;

      thisobj.x = thisobj.posX || 0;
      thisobj.y = thisobj.posY || 0;
      thisobj.vx = 0;
      thisobj.vy = 0;
      thisobj.fx = thisobj.posX || 0;
      thisobj.fy = thisobj.posY || 0;
      // console.log("x", thisobj.x, thisobj._vx);
      // console.log(thisobj.x, thisobj.y, thisobj.radius);
      let ball1 = thisobj;
      this.dataset.nodes.forEach(ball2 => {
        if (ball1.id !== ball2.id && checkCollision(ball1, ball2)) {
          console.log("checkCollision happened");

          // console.log("d", d, "sourceNode", sourceNode);
          // needed by FF
          dragLine
            .classed('hidden', true)
            .style('marker-end', '');

          // check for drag-to-self
          sourceNode = ball1;
          targetNode = ball2;

          // if(targetNode !== sourceNode){
          //   targetNode.value = sourceNode.value + targetNode.value;
          //   console.log("targetNode.value",targetNode.value,"sourceNode.value ",sourceNode.value );
          // //   dataset.nodes.map(d => {
          // //     if(d.id === targetNode.id){
          // //       return d.value = sourceNode.value
          // //     }
          // //   })
          // } 

          // dataset.nodes.forEach( d=> {
          //   if(d.id === targetNode.id){

          //     let increasedValue = sourceNode.value + d.value;


          if (targetNode === sourceNode) {
            resetMouseVars();
            return;
          }

          // unenlarge target node
          // d3.select(this).attr('transform', '');
          // setTimeout(() => {
            if (targetNode && !targetNode.new) {
              that.selectedGroup = targetNode.group;
              console.log("that.selectedGroup checkCollision", that.selectedGroup);
              targetNode.value = targetNode.value + sourceNode.value;
              recursive(sourceNode.value, targetNode);
              restart()
            }
          // }, 200);

          // dataset.links.forEach( link => {
          //   if(sourceNode.id === link.target){

          //     dataset.nodes.forEach(node => {
          //       if(node.id === link.source){
          //         node.value = sourceNode.value + node.value;
          //       } 
          //     });
          //     //     // return d.value = sourceNode.value + d.value
          //     //   } 
          //     //   });
          //     //     return d.value = increasedValue
          //   } 
          // });

          // groupedBySource = d3.nest().key(d=>d.source).entries(dataset.links);

          // select new link
          // selectedLink = link;
          // selectedNode = null;
          restart();




          // intersection point
          // var interx = ((ball1.posX * ball2.radius) + ball2.posX * ball1.radius)
          // / (ball1.radius + ball2.radius);
          // var intery = ((ball1.posY * ball2.radius) + ball2.posY  * ball1.radius)
          // / (ball1.radius + ball2.radius);
          // // show collision effect for 500 miliseconds
          // var intersectBall = svg.select('#' + ball1.id + '_intersect');
          // intersectBall.attr({ 'cx': interx, 'cy': intery, 'r': 5 ,'fill': 'black' })
          //             .transition()
          //             .duration(500)
          //             .attr('r', 0);

          // calculate new velocity of each ball.
          // var vx1 = (ball1.vx * (ball1.value - ball2.value)
          //     + (2 * ball2.value * ball2.vx )) / (ball1.value + ball2.value);
          // var vy1 = (ball1.vy * (ball1.value - ball2.value)
          //     + (2 * ball2.value * ball2.vy)) / (ball1.value + ball2.value);
          // var vx2 = (ball2.vx * (ball2.value - ball1.value)
          //     + (2 * ball1.value * ball1.vx)) / (ball1.value + ball2.value);
          // var vy2 = (ball2.vy * (ball2.value - ball1.value)
          //     + (2 * ball1.value * ball1.vy)) / (ball1.value + ball2.value);
          let ball2_value = Math.max(ball1.value * 2, ball2.value);
          let ball2_vx = -ball1._vx;
          let ball2_vy = -ball1._vy;
          var vx1 = -(ball1._vx || 1); // (ball1._vx * (ball1.value - ball2_value) + (2 * ball2_value * ball2_vx )) / (ball1.value + ball2_value);
          var vy1 = -(ball1._vy || 1); // (ball1._vy * (ball1.value - ball2_value) + (2 * ball2_value * ball2_vy)) / (ball1.value + ball2_value);
          // var vx1 = (ball1._vx * (ball1.value - ball2_value) + (2 * ball2_value * ball2_vx )) / (ball1.value + ball2_value);
          // var vy1 = (ball1._vy * (ball1.value - ball2_value) + (2 * ball2_value * ball2_vy)) / (ball1.value + ball2_value);

          //set velocities for both balls
          let maxSpeed = 3;
          let minSpeed = 0.5;
          ball1._vx = vx1 > 0 && vx1 > maxSpeed ? maxSpeed : (vx1 < 0 && vx1 < -maxSpeed ? -maxSpeed : vx1);
          ball1._vy = vy1 > 0 && vy1 > maxSpeed ? maxSpeed : (vy1 < 0 && vy1 < -maxSpeed ? -maxSpeed : vy1);
          ball1._vx = ball1._vx > 0 ? Math.max(ball1._vx, minSpeed) : Math.min(ball1._vx, -minSpeed);
          ball1._vy = ball1._vy > 0 ? Math.max(ball1._vy, minSpeed) : Math.min(ball1._vx, -minSpeed);
          // ball2.vx = vx2;
          // ball2.vy = vy2;

          //ensure one ball is not inside others. distant apart till not colliding
          while (checkCollision(ball1, ball2)) {
            ball1.posX += ball1._vx;
            ball1.posY += ball1._vy;
            ball1.x = ball1.posX || 0;
            ball1.y = ball1.posY || 0;
            // ball2.posX += ball2.vx;
            // ball2.posY += ball2.vy;
          }
        }
      })
    }


    function ticked() {

      // var alpha = this.alpha();
      node
        .each(d => {
          if (d.new) {
            move(d);
            console.log();
            //       // d.vx = d.x + Math.random()/10;
            //       // d.vy = d.y + Math.random()/10;
            //       // d.x = d.x + d.vx * 5;
            //       // d.y = d.y + d.vy * 5;
            //       let k = 0.01;
            //       let node = d;
            //       node.vx -= node.x * k;
            //       node.vy -= node.y * k;
            //       // let vx = 1;
            //       // let vy = 1;
            // // var vScalingFactor = 1.1 * maxVelocity / Math.max(Math.sqrt(vx * vx + vy * vy), maxVelocity);
            // // console.log(vScalingFactor);
            // // // d.fx = null
            // // // d.fy = null
            // // d.vx = d.vx * vScalingFactor;
            // // d.vy = d.vy * vScalingFactor;
            // // let velocityDecay = Math.random();
            // // let node = d;

            // // if (node.fx == null) { node.x += node.vx *= velocityDecay; }
            // // else { node.x = node.fx; node.vx = 0; }
            // // if (node.fy == null) {node.y += node.vy *= velocityDecay; }
            // // else { node.y = node.fy; node.vy = 0; }

          }
          // else{
          //   d.vx = d.vx * 0;
          //   d.vy = d.vy * 0;
          // }
        })
        .attr('transform', (d) => `translate(${d && d.x ? d.x : 0},${d && d.y ? d.y : 0})`);
      path
        .each(d => {
          // Total difference in x and y from source to target
          d.target.x = d.target.x || 0;
          d.target.y = d.target.y || 0;
          d.source.x = d.source.x || 0;
          d.source.y = d.source.y || 0;
          d.diffX = d.target.x - d.source.x;
          d.diffY = d.target.y - d.source.y;
          d.target.radius = (lineWidthScale(d.target.value) + markerSize * 2) || 0;

          // Length of path from center of source node to center of target node
          d.pathLength = Math.sqrt((d.diffX * d.diffX) + (d.diffY * d.diffY));

          // x and y distances from center to outside edge of target node
          d.offsetX = ((d.diffX * d.target.radius) / d.pathLength) || 0;
          d.offsetY = ((d.diffY * d.target.radius) / d.pathLength) || 0;
        })
        .attr("x1", d => d.source.x || 0)
        .attr("y1", d => d.source.y || 0)
        .attr("x2", d => (d.target.x - d.offsetX) || 0)
        .attr("y2", d => (d.target.y - d.offsetY) || 0);
      // return "M" + d.source.x + "," + d.source.y + "L" + (d.target.x - offsetX) + "," + (d.target.y - offsetY);

    }
    function updateGroupItem() {
      that.group = nodesByGroups.filter(d => d.key === that.selectedGroup);
      that.groupValues = that.group[0].values;
      console.log("updateGroupItem", that.selectedGroup, nodesByGroups, that.groupValues);

      chartDiv.selectAll('.container-header-item')
        .attr("class", d => d.key === that.selectedGroup ? "container-header-item active" : "container-header-item");

      // https://stackoverflow.com/questions/41625978/d3-v4-update-pattern-for-groups
      let node = chartDiv.selectAll(".group-item") // bind the data, this is update
        .data(that.groupValues, d => d.id);
    
      node.exit().remove(); // exit, remove the g
    
      let nodeEnter = node.enter() // enter, append the g
        .append("div")
        .attr("class", "group-item")
        .html(d => `<p>Name: ${d.name}</p><p>Value: ${d.value}</p>`);
    
      // nodeEnter.append("div")
      //   // .attr("key", d => `${d.id}_${d.name}`)
      //   // .attr("value", d => d.id)
      //   .html(d => `<p>Name: ${d.name}</p><p>Value: ${d.value}</p>`);
    
      node = nodeEnter.merge(node); // enter + update on the g
    
      node.style("background-color",d=>{
        console.log("NODE D",d,"targetNode",targetNode,"sourceNode",sourceNode);
        return !!(targetNode && d.id === targetNode.id) || !!(sourceNode && d.id === sourceNode.id)  ? colors(d.group): "transparent"
      });
    
      node
      // .append("div")
      // .attr("class", "group-item")
      // .select(".group-item") // enter + update on subselection
        // .attr("value", d => d.id)
        .html(d => `<p>Name: ${d.name}</p><p>Value: ${d.value}</p>`);
    
      // tabElement.exit();

    //   groupItem.selectAll("p").remove();
    //   groupItem.exit();

    // let groupItem = chartDiv
    //   .selectAll('.group-item')
    //   .data(that.group)
    //   .enter()
    //   .append("div")
    //   .attr("class", "group-item")
    //   .attr("key", d => `${d.id}_${d.name}`)
    //   .attr("value", d => d.id);
    // groupItem
    //   .append("p")
    //   .text(d => `Name: ${d.name}`);
    // groupItem
    //   .append("p")
    //   .text(d => `Value: ${d.value}`);

    }
    // update graph (called when needed)
    function restart() {
      // console.log("dataset", dataset);
      // path (link) group
      let valueExtent = d3.extent(dataset.nodes, (d) => d.value);
      lineStrokeScale.domain(valueExtent);
      lineWidthScale.domain(valueExtent)

      updateGroupItem();

      path = path.data(dataset.links);

      // remove old links
      path.exit().remove();

      // add new links
      path = path.enter().append('line')
        .attr('class', 'link')
        .classed('selected', (d) => d === selectedLink)
        // .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .style('marker-end', 'url(#arrowhead)')
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;

          // select link
          mousedownLink = d;
          selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
          selectedNode = null;
          restart();
        })
        .merge(path);

      // node group
      // NB: the function arg is crucial here! nodes are known by id, not by index!
      node = node.data(dataset.nodes, (d) => d.id);

      // update existing nodes (reflexive & selected visual states)
      node.selectAll('circle')
        .attr('r', d => lineWidthScale(d.value))// 17)// d => lineWidthScale(d.value))
        .style("fill", d => colors(d.group));

      node.selectAll(".value")
        .text(d => d.value);
      // .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
      // .classed('reflexive', (d) => d.reflexive)
      ;

      // remove old nodes
      node.exit().remove();

      // add new nodes
      const circle = node.enter().append('g');

      circle.append('circle')
        .attr('class', 'node')
        .attr("id", d => "circle" + d.id)
        .attr('r', d => lineWidthScale(d.value))// 17)// d => lineWidthScale(d.value))
        // .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))\

        .style("fill", d => colors(d.group))
        .style("stroke-opacity", 0.3)
        .style('stroke', 'grey')//(d) => d3.rgb(colors(d.id)).darker().toString())
        .style("stroke-width", d => lineStrokeScale(d.value))//lineWidthScale(d.value))//d.value/10)
        // .classed('reflexive', (d) => d.reflexive)
        // .on('mouseover', function (d) {
        //   if (!sourceNode || d === sourceNode) return;
        //   // enlarge target node
        //   d3.select(this).attr('transform', 'scale(1.1)');
        // })
        .on('mouseout', function (d) {
          if (!sourceNode || d === sourceNode) return;
          // unenlarge target node
          d3.select(this).attr('transform', '');
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;

          // select node
          sourceNode = d;
          selectedNode = (sourceNode === selectedNode) ? null : sourceNode;
          selectedLink = null;

          // reposition drag line
          dragLine
            .style('marker-end', 'url(#arrowhead)')
            .classed('hidden', false)
            .attr("x1", sourceNode.x)
            .attr("y1", sourceNode.y)
            .attr("x2", sourceNode.x)
            .attr("y2", sourceNode.y);
          // .attr('d', `M${sourceNode.x},${sourceNode.y}L${sourceNode.x},${sourceNode.y}`);

          restart();
        })
        .on('mouseup', function (d) {
          if (!sourceNode) return;
          // console.log("d", d, "sourceNode", sourceNode);
          // needed by FF
          dragLine
            .classed('hidden', true)
            .style('marker-end', '');

          // check for drag-to-self
          targetNode = d;

          // if(targetNode !== sourceNode){
          //   targetNode.value = sourceNode.value + targetNode.value;
          //   console.log("targetNode.value",targetNode.value,"sourceNode.value ",sourceNode.value );
          // //   dataset.nodes.map(d => {
          // //     if(d.id === targetNode.id){
          // //       return d.value = sourceNode.value
          // //     }
          // //   })
          // } 

          // dataset.nodes.forEach( d=> {
          //   if(d.id === targetNode.id){

          //     let increasedValue = sourceNode.value + d.value;


          if (targetNode === sourceNode) {
            resetMouseVars();
            return;
          }

          // unenlarge target node
          d3.select(this).attr('transform', '');

          const directLink = dataset.links.filter((l) => l.source.id === sourceNode.id && l.target.id === targetNode.id);
          const reverseLink = dataset.links.filter((l) => l.source.id === targetNode.id && l.target.id === sourceNode.id);
          const alreadyConnected = dataset.links.filter((l) => l.source.id === sourceNode.id);

          if (directLink.length) {
            console.log("directLink.length");
            // no events
          } else if (reverseLink.length) {
            console.log("reverseLink.length");
            let sourceNodeWeight = sourceNode.value;
            sourceNode.value = targetNode.value;
            targetNode.value = sourceNodeWeight;
            // dataset.links = dataset.links.filter((l) => !(l.source.id === targetNode.id && l.target.id === sourceNode.id)); // remove inversed link to current link
            reverseLink[0].source = sourceNode;
            reverseLink[0].target = targetNode;
            // dataset.links.push({
            //   source: sourceNode, target: targetNode, //left: !isRight, right: isRight
            // });
          } else if (alreadyConnected.length) {
            console.log("alreadyConnected.length");
            if (sourceNode.new) {
              console.log("sourceNode.new");
              sourceNode.new = false;
              sourceNode.vx = 0;
              sourceNode.vy = 0;
              sourceNode.fx = sourceNode.x;
              sourceNode.fx = sourceNode.x;
              sourceNode.posX = sourceNode.y;
              sourceNode.posY = sourceNode.y;
              sourceNode._vx = 0;
              sourceNode._vy = 0;
              that.selectedGroup = sourceNode.group;
            }
            if (targetNode.new) {
              console.log("targetNode.new");
              targetNode.new = false;
              targetNode.vx = 0;
              targetNode.vy = 0;
              targetNode.fx = targetNode.x;
              targetNode.fy = targetNode.y;
              targetNode.fx = targetNode.x;
              targetNode.fy = targetNode.y;
              targetNode._vx = 0;
              targetNode._vy = 0;
              that.selectedGroup = targetNode.group;
            }
            freeNode = false;
            dataset.links.push({
              source: sourceNode, target: targetNode, //left: !isRight, right: isRight
            });
            targetNode.value = sourceNode.value + targetNode.value;
            // no value recalculation
          } else if (directLink.length === 0) {
            console.log("directLink.length === 0");
            if (sourceNode.new) {
              console.log("sourceNode.new");
              sourceNode.new = false;
              sourceNode.vx = 0;
              sourceNode.vy = 0;
              sourceNode.fx = sourceNode.x;
              sourceNode.fx = sourceNode.x;
              sourceNode.posX = sourceNode.y;
              sourceNode.posY = sourceNode.y;
              sourceNode._vx = 0;
              sourceNode._vy = 0;
              that.selectedGroup = sourceNode.group;
            }
            if (targetNode.new) {
              console.log("targetNode.new");
              targetNode.new = false;
              targetNode.vx = 0;
              targetNode.vy = 0;
              targetNode.fx = targetNode.x;
              targetNode.fy = targetNode.y;
              targetNode.fx = targetNode.x;
              targetNode.fy = targetNode.y;
              targetNode._vx = 0;
              targetNode._vy = 0;
              that.selectedGroup = targetNode.group;
            }
            freeNode = false;
            dataset.links.push({
              source: sourceNode, target: targetNode, //left: !isRight, right: isRight
            });
            recursive(sourceNode.value, sourceNode);
          }

          // dataset.links.forEach( link => {
          //   if(sourceNode.id === link.target){

          //     dataset.nodes.forEach(node => {
          //       if(node.id === link.source){
          //         node.value = sourceNode.value + node.value;
          //       } 
          //     });
          //     //     // return d.value = sourceNode.value + d.value
          //     //   } 
          //     //   });
          //     //     return d.value = increasedValue
          //   } 
          // });

          // groupedBySource = d3.nest().key(d=>d.source).entries(dataset.links);

          // select new link
          // selectedLink = link;
          // selectedNode = null;
          restart();
        });


      circle.append("text")
        .attr("class", "name")
        .attr("dy", 0)
        .attr("dx", 0)
        .text(d => d.name);
      circle.append("text")
        .attr("class", "value")
        .attr("dy", 12)
        .attr("dx", 0)
        .text(d => d.value);

      node = circle.merge(node);

      //

      //set up dictionary of neighbors
      var neighborTarget = {};
      // console.log("dataset.nodes", dataset.nodes);
      for (let i = 0; i < dataset.nodes.length; i++) {
        let id = dataset.nodes[i].id;
        neighborTarget[id] = dataset.links.filter((d) => d.source === id).map((d) => d.target)
      };
      var neighborSource = {};
      for (let i = 0; i < dataset.nodes.length; i++) {
        let id = dataset.nodes[i].id;
        neighborSource[id] = dataset.links.filter((d) => d.target === id).map((d) => d.source)
      };

      // console.log("neighborSource is ", neighborSource);
      // console.log("neighborTarget is ", neighborTarget);

      circle.selectAll("circle").on("click", (d) => {
        // console.log("d",d);
        var active = d.active ? false : true // toggle whether node is active
          , newStroke = active ? "yellow" : "grey"
          , newStrokeIn = active ? "green" : "grey"
          , newStrokeOut = active ? "red" : "grey"
          , newOpacity = active ? 0.6 : 0.3
          , subgraphOpacity = active ? 0.9 : 0;

        // console.log("CIRCLE CLICK, ", d, " active ", active);
        //extract node's id and ids of its neighbors
        var id = d.id
          , neighborS = neighborSource[id]
          , neighborT = neighborTarget[id];
        // console.log("neighbors is from ", neighborS, " to ", neighborT);
        d3.selectAll("#circle" + id).style("stroke-opacity", newOpacity);
        d3.selectAll("#circle" + id).style("stroke", newStroke);

        d3.selectAll("#subgraph").style("opacity", subgraphOpacity)

        //highlight the current node and its neighbors
        for (let i = 0; i < neighborS.length; i++) {
          d3.selectAll("#line" + neighborS[i] + id).style("stroke", newStrokeIn);
          d3.selectAll("#circle" + neighborS[i]).style("stroke-opacity", newOpacity).style("stroke", newStrokeIn);
        }
        for (let i = 0; i < neighborT.length; i++) {
          d3.selectAll("#line" + id + neighborT[i]).style("stroke", newStrokeOut);
          d3.selectAll("#circle" + neighborT[i]).style("stroke-opacity", newOpacity).style("stroke", newStrokeOut);
        }
        //update whether or not the node is active
        d.active = active;
      })
      //

      // set the graph in motion
      forceSimulation
        .nodes(dataset.nodes)
        .force('link').links(dataset.links);

      forceSimulation.alphaTarget(0.3).restart();
    }

    // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).

    //When the drag gesture starts, the targeted node is fixed to the pointer
    //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
    function dragstarted(d) {
      if (!d3.event.active) forceSimulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
      d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
      d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }

    //When the drag gesture starts, the targeted node is fixed to the pointer
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragend(d) {
      if (!d3.event.active) forceSimulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    function mousedown() {
      // because :active only works in WebKit?
      // svg.classed('active', true);

      if (d3.event.ctrlKey || sourceNode || mousedownLink || freeNode) return;

      // insert new node at point
      const point = d3.mouse(this);
      // console.log("point,", point);
      //id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', value: 20, category:2
      const aoa = Math.PI / getRandomInt(9);
      const jumpSize = 2;
      const node = {
        id: (Date.now()), x: point[0], y: point[1], value: defaultNodeWeight, name: 'new node', label: 'new node', category: 2, group: 'Team C', new: true,
        jumpSize,
        aoa,
        _vx: Math.cos(aoa) * jumpSize,
        _vy: Math.sin(aoa) * jumpSize,
        vx: 0,
        vy: 0,
        fx: point[0],
        fy: point[1],
        posX: point[0],
        posY: point[1],
      };//reflexive: false,
      dataset.nodes.push(node);
      nodesByGroups = d3.nest().key(d => d.group).entries(dataset.nodes);
      nodesById[node.id] = node;
      freeNode = true;
      that.selectedGroup = node.group;
      restart();
    }

    function mousemove() {
      if (!sourceNode) return;

      // update drag line
      dragLine
        .style('marker-end', 'url(#arrowhead)')
        .attr("x1", sourceNode.x)
        .attr("y1", sourceNode.y)
        .attr("x2", d3.mouse(this)[0])
        .attr("y2", d3.mouse(this)[1]);

      // .attr('d', `M${sourceNode.x},${sourceNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
    }

    function mouseup() {
      if (sourceNode) {
        // hide drag line
        dragLine
          .classed('hidden', true)
          .style('marker-end', '');
      }

      // because :active only works in WebKit?
      // svg.classed('active', false);

      // clear mouse event vars
      resetMouseVars();
    }

    function spliceLinksForNode(node) {
      const toSplice = dataset.links.filter((l) => l.source === node || l.target === node);
      for (const l of toSplice) {
        dataset.links.splice(dataset.links.indexOf(l), 1);
      }
    }

    // only respond once per keydown
    let lastKeyDown = -1;

    function keydown() {
      d3.event.preventDefault();

      if (lastKeyDown !== -1) return;
      lastKeyDown = d3.event.keyCode;

      // ctrl
      if (d3.event.keyCode === 17) {
        node.call(drag);
        svg.classed('ctrl', true);
        return;
      }

      if (!selectedNode && !selectedLink) return;

      switch (d3.event.keyCode) {
        case 8: // backspace
        case 46: // delete
          if (selectedNode) {
            dataset.nodes.splice(dataset.nodes.indexOf(selectedNode), 1);
            spliceLinksForNode(selectedNode);
          } else if (selectedLink) {
            dataset.links.splice(dataset.links.indexOf(selectedLink), 1);
          }
          selectedLink = null;
          selectedNode = null;
          restart();
          break;
        default:
          break;
      }
    }

    function keyup() {
      lastKeyDown = -1;

      // ctrl
      if (d3.event.keyCode === 17) {
        node.on('.drag', null);
        svg.classed('ctrl', false);
      }
    }

    // function getTextWidth(text, fontSize, fontName) {
    //   let c = document.createElement('canvas');
    //   let ctx = c.getContext('2d');
    //   ctx.font = fontSize + ' ' + fontName;
    //   // console.log("WIDTH:", text, ctx.measureText(text).width);
    //   return ctx.measureText(text).width;
    // } // getTextWidth(d, '12px', 'myriad-pro-condensed, robotoCondensed-light, sans-serif');

    // app starts here
    svg.on('mousedown', mousedown)
      .on('mousemove', mousemove)
      .on('mouseup', mouseup);
    d3.select(window)
      .on('keydown', keydown)
      .on('keyup', keyup);
    restart();
  }

  // handleChange(event) {
  //   // console.log(event.target.value);
  //   this.setState({ value: event.target.value });
  // }

  // groupItemsRender() {
  //   let group = this.nodesByGroups.filter(d => d.key === this.state.value);
  //   if (group && group[0] && group[0].values) {
  //     group = group[0].values
  //   }
  //   console.log("group", group);
  //   return group.map((d, i) => {
  //     return (
  //       <div className="group-item" value={d.id} key={d.id + "_" + d.name}>
  //         <p>{`Name: ${d.name}`}</p>
  //         <p>{`Value: ${d.value}`}</p>
  //       </div>
  //     )
  //   })
  // }
  render() {
    return (
      <div className="dash-container">
        <div className="d3-chart-wrapper " id='forceSvg' ref={viz => (this.viz = viz)}>
        </div>

        <div
          id="nodesTable"
          className="nodes-table-container"
          ref={chartViz => (this.chartViz = chartViz)}
        >
          {/* <select value={this.state.value} onChange={this.handleChange}>
            {
              this.nodesByGroups.map((d, i) => {
                return (
                  <option value={d.key} key={d.key + "_" + i}>{d.key}</option>
                )

              })
            } </select> */}
          {/* <br /> */}
          {/* {that.groupItemsRender()} */}
        </div>

      </div>
    );
  }
}

export default D3ForceChart;