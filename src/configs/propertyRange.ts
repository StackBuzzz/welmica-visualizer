type ranges = 'glossyness' | 'roughness';

type RangeConfigs = Record<ranges, Range>;

type Range = {
  min: number;
  max: number;
};

export const propertyRange: RangeConfigs = {
  glossyness: {
    min: 0,
    max: 1
  },
  roughness: {
    min: 0,
    max: 100
  }
};
