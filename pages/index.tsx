import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import { select, scaleLinear, line } from "d3";

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let data = [];
    let features = ["Cognitive Overload", "B", "C", "D", "E", "F"];
    //generate the data
    for (var i = 0; i < 3; i++) {
      var point: { [key: string]: number } = {};
      //each feature will be a random number from 1-9
      features.forEach((f) => (point[f] = 1 + Math.random() * 8));
      data.push(point);
    }
    console.log(data);

    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    let svg = select(containerRef.current)
      .append("svg")
      .attr("width", 600)
      .attr("height", 600);

    let radialScale = scaleLinear().domain([0, 10]).range([0, 250]);
    let ticks = [2, 4, 6, 8, 10];

    ticks.forEach((t) =>
      svg
        .append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("opacity", 0.3)
        .attr("r", radialScale(t))
    );

    ticks.forEach((t) =>
      svg
        .append("text")
        .attr("x", 305)
        .attr("y", 306 - radialScale(t))
        .text(t.toString())
    );

    function angleToCoordinate(angle: number, value: number) {
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      return { x: 300 + x, y: 300 - y };
    }

    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      let line_coordinate = angleToCoordinate(angle, 10);
      let label_coordinate = angleToCoordinate(angle, 11);
      console.log(label_coordinate)

      //draw axis line
      svg
        .append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke", "black");

      //draw axis label
      svg
        .append("svg:image")
        // .append("text")
        .attr("x", label_coordinate.x-20)
        .attr("y", label_coordinate.y-20)
        // .text(ft_name);
        .attr("width", 40)
        .attr("height", 40)
        .attr("xlink:href", "https://www.cowryconsulting.com/hubfs/Cognitive%20overload-1.svg");
    }

    let l = line<any>()
      .x((d) => d.x)
      .y((d) => d.y);
    let colors = ["darkorange", "gray", "navy"];

    function getPathCoordinates(data_point: any) {
      let coordinates = [];
      for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }

    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      let color = colors[i];
      let coordinates = getPathCoordinates(d);

      //draw the path element
      svg
        .append("path")
        .datum(coordinates)
        .attr("d", l)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="border-b pb-2">My demo chart</h1>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Home;
