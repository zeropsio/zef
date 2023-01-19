import { zefActionPayload } from './action';

describe('@zerops/zef/core/action', () => {
  it('Should return data when single object is passed in.', () => {
     expect(zefActionPayload({ id: 'foo' })).toMatchObject({ data: { id: 'foo' }});
  });
});
