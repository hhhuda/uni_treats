import { requestClear, requestStandupStart, requestStandupActive, requestStandupSend, requestRegister, requestCreate, requestJoin, requestMessages } from './request';

const BAD = 400;
const FORBIDDEN = 403;

describe('standup/start/v1 tests', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let channelId3 = 0;
  let join = {};
  let result = { timeFinish: 0 };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user4 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    channelId2 = requestCreate(user2.token, 'Channeltwo', true).channelId;
    channelId3 = requestCreate(user2.token, 'Channelthree', true).channelId;
    join = requestJoin(user2.token, channelId);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful standup start request', async () => {
    result = requestStandupStart(user.token, channelId, 3);
    /* eslint-disable no-unused-vars */
    const result2 = requestStandupStart(user2.token, channelId2, 2);
    const result3 = requestStandupStart(user2.token, channelId3, 1);
    /* eslint-enable no-unused-vars */
    await new Promise((r) => setTimeout(r, 3000));
    expect(result3).toStrictEqual({ timeFinish: expect.any(Number) });
  });
  test('Successful standup start request - user in the channel but not an owner', async () => {
    result = requestStandupStart(user2.token, channelId, 2);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result).toStrictEqual({ timeFinish: expect.any(Number) });
  });
  test('Unsuccessful standup start request - user not in the channel', () => {
    result = requestStandupStart(user4.token, channelId, 3);
    expect(result).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup start request - channelId not valid', () => {
    result = requestStandupStart(user.token, 1234, 4);
    expect(result).toStrictEqual(BAD);
  });
  test('Unsuccessful standup start request - length not valid', () => {
    result = requestStandupStart(user.token, channelId, -5);
    expect(result).toStrictEqual(BAD);
  });
  test('Unsuccessful standup start request - session already in standup', async () => {
    result = requestStandupStart(user.token, channelId, 4);
    await new Promise((r) => setTimeout(r, 2000));
    const result2 = requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result2).toStrictEqual(BAD);
  });
  test('Successful standup start request - session already in standup, but it ended', async () => {
    result = requestStandupStart(user.token, channelId, 2);
    await new Promise((r) => setTimeout(r, 2000));
    const result2 = requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 1000));
    expect(result2).toStrictEqual({ timeFinish: expect.any(Number) });
  });
  test('Unsuccessful standup start request - token does not exist', () => {
    expect(requestStandupStart('1234', channelId, 4)).toStrictEqual(FORBIDDEN);
  });
});

describe('standup/active/v1 tests', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let join = {};
  const result = { isActive: true, timeFinish: 0 };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user4 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    channelId2 = requestCreate(user2.token, 'ChannelTwo', true).channelId;
    join = requestJoin(user2.token, channelId);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful standup active request - Multiple active', async () => {
    requestStandupStart(user.token, channelId, 2);
    await new Promise((r) => setTimeout(r, 200));
    requestStandupStart(user2.token, channelId2, 2);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupActive(user2.token, channelId2);
    await new Promise((r) => setTimeout(r, 2000));
    expect(result1).toStrictEqual({ isActive: true, timeFinish: expect.any(Number) });
  });
  test('Successful standup active request - Inactive', async () => {
    requestStandupStart(user2.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 1000));
    expect(requestStandupActive(user.token, channelId)).toStrictEqual({ isActive: false, timeFinish: null });
  });
  test('Successful standup active request - Active', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupActive(user.token, channelId);
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual({ isActive: true, timeFinish: expect.any(Number) });
  });
  test('Unsuccessful standup active request - Active, channelId invalid', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupActive(user.token, 1234);
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(BAD);
  });
  test('Unsuccessful standup active request - Inactive, channelId invalid', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 1000));
    expect(requestStandupActive(user.token, 1234)).toStrictEqual(BAD);
  });
  test('Unsuccessful standup active request - Active, token invalid', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupActive('1234', channelId);
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup active request - Inactive, token invalid', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 1000));
    expect(requestStandupActive('1234', channelId)).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup active request - User not member of channel, active', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupActive(user4.token, channelId);
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup active request - User not member of channel, inactive', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 1000));
    expect(requestStandupActive(user4.token, channelId)).toStrictEqual(FORBIDDEN);
  });
});

describe('standup/send/v1 tests', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let channelId3 = 0;
  let join = {};
  const result = { isActive: true, timeFinish: 0 };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user4 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    channelId2 = requestCreate(user2.token, 'Channeltwo', true).channelId;
    channelId3 = requestCreate(user2.token, 'Channelthree', true).channelId;
    join = requestJoin(user2.token, channelId);
    join = requestJoin(user.token, channelId3);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful standup send request', async () => {
    requestStandupStart(user2.token, channelId3, 1);
    await new Promise((r) => setTimeout(r, 200));
    requestStandupSend(user.token, channelId3, 'I ate sum fuud');
    requestStandupSend(user2.token, channelId3, 'I did some work');
    await new Promise((r) => setTimeout(r, 900));
    expect(requestMessages(user.token, channelId3, 0)).toStrictEqual({
      messages: [{
        messageId: expect.any(Number),
        uId: user2.authUserId,
        message: 'haydensmith: I ate sum fuud\ndanpudig: I did some work',
        timeSent: expect.any(Number),
      }],
      start: 0,
      end: -1,
    });
  });
  test('Unsuccessful standup send request - channel does not exist', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupSend(user.token, 1234, 'I ate sum fuud');
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(BAD);
  });
  test('Unsuccessful standup send request - channel is not in standup', async () => {
    const result1 = requestStandupSend(user.token, channelId, 'I ate sum fuud');
    expect(result1).toStrictEqual(BAD);
  });
  test('Unsuccessful standup send request - token does not exist', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupSend('1234', channelId, 'I ate sum fuud');
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup send request - not a member of the channel', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupSend(user4.token, channelId, 'I ate sum fuud');
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful standup send request - message too long', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupSend(user4.token, channelId, 'Coolios'.repeat(1000));
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(BAD);
  });
  test('Unsuccessful standup send request - message too short', async () => {
    requestStandupStart(user.token, channelId, 1);
    await new Promise((r) => setTimeout(r, 200));
    const result1 = requestStandupSend(user4.token, channelId, '');
    await new Promise((r) => setTimeout(r, 800));
    expect(result1).toStrictEqual(BAD);
  });
});
