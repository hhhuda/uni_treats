import { requestClear, requestRegister, requestCreate, requestList, requestListAll } from './request';
const BAD = 400;
const FORBIDDEN = 403;

describe('channels/create/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = '0';
  let chann = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith').token;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Create success', () => {
    chann = requestCreate(user, 'Channelone', true).channelId;
    expect(chann).toStrictEqual(expect.any(Number));
  });
  test('Create fail - name too short', () => {
    chann = requestCreate(user, '', true);
    expect(chann).toStrictEqual(BAD);
  });
  test('Create fail - name too long', () => {
    chann = requestCreate(user, '123456789012345678901234567890', true);
    expect(chann).toStrictEqual(BAD);
  });
  test('Create fail - token invalid', () => {
    chann = requestCreate('1234', 'channelone', true);
    expect(chann).toStrictEqual(FORBIDDEN);
  });
});

describe('channels/list/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = '0';
  let user2 = '0';
  let user3 = '0';
  let chann1 = 0;
  let chann2 = 0;
  let chann3 = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@unsw.edu.au', '123456', 'hayden', 'smith').token;
    user2 = requestRegister('nick@unsw.edu.au', 'qwertyuiop', 'nicholas', 'hwang').token;
    user3 = requestRegister('dan@unsw.edu.au', '123456789', 'dan', 'pudig').token;
    chann1 = requestCreate(user, 'hayden_channel', true).channelId;
    chann2 = requestCreate(user, 'hayden_channel2', true).channelId;
    chann3 = requestCreate(user2, 'nick_channel', true).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Showing zero channels', () => {
    requestClear();
    user = requestRegister('hayden@unsw.edu.au', '123456', 'hayden', 'smith').token;
    expect(requestList(user)).toStrictEqual({ channels: [] });
  });
  test('Showing haydens channels', () => {
    expect(requestList(user)).toStrictEqual({
      channels: [{
        channelId: chann1,
        name: 'hayden_channel',
      },
      {
        channelId: chann2,
        name: 'hayden_channel2'
      }]
    });
  });
  test('Showing channels fail - invalid token', () => {
    expect(requestList('1234')).toStrictEqual(FORBIDDEN);
  });
});

describe('channels/listall/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = '0';
  let user2 = '0';
  let user3 = '0';
  let chann1 = 0;
  let chann2 = 0;
  let chann3 = 0;
  let chann4 = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@unsw.edu.au', '123456', 'hayden', 'smith').token;
    user2 = requestRegister('nick@unsw.edu.au', 'qwertyuiop', 'nicholas', 'hwang').token;
    user3 = requestRegister('dan@unsw.edu.au', '123456789', 'dan', 'pudig').token;
    chann1 = requestCreate(user, 'hayden_channel', true).channelId;
    chann2 = requestCreate(user, 'hayden_channel2', true).channelId;
    chann3 = requestCreate(user2, 'nick_channel', true).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Showing zero channels', () => {
    requestClear();
    user = requestRegister('hayden@unsw.edu.au', '123456', 'hayden', 'smith').token;
    expect(requestListAll(user)).toStrictEqual({ channels: [] });
  });
  test('Showing all channels', () => {
    expect(requestListAll(user)).toStrictEqual({
      channels: [{
        channelId: chann1,
        name: 'hayden_channel',
      },
      {
        channelId: chann2,
        name: 'hayden_channel2',
      },
      {
        channelId: chann3,
        name: 'nick_channel',
      }]
    });
  });
  test('Showing all channels including any private', () => {
    chann4 = requestCreate(user3, 'dan_secret_channel', false).channelId;
    expect(requestListAll(user)).toStrictEqual({
      channels: [{
        channelId: chann1,
        name: 'hayden_channel',
      },
      {
        channelId: chann2,
        name: 'hayden_channel2',
      },
      {
        channelId: chann3,
        name: 'nick_channel',
      },
      {
        channelId: chann4,
        name: 'dan_secret_channel',
      }]
    });
  });
  test('Showing all channels fail - invalid token', () => {
    expect(requestListAll('-1')).toStrictEqual(FORBIDDEN);
  });
});
