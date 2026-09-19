export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface State {
  id: string;
  code: string;
  name: string;
  slug: string;
  type: string;
  country: string;
}

export interface StateQuery {
  search?: string;
  code?: string;
  slug?: string;
  type?: string;
  countryCode?: string;
  page?: number;
  limit?: number;
}
