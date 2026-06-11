import geo from 'bd-divisions-to-unions';

export function getDivisions(lang: 'en' | 'bn' = 'en') {
  return geo.getAllDivision(lang) || [];
}

export function getDistricts(divisionId: string | number, lang: 'en' | 'bn' = 'en') {
  if (!divisionId) return [];
  const districts = geo.getAllDistrict(lang);
  return districts[divisionId] || [];
}

export function getUpazilas(districtId: string | number, lang: 'en' | 'bn' = 'en') {
  if (!districtId) return [];
  const upazilas = geo.getAllUpazila(lang);
  return upazilas[districtId] || [];
}

