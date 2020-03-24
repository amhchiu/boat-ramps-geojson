import { style, stylesheet } from 'typestyle';
import { sizes } from './theme';

const fontSize = (value: number | string) => {
  const valueStr = typeof value === 'string' ? value : value + 'px';
  return {
    fontSize: valueStr
  }
}

const headerRowFont = style(
  fontSize(24),
  { fontWeight: 'bold'},
  { textAlign: 'center' }
);

const materialRowFont = style(
  fontSize(16),
  { textAlign: 'center' }
)

const materialChartClass = style(
  {border: 'solid'},
  {height: '500px' }
)

const fontStyles = stylesheet({
  titleFont: {
    fontWeight: 'bold',
    fontSize: 24
  },
  headerFont: {
    fontSize: 16
  }
});

namespace fontSizes {
  export let base = 12;
}
