export type CountrySelectItem = {
  value: string;
  label: string;
  countryCode: string;
  phoneLength: string;
  calling_code?: string;
  id: string;
};

export type CountryMap = Record<string, Country>;
export type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
  countryCode?: string;
};
