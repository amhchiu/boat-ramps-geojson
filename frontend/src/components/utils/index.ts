
/**
 * Returns the colour associated with a material
 * @param material Material property of the Boat Ramp Feature
 */
export const filterColourFromMaterialSelection = (material: string) => {
  let newColour = '';
  switch (material) {
    case 'Gravel':
      newColour = 'yellow';
      break;
    case 'Concrete':
      newColour = 'gray';
      break;
    case 'Bitumen':
      newColour = 'orange';
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
