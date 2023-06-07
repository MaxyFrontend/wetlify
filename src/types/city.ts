export default interface city {
    type: string
    active?: boolean
    bbox: number[]
    geometry: {
      coordinates: [number, number]
      type: string
    }
    properties: {
      address_line1: string
      address_line2: string
      category: string
      city: string
      country: string
      county: string
      formatted: string
      lat: number
      lon: number
      name: string
      place_id: string
      postcode: string
      region: string
      result_type: string
      state: string
      timezone: {
        name: string
        offset_DST: string
        offset_DST_seconds: number
        offset_STD: string
        offset_STD_seconds: number
      }
    }
  }