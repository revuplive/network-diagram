import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import './D3forceChart.css';
import './D3ForceChartUpdatable.css';

class D3ForceChart extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   };
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
    this.lastNodeId = 2;
    this.dataset = {
      nodes: [
        { id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', value: 20, category: 2 },
        { id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', value: 60, category: 1 },
        { id: 3, name: 'CALC', label: 'Final Calc', group: 'Team C', value: 30, category: 3 },
        { id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', value: 40, category: 1 },
        { id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', value: 20, category: 2 },
        { id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team C', value: 60, category: 2 },
        { id: 7, name: 'GROW', label: 'Growth Model', group: 'Team C', value: 60, category: 2 },
        { id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', value: 100, category: 1 },
        { id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', value: 80, category: 2 },
        { id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', value: 20, category: 1 },
        { id: 11, name: 'REPT', label: 'Reporting', group: 'Team E', value: 240, category: 4 },
        { id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', value: 30, category: 1 },
        { id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team A', value: 40, category: 0 }
      ], links: [
        { source: 1, target: 3 },
        { source: 6, target: 1 },
        { source: 7, target: 1 },
        { source: 9, target: 1 },
        { source: 2, target: 4 },
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
    }
      ;

  }

  componentDidMount() {
    // console.log("D3 FORRCE CHART componentDidUpdate ", this.props);
    // this.chart(this.props.nodes, this.props.links, this.props.relationSelected);
    this.chart(this.dataset, this.lastNodeId);
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  componentDidUpdate() {
    // // this.init();
    // // this.updateData(this.props.data);
    // console.log("componentDidUpdmate", this.props);
    this.chart(this.dataset, this.lastNodeId);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // // console.log("ForcePage, shouldComponentUpdate", !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links && nextProps.relationSelected === this.props.relationSelected))
  //   // return !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links);
  // }

  onResize = () => {
    this.chart(this.dataset, this.lastNodeId);
  }

  chart(dataset, lastNodeId) {


    const element = this.viz || document.querySelector('body');
    d3.select(element).selectAll("*").remove();
    const margin = { top: 0, right: 5, bottom: 0, left: 5 };
    // set up SVG for D3
    const width = element.offsetWidth - (margin.left + margin.right) * 2;
    const height = 700;
    // const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
      .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
      .range(['#ff9e6d', '#86cbff', '#c2e5a0', '#fff686', '#9e79db']);

    let valueExtent = d3.extent(dataset.nodes, (dataset.nodes, d => d.value));
    const lineWidthScale = d3.scaleLinear()
      .domain(valueExtent)
      .range([17, 50]);

    const svg = d3.select(element)
      .append("svg")
      // .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      ;

    svg.append("text")
      .text("Chart example v2")
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
    // init D3 force layout
    const force = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(d => d.id)
        .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes. 
      // .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .force('x', d3.forceX().x(function (d) {
        return width / 2
      }).strength(0.1))
      .force('y', d3.forceY().y(d => {
        return yCenter[d.category]
      }).strength(0.5))
      .force('collision', d3.forceCollide().radius(function (d) {
        return 17 + d.value / 10;
      }))
      .on('tick', ticked);



    svg.append('defs')
      .append('marker')
      .attr("id", 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr('refX', 0) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
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
    let mousedownNode = null;
    let mouseupNode = null;

    function resetMouseVars() {
      mousedownNode = null;
      mouseupNode = null;
      mousedownLink = null;
    }

    // update force layout (called automatically each iteration)
    function ticked() {

      path
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr('transform', (d) => `translate(${d && d.x ? d.x : d3.mouse[0]},${d && d.y ? d.y : d3.mouse[1]})`);
    }

    // update graph (called when needed)
    function restart() {
      // path (link) group
      path = path.data(dataset.links);


      // remove old links
      path.exit().remove();

      // add new links
      path = path.enter().append('line')
        .attr('class', 'link')
        .classed('selected', (d) => d === selectedLink)
        // .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        // .style('marker-end', 'url(#arrowhead)')
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
        .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
        // .classed('reflexive', (d) => d.reflexive)
        ;

      // remove old nodes
      node.exit().remove();

      // add new nodes
      const circle = node.enter().append('g');

      circle.append('circle')
        .attr('class', 'node')
        .attr('r', d => lineWidthScale(d.value))// 17)// d => lineWidthScale(d.value))
        // .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))\

        .style("fill", d => colors(d.group))
        .style("stroke-opacity", 0.3)
        .style('stroke', 'grey')//(d) => d3.rgb(colors(d.id)).darker().toString())
        .style("stroke-width", d => d.value / 10)//lineWidthScale(d.value))//d.value/10)
        // .classed('reflexive', (d) => d.reflexive)
        // .on('mouseover', function (d) {
        //   if (!mousedownNode || d === mousedownNode) return;
        //   // enlarge target node
        //   d3.select(this).attr('transform', 'scale(1.1)');
        // })
        .on('mouseout', function (d) {
          if (!mousedownNode || d === mousedownNode) return;
          // unenlarge target node
          d3.select(this).attr('transform', '');
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;

          // select node
          mousedownNode = d;
          selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
          selectedLink = null;

          // reposition drag line
          dragLine
            .style('marker-end', 'url(#arrowhead)')
            .classed('hidden', false)
            .attr("x1", mousedownNode.x)
            .attr("y1", mousedownNode.y)
            .attr("x2", mousedownNode.x)
            .attr("y2", mousedownNode.y);
          // .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

          restart();
        })
        .on('mouseup', function (d) {
          if (!mousedownNode) return;
          console.log("d",d,"mousedownNode",mousedownNode);
          // needed by FF
          dragLine
            .classed('hidden', true)
            .style('marker-end', '');
          
          // check for drag-to-self
          mouseupNode = d;

          // if(mouseupNode !== mousedownNode){
          //   mouseupNode.value = mousedownNode.value + mouseupNode.value;
          //   dataset.nodes.map(d => {
          //     if(d.id === mouseupNode.id){
          //       return d.value = mousedownNode.value
          //     }
          //   })
          // } 

          dataset.nodes.map(d=>{
            if(d.id === mouseupNode.id){
              return d.value = mousedownNode.value + d.value
            } 
            });
          if (mouseupNode === mousedownNode) {
            resetMouseVars();
            return;
          }

          // unenlarge target node
          d3.select(this).attr('transform', '');

          // add link to graph (update if exists)
          // NB: links are strictly source < target; arrows separately specified by booleans
          const isRight = mousedownNode.id < mouseupNode.id;
          const source = isRight ? mousedownNode : mouseupNode;
          const target = isRight ? mouseupNode : mousedownNode;

          const link = dataset.links.filter((l) => l.source === source && l.target === target)[0];
          if (link) {
            // link[isRight ? 'right' : 'left'] = true;
          } else {
            dataset.links.push({
              source, target, //left: !isRight, right: isRight
            });
          }

          // select new link
          selectedLink = link;
          selectedNode = null;
          restart();
        });


      circle.append("text")
        .attr("dy", 0)
        .attr("dx", 0)
        .text(d => d.name);
      circle.append("text")
        .attr("dy", 12)
        .attr("dx", 0)
        .text(d => d.value);

      node = circle.merge(node);

      // set the graph in motion
      force
        .nodes(dataset.nodes)
        .force('link').links(dataset.links);

      force.alphaTarget(0.3).restart();
    }

    // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).

    //When the drag gesture starts, the targeted node is fixed to the pointer
    //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
    function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
      d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
      d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }

    //When the drag gesture starts, the targeted node is fixed to the pointer
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragend(d) {
      if (!d3.event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    function mousedown() {
      // because :active only works in WebKit?
      svg.classed('active', true);

      if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;

      // insert new node at point
      const point = d3.mouse(this);
      console.log("point,", point);
      //id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', value: 20, category:2
      const node = { id: ++lastNodeId, x: point[0], y: point[1], value: 40, name: 'new node', label: 'new node', category: 2, group: 'Team C', };//reflexive: false,
      dataset.nodes.push(node);

      restart();
    }

    function mousemove() {
      if (!mousedownNode) return;

      // update drag line
      dragLine
        // .style('marker-end', 'url(#arrowhead)')
        .attr("x1", mousedownNode.x)
        .attr("y1", mousedownNode.y)
        .attr("x2", d3.mouse(this)[0])
        .attr("y2", d3.mouse(this)[1]);
      // .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
    }

    function mouseup() {
      if (mousedownNode) {
        // hide drag line
        dragLine
          .classed('hidden', true)
          .style('marker-end', '');
      }

      // because :active only works in WebKit?
      svg.classed('active', false);

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
        // case 66: // B
        // if (selectedLink) {
        //   // set link direction to both left and right
        //   // selectedLink.left = true;
        //   // selectedLink.right = true;
        // }
        //   restart();
        //   break;
        // case 76: // L
        // if (selectedLink) {
        //   // set link direction to left only
        //   selectedLink.left = true;
        //   selectedLink.right = false;
        // }
        //   restart();
        //   break;
        // case 82: // R
        // if (selectedNode) {
        //   // toggle node reflexivity
        //   // selectedNode.reflexive = !selectedNode.reflexive;
        // }
        // else if (selectedLink) {
        //   // set link direction to right only
        //   selectedLink.left = false;
        //   selectedLink.right = true;
        // }
        // restart();
        // break;
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


  render() {
    return (
      <div className="d3-chart-wrapper " id='forceSvg' ref={viz => (this.viz = viz)}>
      </div>
    );
  }
}



export default D3ForceChart;