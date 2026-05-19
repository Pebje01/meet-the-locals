/**
 * Gedeelde taxonomie voor het blogfilter.
 * Wordt gebruikt door de Posts-collectie (Payload select-opties) en door
 * het BlogExplorer-filtercomponent, zodat labels en waarden niet uiteenlopen.
 */

export type TaxonomyOption = {
  label: string
  value: string
}

export const WERELDDEEL_OPTIONS: TaxonomyOption[] = [
  { label: 'Europa', value: 'europe' },
  { label: 'Azië', value: 'asia' },
  { label: 'Noord-Amerika', value: 'north-america' },
  { label: 'Zuid-Amerika', value: 'south-america' },
  { label: 'Afrika', value: 'africa' },
  { label: 'Oceanië', value: 'oceania' },
  { label: 'Midden-Oosten', value: 'middle-east' },
]

export const THEMA_OPTIONS: TaxonomyOption[] = [
  { label: 'Reisfotografie', value: 'reisfotografie' },
  { label: 'Food', value: 'food' },
  { label: 'Accommodaties', value: 'accommodaties' },
  { label: 'Reisverhalen & routes', value: 'reisverhalen-routes' },
  { label: 'Reistips & praktisch', value: 'reistips-praktisch' },
  { label: 'Natuur & buiten', value: 'natuur-buiten' },
]

export function labelFor(
  options: TaxonomyOption[],
  value: string | null | undefined,
): string {
  return options.find((option) => option.value === value)?.label ?? ''
}
