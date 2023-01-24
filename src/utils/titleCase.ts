const LOWERS = [
  'A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'
];

export function titleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (s) => LOWERS.includes(s) ? s : s.charAt(0).toUpperCase() + s.substring(1)
  );
}