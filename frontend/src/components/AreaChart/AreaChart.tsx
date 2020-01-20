import React, { useRef, useEffect } from 'react';
import { select, scaleLinear, axisLeft, scaleBand, axisBottom, max, selectAll, ascending } from 'd3';
import { IState, IRampsArea } from '../../constants/interfaces';
import { theme } from '../../constants'
import './AreaChart.css';
import { useDispatch, useSelector } from 'react-redux';
import { filterColourFromSizeCategorySelection } from '../utils';
import { clearSelectedSizeCategory, setSelectedSizeCategory, clearSelectedMaterial } from '../../actions/MapActions/mapActions';

interface IProps {
  data: IRampsArea[],
  xLabel: string,
  yLabel: string
}

const CHART_MARGIN = theme.sizes.padding * 4;
const CHART_HEIGHT = 400;
const CHART_WIDTH = 550;

/**
 * TODO: 
 * - Number of ramps per construction material
 * - Number of ramps per size category (categories are areas in 3 different ranges [0,50], [50,200], [200,526])
 * @param props 
 */
const BarChart = (props: IProps) => {

  const { data, xLabel, yLabel } = props;
  const dispatch = useDispatch();
  const selectedSizeCategory = useSelector((state: IState) => state.mapData.selectedSizeCategory);
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      let keys = Object.keys(data[0]);
      const xValueName = keys[0],
        yValueName = keys[1];
      
      data.sort((a: IRampsArea, b: IRampsArea) => {
        let a1 = a.area.split('-');
        let b1 = b.area.split('-');
        if (parseInt(b1[0]) > parseInt(a1[0])) return -1;
        else return 1;
      });
      
      const svg = select(d3Container.current);

      // Remove old D3 elements
      svg.selectAll('*').remove();

      // group element. shift elements by margin. right down. 0,0 
      const chart = svg.append('g').attr('transform', `translate(${CHART_WIDTH / 2}, ${CHART_HEIGHT / 4})`);

      /**
       * SVG coordinate system starts on top left! 
       * Map max to 
       *  */
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

      chart.append('g')
        .attr('transform', `translate(0, ${CHART_HEIGHT})`)
        .call(axisBottom(xScale));

      /**
       * selectAll elements -> empty []
       * data(): elements in DOM to be updated based on data.length
       * enter(): identifies missing elements
       * attr: add rectangle for every element of array
       */
      chart.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (value: IRampsArea | any) => xScale(value[xValueName]) as number)
        .attr('y', (value: IRampsArea | any) => yScale(value[yValueName] as number))
        .attr('height', (value: IRampsArea | any) => CHART_HEIGHT - yScale(value[yValueName] as number))
        .attr('width', xScale.bandwidth())
        .on('click', function (value: IRampsArea) {
          console.log(selectedSizeCategory);
          console.log(value.area);
          if (selectedSizeCategory == value.area) clearSelectedSizeCategory(dispatch);
          else {
            clearSelectedMaterial(dispatch);
            setSelectedSizeCategory(value.area, dispatch);
          }
        })
        .each(function (value: IRampsArea) {
          if (selectedSizeCategory === value.area) {
            select(this).style('fill', filterColourFromSizeCategorySelection(value.area));
          } else {
            select(this).style('fill', 'steelblue');
          }
        });

      // Axis labels
      chart.append('text')
        .attr('x', -(CHART_HEIGHT / 2))
        .attr('y', -theme.sizes.padding * 2)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yLabel);

      chart.append('text')
        .attr('x', CHART_WIDTH / 2)
        .attr('y', CHART_HEIGHT + 40)
        .attr('text-anchor', 'middle')
        .text(xLabel);
    }
  }, [data, selectedSizeCategory]);


  const filterGeoDataWithSelection = (data: IRampsArea) => {

  };

  return (
    <>
      <svg
        className="d3-barchart"
        width={'100%'}
        height={'100%'}
        ref={d3Container}
      />
    </>
  )
}

export default BarChart;