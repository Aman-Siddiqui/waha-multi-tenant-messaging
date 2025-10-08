import { WahaServiceMock } from './mocks/waha.service.mock';

describe('WAHA Service Mock', () => {
  it('should return mock send result', async () => {
    const res = await WahaServiceMock.sendMessage();
    expect(res).toEqual({ success: true, id: 'mock-msg-1' });
  });
});
