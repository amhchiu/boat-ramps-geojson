import { stylesheet } from 'typestyle';
import { BasePadding, BaseFont } from './constants';

export default stylesheet({
  container: {
    padding: `0px ${BasePadding}px`,
    textAlign: 'center'
  },
  header: {
    transition: 'font-size .2s',
    fontWeight: 'bold',
    $nest: {
      '@media only screen and (min-width: 0px) and (max-width: 960px)': {
        fontSize: BaseFont * 2
      },
      '@media only screen and (min-width: 961px)': {
        fontSize: BaseFont * 3
      }
    }
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bolder'
  },
  chart: {
    border: 'solid',
    height: '500px'
  }
});
