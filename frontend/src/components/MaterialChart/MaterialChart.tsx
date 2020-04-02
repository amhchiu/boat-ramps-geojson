import React, { useRef, useEffect, useState } from 'react';
import { select, scaleLinear, axisLeft, scaleBand, axisBottom, max, ascending } from 'd3';
import { IState, IRampsMaterial } from '../../constants/interfaces';
import { BasePadding } from '../../constants'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMaterial, clearSelectedMaterial, clearSelectedSizeCategory } from '../../actions/MapActions/mapActions';
import { filterColourFromMaterialSelection } from '../utils';

interface IProps {
  data: IRampsMaterial[],
  xLabel: string,
  yLabel: string
}

const CHART_HEIGHT = 400;
const CHART_WIDTH = 500;
/**
 * Calculate the width of the browser window so we can position
 * the chart in the center of its div
 */
// const getDivWidth = (id: string) => {
//   let el = document.getElementById(id);
//   return el ? el.clientWidth : 550;
// }

const MaterialChart = (props: IProps) => {

  const { data, xLabel, yLabel } = props;
  const dispatch = useDispatch();
  const selectedMaterial = useSelector((state: IState) => state.mapData.selectedMaterial)
  const d3Container = useRef(null);

  /**
   * Builds the d3 SVG bar chart from the ramps per material data from the Props
   */
  useEffect(() => {
    if (data.length > 0) {
      let keys = Object.keys(data[0]);
      const xValueName = keys[0],
        yValueName = keys[1];

      data.sort((a: IRampsMaterial, b: IRampsMaterial) => {
        return ascending(a.material, b.material);
      });

      const svg = select(d3Container.current);

      // Remove old D3 elements
      svg.selectAll('*').remove();

      // group element. shift elements by margin. right down. 0,0 
      const chart = svg.append('g')
      .attr('transform', `translate(${50}, ${20})`);

      // svg
      const yScale = scaleLinear()
        .domain([max(data, d => d.ramps) as number, 0])
        .range([0, CHART_HEIGHT]);

      // Band scale mapping.
      const xScale = scaleBand()
        .domain(data.map((value: any) => value[xValueName]))
        .range([0, CHART_WIDTH])
        .padding(0.25)

      // Add new group element yaxis to chart element
      chart.append('g')
        .call(axisLeft(yScale));

      /* svg translate is (down, right).
         Move x-axis to bottom (chart-height) of chart */  
      chart.append('g')
        .attr('transform', `translate(0, ${CHART_HEIGHT})`)
        .call(axisBottom(xScale));

      /*
       * selectAll elements -> empty []
       * data(): elements in DOM to be updated based on data.length
       * enter(): identifies missing elements
       * attr: add rectangle for every element of array
       * Select all the chart elements; and for each coordinate in the data
       * append a rectangle element with x and y values determined by the
       * xScale and yScale functions maps given domain value to the svg range
       * clicking a bar dispatches the selected material to store. reclick to clear selection.
       * Colour the bar based on selection
       */
      chart.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (value: IRampsMaterial | any) => xScale(value[xValueName]) as number)
        .attr('y', (value: IRampsMaterial | any) => yScale(value[yValueName] as number))
        .attr('height', (value: IRampsMaterial | any) => CHART_HEIGHT - yScale(value[yValueName] as number))
        .attr('width', xScale.bandwidth())
        .on('click', function (value: IRampsMaterial) {
          if (selectedMaterial === value.material) {
            dispatch(clearSelectedMaterial());
          }
          else {
            dispatch(clearSelectedSizeCategory());
            dispatch(setSelectedMaterial(value.material));
          }
        })
        .each(function (value: IRampsMaterial) {
          if (selectedMaterial === value.material) {
            select(this).style('fill', filterColourFromMaterialSelection(value.material));
          } else {
            select(this).style('fill', 'steelblue');
          }
        });

      chart.append('text')
        .attr('x', -(CHART_HEIGHT / 2))
        .attr('y', -BasePadding * 2)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yLabel);

      chart.append('text')
        .attr('x', CHART_WIDTH / 2)
        .attr('y', CHART_HEIGHT + 40)
        .attr('text-anchor', 'middle')
        .text(xLabel);
    }
  }, [data, selectedMaterial]);

  return (
    <>
      <svg
        id="material-chart"
        className="d3-barchart"
        width={'100%'}
        height={'100%'}
        ref={d3Container}
      />
    </>
  )
}

export default MaterialChart;