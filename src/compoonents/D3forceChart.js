import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import './D3forceChart.css';
import './D3forceChart.css';

class D3ForceChart extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //   };
        this.positions = {};
    }

    componentDidMount() {
        console.log("D3 FORRCE CHART componentDidUpdate ", this.props);
        this.chart(this.props.nodes, this.props.links, this.props.relationSelected);
        window.addEventListener('resize', this.onResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false);
    }

    componentDidUpdate() {
        // this.init();
        // this.updateData(this.props.data);
        console.log("componentDidUpdmate", this.props);
        this.chart(this.props.nodes, this.props.links, this.props.relationSelected);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("ForcePage, shouldComponentUpdate", !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links && nextProps.relationSelected === this.props.relationSelected))
        return !(nextProps.nodes === this.props.nodes && nextProps.links === this.props.links);
    }

    onResize = () => {
        this.chart(this.props.nodes, this.props.links, this.props.relationSelected);
    }

    chart(nodes_data, links_data, relationSelected) {
        // let that = this;
        const element = this.viz || document.querySelector('body');


        let staticNodesField = "value";
        let radius = 56;

        d3.select(element).selectAll("*").remove();

        // console.log("relationSelected", relationSelected);
        //calculates the array of messages, to define the scales for a line width
        let messagesArray = links_data.map((d) => {
            // console.log("relationSelected d",d.values);
            return d.values[relationSelected]
        });
        messagesArray.sort((a, b) => a - b)
        // console.log("messagesArray", messagesArray);

        let sortedLinks = links_data.filter((d) => {
            // console.log("d.values[relationSelected]",d.values[relationSelected] , 'relationSelected',relationSelected );
            return (d.values[relationSelected]) // !== undefined && d.values[relationSelected] !== 0
        });
        // console.log("sortedLinks", sortedLinks);

        var lineWidthScale = d3.scaleLinear()
            // .domain([0, d3.max(messagesArray, d => d)])
            .domain(d3.extent(messagesArray, (messagesArray, d => d)))
            .range([0.5, 8]);

        var weightScale = d3.scaleLinear()
            .domain(d3.extent(messagesArray, (messagesArray, d => d)))
            .range([.1, 10]);

        var linkStrengthScale = d3.scaleLinear()
            .range([0, 0.45]);

        linkStrengthScale.domain(d3.extent(sortedLinks, function (d) {
            if (d && d.values[relationSelected] && d.values[relationSelected] !== 0) {
                // console.log("d.values", d.values);
                return d.values[relationSelected];
            }
        }));

        // let distance = radius * 2;
        let minMsgCount = d3.min(links_data, d => d.values[relationSelected]) || 0;
        let maxMsgCount = d3.max(links_data, d => d.values[relationSelected]) || 0;
        var nodeDistanceScale = d3
            .scaleSqrt() // .scaleSqrt() // .scaleLinear() .scalePow() // .scaleLog() 
            // .domain([0, d3.max(messagesArray, d => d)])
            .domain([minMsgCount, maxMsgCount])
            .range([radius * 3, 0]); // 100 => 10, 144 => 12 // 1,100,200 > 1,10,14

        //create somewhere to put the force directed graph

        let width = element.offsetWidth;
        let height = 700;

        var svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var drag = d3.drag()
            .on("start", dragstart)
            .on("drag", dragged)
            .on("end", dragended);

        //draw lines for the links
        var link = svg.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(sortedLinks)
            .enter().append("line")
            .attr("stroke-width", (d) => {
                // console.log("lineWidthScale(d.values[relationSelected])", d.values[relationSelected]);
                return weightScale(d.values[relationSelected])
            })
            // .attr('marker-end', 'url(#arrowhead)')
            ;

        //draw nodes for the links
        var node = svg.append("g")
            .attr("class", "nodeG")
            .selectAll("g")
            .data(nodes_data)
            .enter()
            .append("g")
            .classed("node", true)
            // .classed("fixed", d => d.fx !== undefined)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseOut)

        node.call(drag);

        // node.on("click", click);


        //draw circles for the nodes
        var circle = node.append("circle")
            .attr("r", radius / 2)
            .attr("class", "circle");


        var defs = svg.append("defs");
        defs
            // .append("g+\]
            .append("clipPath")
            .attr("id", "avatar-clip")
            .append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", (radius / 2)); //(radius / 2))

        //draw avatar for the nodes
        var avatar = node.append("image")
            .attr("class", "avatar")
            .attr("xlink:href", (d) => d.avatar)
            //https://github.com/favicon.ico
            .attr("x", -(radius / 2))
            .attr("y", -(radius / 2))
            .attr("width", radius)
            .attr("height", radius)
            .attr("clip-path", "url(#avatar-clip)");



        var filter = svg.append("defs")
            .append("filter")
            .attr("id", "blur")
            .append("feGaussianBlur")
            .attr("stdDeviation", 1.3);

        // var lablelRectShadow = node.append("rect")
        //     .attr("class", "lablelRect-shadow")
        //     .attr('x', (d) => {
        //         let name = d.name;
        //         let nameArr = name.split(/(\s+)/).filter(function (e) {
        //             return e.trim().length > 0;
        //         });
        //         let cuttedname = nameArr[0] + " " + nameArr[1].slice(0, 1) + ".";
        //         // console.log(getTextWidth(d.cuttedname, 12, 'Roboto'));
        //         return 0 - ((getTextWidth(cuttedname, 12, 'Roboto') / 2) + 8)
        //     })
        //     .attr('y', 32)
        //     .attr('width', (d) => {
        //         let name = d.name;
        //         let nameArr = name.split(/(\s+)/).filter(function (e) {
        //             return e.trim().length > 0;
        //         });
        //         let cuttedname = nameArr[0] + " " + nameArr[1].slice(0, 1) + ".";
        //         // console.log(getTextWidth(d.cuttedname, 12, 'Roboto'));
        //         return getTextWidth(cuttedname, 12, 'Roboto') + 16
        //     })
        //     .attr('height', 18)
        //     // .attr('fill','red')
        //     .attr("rx", 3)
        //     .attr("ry", 3)
        //     .attr("filter", "url(#blur)").style('visibility', "hidden");

        var lablelRect = node.append("rect")
            .attr("class", "lablelRect")
            .attr('x', (d) => {
                let name = d.name;
                let nameArr = name.split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                });
                let cuttedname = nameArr[0] + " " + nameArr[1].slice(0, 1) + ".";
                // console.log(getTextWidth(d.cuttedname, 12, 'Roboto'));
                return 0 - ((getTextWidth(cuttedname, 12, 'Roboto') / 2) + 8)
            })
            .attr('y', 32)
            .attr('width', (d) => {
                let name = d.name;
                let nameArr = name.split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                });
                let cuttedname = nameArr[0] + " " + nameArr[1].slice(0, 1) + ".";
                // console.log(getTextWidth(d.cuttedname, 12, 'Roboto'));
                return getTextWidth(cuttedname, 12, 'Roboto') + 16
            })
            .attr('height', 18)
            // .attr('fill','red')
            .attr("rx", 3)
            .attr("ry", 3)
            //   .attr("filter", "url(#blur)")
            ;

        //draw labels for the nodes
        var lablel = node.append("text")
            .attr("class", "lablel")
            .text((d) => {
                let name = d.name;
                let nameArr = name.split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                });
                let cuttedname = nameArr[0] + " " + nameArr[1].slice(0, 1) + ".";
                // return cuttedname;
                return cuttedname; // change to cuttedname !!!
            })
            .attr('x', 0)
            .attr('y', 45);

        // //draw messageCount for the nodes
        // var messageRectShadow = node.append("rect")
        //     .attr("class", "messageRect-shadow")
        //     .attr('x', 17)
        //     .attr('y', -40)
        //     .attr('width', (d) => getTextWidth(d.messageAmount[relationSelected], 10, 'Roboto') +
        //         6) //d.values[relationSelected]
        //     .attr('height', 13)
        //     // .attr('fill','red')
        //     .attr("rx", 3)
        //     .attr("ry", 3)
        //     .attr("filter", "url(#blur)").style('visibility', "hidden");

        // var dialogueTriangleShadow = node
        //     .append('g')
        //     .attr('transform', 'translate(20 -28)')
        //     .append('path')
        //     .attr('class', 'dialogue-triangle-shadow')
        //     .attr('d', 'M1 0 L0 5 L5 0 Z')
        //     .attr("filter", "url(#blur)").style('visibility', "hidden")
        //     // .attr('fill', 'red')
        //     // .attr("stroke", "black")
        //     // .attr("stroke-width", 2)
        //     ;

        // var messageRect = node.append("rect")
        //     .attr("class", "messageRect")
        //     .attr('x', 17)
        //     .attr('y', -40)
        //     .attr('width', (d) => getTextWidth(d.messageAmount[relationSelected], 10, 'Roboto') +
        //         6) //d.values[relationSelected]
        //     .attr('height', 13)
        //     // .attr('fill','red')
        //     .attr("rx", 3)
        //     .attr("ry", 3)
        //     //   .attr("filter", "url(#blur)")
        //     ;

        // var dialogueTriangle = node
        //     .append('g')
        //     .attr('transform', 'translate(20 -28)')
        //     .append('path')
        //     .attr('class', 'dialogue-triangle')
        //     .attr('d', 'M1 0 L0 5 L5 0 Z')
        //     //   .attr("filter", "url(#blur)")
        //     // .attr('fill', 'red')
        //     // .attr("stroke", "black")
        //     // .attr("stroke-width", 2)
        //     ;

        // var messageCount = node.append("text")
        //     .attr("class", "messageCount")
        //     .text(function (d) {
        //         return d.messageAmount[relationSelected]; // d.values[relationSelected]
        //     })
        //     .attr('x', 20)
        //     .attr('y', -30);


        //add forces
        //we're going to add a charge to each node
        //also going to add a centering force
        //and a link force
        var link_force = d3.forceLink(links_data)
            .id(d => d.id)
            .distance((d) => nodeDistanceScale(d.values["value"]) || radius);//.strength();relationSelected

        const forceX = d3.forceX(width / 2).strength(0.025);
        const forceY = d3.forceY(height / 2).strength(0.025);

        var simulation = d3.forceSimulation()
            //add nodes
            .nodes(nodes_data)
            .on("tick", tickActions)

            .force("link", link_force)
            // .alphaTarget(0).restart()
            .force("collide", d3.forceCollide().radius(radius * 1.5))
            // .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(-1000)) //.strength(1) //charge_force
            // .force("center", d3.forceCenter(width / 2, height / 2)) //width / 2, height / 2 //center_force
            .force("attraceForce", d3.forceManyBody().strength(-100)) //.force("attraceForce",d3.forceManyBody().strength(0));
            // .force('x', forceX)
            // .force('y', forceY)
            // .force("links", link_force);
            // .stop();//stop the simulation here
            // .force("links", link_force)
            // .force("link", d3.forceLink().distance((d)=>d.values[relationSelected]).strength(1))
            ;

        //add tick instructions:
        // simulation.on("tick", tickActions);
        // let isEqualCondition = false;
        // let iterationsAmmount = 300;
        // let timeout;
        // for (let i = 0; i < iterationsAmmount; ++i) {
        //     simulation.tick();
        //     // if (i === iterationsAmmount - 1) {
        //     if (timeout) {
        //         clearTimeout(timeout);
        //     }
        //     timeout = setTimeout(() => {
        //         isEqualCondition = false;
        //         if (!that.positions[staticNodesField]) {
        //             that.positions[staticNodesField] = {};
        //             nodes_data.forEach((d, i) => {
        //                 that.positions[staticNodesField][d.id] = {
        //                     ...d
        //                 };
        //             });
        //             // console.log("positions", that.positions);
        //         }
        //         // console.log("nodes_data ", nodes_data, ";   links_data ", links_data);
        //         // console.log("setTimeout");
        //     }, 500);
        //     // }
        // }; // in ^5.8.x >>> simulation.tick(300);
        // console.log("relationselected: ", relationSelected, "   that.positions: ", that.positions, );
        // simulation.stop();


        function dragstart() {
            // console.log("dragstart");
            // d3.select(this).classed("fixed", true);
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            node.each(function (d) {
                d.fx = d.x;
                d.fy = d.y;
            })
        }

        function dragged(d) {
            // console.log("dragged");
            d.fx = clamp(d3.event.x, 0 + radius, width - radius);
            d.fy = clamp(d3.event.y, 0 + radius, height - radius);
            // d.fx = d3.event.x;
            // d.fy = d3.event.y;
            // simulation.alphaTarget(0).restart();
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            // d.fx = d.x;
            // d.fy = d.y;
            // simulation.stop();
        }

        function tickActions() {

            node
                // .attr("cx", (d)=> clamp(d.x, radius, width - radius))
                // .attr("cy", (d)=> clamp(d.y, radius, height - radius));
                .attr("transform", (d) => {
                    d.x = clamp(d.x, radius, width - radius);
                    d.y = d.y = clamp(d.y, radius, height - radius);
                    return "translate(" + d.x + "," + d.y + ")";
                });

            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }
        // prevents nodes from being dragged outside the script boundaries
        function clamp(x, lo, hi) {
            return x < lo ? lo : x > hi ? hi : x;
        }



        var linkedById = {}
        sortedLinks.forEach(function (d) {
            linkedById[d.source.id + "," + d.target.id] = 1;
        });


        function isConnected(a, b) {
            return linkedById[a.id + "," + b.id] || linkedById[b.id + "," + a.id] || a.index === b.index;
        }

        function mouseOver(d) {


            var opacity = 0.3;
            node.style("stroke-opacity", function (o) {
                let thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            node.style("stroke", function (o) {
                let thisOpacity = isConnected(d, o)
                    ? "#C0D961"
                    : "#AF2E4E";
                return thisOpacity;
            });
            circle.style("stroke", function (o) {
                let thisOpacity = isConnected(d, o)
                    ? "#AF2E4E"
                    : "#AF2E4E";
                return thisOpacity;
            });
            link.style('stroke-opacity', function (o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style('stroke', function (o) {
                return o.source === d || o.target === d
                    ? "#AF2E4E"
                    : "#C0D961";
            });

            // messageRect.style('fill', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "#fff"
            //         : "#3D1D75";
            //     return thisOpacity;
            // })
            //     .attr("filter", (o) => {
            //         return o.source === d || o.target === d ? "url(#blur)" : "";
            //     });
            // dialogueTriangle.style('fill', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "#fff"
            //         : "#3D1D75";
            //     return thisOpacity;
            // })
            //     .attr("filter", (o) => {
            //         return o.source === d || o.target === d ? "url(#blur)" : "";
            //     });
            // messageCount.style('fill', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "#000000"
            //         : "#fff";
            //     return thisOpacity;
            // });

            // // shadows
            // messageRectShadow.style('visibility', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "visible"
            //         :
            //         "hidden";
            //     return thisOpacity;
            // });
            // dialogueTriangleShadow.style('visibility', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "visible"
            //         :
            //         "hidden";
            //     return thisOpacity;
            // });
            // lablelRectShadow.style('visibility', function (o) {
            //     let thisOpacity = isConnected(d, o)
            //         ? "visible"
            //         :
            //         "hidden";
            //     return thisOpacity;
            // });



        }

        var clickToggler = false;
        var wasClicked = true;

        // drag_handler(node)

        // function click(d) {
        //     // console.log("clickToggler: ", clickToggler, "wasClicked: ", wasClicked);
        //     wasClicked = !wasClicked;

        //     if (!clickToggler) {
        //         clickToggler = !clickToggler;
        //         var opacity = 0.3;
        //         node.style("stroke-opacity", function (o) {
        //             let thisOpacity = isConnected(d, o) ? 1 : opacity;
        //             return thisOpacity;
        //         });
        //         node.style("stroke", function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "#F7F7F7" : "#000000"
        //                 :
        //                 darkTheme ? "#828282" : "#3D1D75";
        //             return thisOpacity;
        //         });
        //         circle.style("stroke", function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "#F7F7F7" : "#000000"
        //                 :
        //                 darkTheme ? "#828282" : "#3D1D75";
        //             return thisOpacity;
        //         });
        //         link.style('stroke-opacity', function (o) {
        //             return o.source === d || o.target === d ? 1 : opacity;
        //         });
        //         link.style('stroke', function (o) {
        //             return o.source === d || o.target === d
        //                 ?
        //                 darkTheme ? "#F7F7F7" : "#000000"
        //                 :
        //                 darkTheme ? "#828282" : "#828282";
        //         });
        //         messageRect.style('fill', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ? // 6F6F6F
        //                 darkTheme ? "#6F6F6F" : "#fff"
        //                 :
        //                 darkTheme ? "#bdbdbd" : "#3D1D75";
        //             return thisOpacity;
        //         })
        //             .attr("filter", (o) => {
        //                 return o.source === d || o.target === d ? "url(#blur)" : "";
        //             });
        //         dialogueTriangle.style('fill', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "#6F6F6F" : "#fff"
        //                 :
        //                 darkTheme ? "#bdbdbd" : "#3D1D75";
        //             return thisOpacity;
        //         })
        //             .attr("filter", (o) => {
        //                 return o.source === d || o.target === d ? "url(#blur)" : "";
        //             });
        //         messageCount.style('fill', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "#f2f2f2" : "#000000"
        //                 :
        //                 darkTheme ? "#222222" : "#fff";
        //             return thisOpacity;
        //         });

        //         // shadows
        //         messageRectShadow.style('visibility', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "hidden" : "visible"
        //                 :
        //                 "hidden";
        //             return thisOpacity;
        //         });
        //         dialogueTriangleShadow.style('visibility', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "hidden" : "visible"
        //                 :
        //                 "hidden";
        //             return thisOpacity;
        //         });
        //         lablelRectShadow.style('visibility', function (o) {
        //             let thisOpacity = isConnected(d, o)
        //                 ?
        //                 darkTheme ? "hidden" : "visible"
        //                 :
        //                 "hidden";
        //             return thisOpacity;
        //         });


        //         if (darkTheme) {
        //             lablelRect.style('fill', function (o) {
        //                 let thisOpacity = isConnected(d, o) ? "#6f6f6f" : "#131313";
        //                 return thisOpacity;
        //             })
        //         }

        //     } else {
        //         clickToggler = !clickToggler;
        //         node.style("stroke-opacity", 1);
        //         node.style("fill-opacity", 1);
        //         circle.style("stroke", darkTheme ? "#222222" : "#3D1D75");
        //         link.style("stroke-opacity", 0.3);
        //         link.style("stroke", darkTheme ? "#828282" : "#503483");
        //         messageRect.style('fill', darkTheme ? "#bdbdbd" : "#3D1D75");
        //         dialogueTriangle.style('fill', darkTheme ? "#bdbdbd" : "#3D1D75");
        //         messageCount.style('fill', darkTheme ? "#222222" : "#fff");
        //         //shadows
        //         messageRectShadow.style('visibility', "hidden");
        //         dialogueTriangleShadow.style('visibility', "hidden");
        //         lablelRectShadow.style('visibility', "hidden");

        //         if (darkTheme) {
        //             lablelRect.style('fill', "#131313")
        //         }

        //     }
        // }

        function mouseOut() {
            if (wasClicked) {
                node.style("stroke-opacity", 1);
                node.style("fill-opacity", 1);
                circle.style("stroke", "#AF2E4E");
                link.style("stroke-opacity", 0.3);
                link.style("stroke", "#C0D961");
                // messageRect.style('fill', "#3D1D75");
                // dialogueTriangle.style('fill', "#3D1D75");
                // messageCount.style('fill', "#fff");
                // //shadows
                // messageRectShadow.style('visibility', "hidden");
                // dialogueTriangleShadow.style('visibility', "hidden");
                // lablelRectShadow.style('visibility', "hidden");


            }
        }

        function getTextWidth(text, fontSize, fontName) {
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');
            ctx.font = fontSize + ' ' + fontName;
            // console.log("WIDTH:", text, ctx.measureText(text).width);
            return ctx.measureText(text).width;
        } // getTextWidth(d, '12px', 'myriad-pro-condensed, robotoCondensed-light, sans-serif');


    }


    render() {
        return (
            <div className="d3-chart-wrapper " id='forceSvg' ref={viz => (this.viz = viz)}>
            </div>
        );
    }
}



export default D3ForceChart;