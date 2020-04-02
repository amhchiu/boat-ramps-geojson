import { cssRule } from 'typestyle';
import { BasePadding } from '../../constants';

cssRule('table',
  {
    borderCollapse: 'collapse',
    width: '100%'
  }
);

cssRule('td, th', {
  border: '1px solid #ddd',
  textAlign: 'center',
  padding: BasePadding / 2
})