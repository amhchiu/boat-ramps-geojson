
/**
 * Returns the colour associated with a material
 * @param material Material property of the Boat Ramp Feature
 */
export const filterColourFromMaterialSelection = (material: string) => {
  let newColour = '';
  switch (material) {
    case 'Gravel':
      newColour = 'red';
      break;
    case 'Concrete':
      newColour = 'gray';
      break;
    case 'Bitumen':
      newColour = 'black';
      break;
    case 'Interlock Conc Block':
      newColour = 'olive';
      break;
    case 'Other':
      newColour = 'teal';
      break;
    case 'Earth':
      newColour = 'green';
      break;
    default:
      newColour = 'steelblue';
      break;
  }
  return newColour;
}

/**
 * Returns the colour associated with a size category
 * @param sizeCategory size category property which the boat ramp area may fall under.
 */
export const filterColourFromSizeCategorySelection = (sizeCategory: string) => {
  let newColour = '';
  switch (sizeCategory) {
    case '0-50':
      newColour = 'salmon';
      break;
    case '50-200':
      newColour = 'fuchsia'
      break;
    case '200-526':
      newColour = 'maroon';
      break;
    default:
      newColour = 'steelblue';
      break;
  }
  return newColour;
}
