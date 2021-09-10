import React, { Component } from "react";
// import { Link } from "react-router-dom";
import "./ForcePage.css";
// import * as d3 from 'd3';
// import D3ForceChart from "../../compoonents/D3forceChart";
import D3ForceChartUpdatable from "../../compoonents/D3ForceChartUpdatable";
import DataJson from '../../data/data_v1.json';


export default class ForcePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: undefined,
      links: undefined,
    };

  }

  componentDidMount() {
    // let link = "http://206.81.3.205:8080/";

    // fetch(link)
    //   .then(data => data.json())

    //   // d3.json(link)
    //   .then((data) => {
    //     // data = JSON.parse(JSON.stringify(data));
    //     // console.log("RAW DATA !!!: ", data);
    //     // let data = graph;
    let data = DataJson;

    let nodes = [];

    let links = [];

    for (let [key, value] of Object.entries(data)) { //[key, value]
      let id = key;
      let email = value.email;
      let avatar = value.avatar;
      let name = value.name;
      let messageAmount;

      let values = Object.entries(value.relations);
      messageAmount = values.reduce((acc, d, i, arr) => {
        acc.value = acc.value + d[1].value;
        return acc
      }, {
        value: 0
      });
      let obj = {
        id,
        name,
        email,
        avatar,
        contacts: values,
        contactCount: values.length,
        // values
        messageAmount
      }
      nodes.push(obj);
    };

    let linksBySourceAndTarget = {};

    for (let [key, value] of Object.entries(data)) {
      let source = key;
      let targets = Object.entries(value.relations);
      let link;
      let sum;
      for (let [k, v] of targets) {

        link = {
          source,
          target: k,
          values: v
        }
        if (!linksBySourceAndTarget[`${link.source}-${link.target}`]) {
          linksBySourceAndTarget[`${link.source}-${link.target}`] = link;
          linksBySourceAndTarget[`${link.target}-${link.source}`] = link;
          sum = links.push(link);
        } else {
          linksBySourceAndTarget[`${link.source}-${link.target}`].values.value =
            linksBySourceAndTarget[
              `${link.source}-${link.target}`].values.value + link.values.value;

        }
      };
    };
    nodes.sort((a, b) => b.messageAmount.value - a.messageAmount.value);
    // console.log("links", links);
    // console.log("nodes", nodes);

    this.setState({ nodes: JSON.parse(JSON.stringify(nodes)), links: JSON.parse(JSON.stringify(links)) })
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       // this.setState({ dataForce: [] })
    //       this.setState({ nodes: [], links: [] })
    //     });
    //   // this.setState({allMachines: machines});
  }

  render() {
    // console.log("this.state.nodes", this.state.nodes, "this.state.links", this.state.links);

    return (
      <div className="ForcePage">
        <div className="force-wrapper">
          {/* {!!(this.state.nodes && this.state.links) && (
            <D3ForceChart
              nodes={this.state.nodes}
              links={this.state.links}
              relationSelected={'value'}
            />
          )} */}
          <div>
          <p>Click in the open space to <strong>add a node</strong>, drag from one node to another to <strong>add an edge</strong>.<br/>
          Ctrl-drag a node to <strong>move</strong> the graph layout.<br/>
          Click a node to <strong>select</strong> it.</p>
          </div>
          <D3ForceChartUpdatable/>
          </div>
        </div>
        );
  }
}
