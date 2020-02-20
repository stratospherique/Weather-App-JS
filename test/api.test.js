import ApiFetcher from '../src/api-fetching';

describe('Testing data fetching', () => {
  it('fetches data from good input', () => {
    ApiFetcher.weatherCondition('monastir,tn').then((data) => {
      expect(data.name).toBe('Monastir');
    });
  });
  it.only('fetches data with incorrect input', () => {
    ApiFetcher.weatherCondition('tn').then((err) => {
      expect(err).toEqual({
        cod: '404',
        message: 'city not found',
      });
    });
  });
});