export const WahaServiceMock = {
    sendMessage: jest.fn().mockResolvedValue({ success: true, id: 'mock-msg-1' }),
    createSession: jest.fn().mockResolvedValue({ id: 'default', status: 'running' }),
  };
  