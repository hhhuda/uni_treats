import { requestAddOwner, requestpermissionChange, requestadminRemove, requestRegister, requestClear, requestCreate, requestdmCreate, requestdmSend, requestMessageSend } from './request';
const BAD = 400;
const FORBIDDEN = 403;

describe('admin remove tests', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let channelId3 = 0;
  let dmId = 0;
  let uIds = [0];
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('nick@gmail.com', '12345678', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'haydenChannel', false).channelId;
    channelId2 = requestCreate(user.token, 'haydenChannel2', true).channelId;
    channelId3 = requestCreate(user2.token, 'danChannel', true).channelId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId = requestdmCreate(user.token, uIds).dmId;
    requestdmSend(user.token, dmId, 'Hi I am Hayden Smith');
    requestdmSend(user2.token, dmId, 'Hi I am Nicholas Hwang');
    requestMessageSend(user.token, channelId, 'Hi I am hsmith');
    requestAddOwner(user2.token, channelId3, user2.authUserId);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful removal test', () => {
    expect(requestadminRemove(user.token, user2.authUserId)).toStrictEqual({});
  });
  test('Unsuccessful removal test - only global owner', () => {
    expect(requestadminRemove(user.token, user.authUserId)).toStrictEqual(BAD);
  });
  test('Unsuccessful removal test - invalid token', () => {
    expect(requestadminRemove('1234', user.authUserId)).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful removal test - invalid authUserId', () => {
    expect(requestadminRemove(user.token, 1234)).toStrictEqual(BAD);
  });
  test('Unsuccessful removal test - not global owner', () => {
    expect(requestadminRemove(user2.token, user.authUserId)).toStrictEqual(FORBIDDEN);
  });
});

describe('admin permission change tests', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let channelId3 = 0;
  let dmId = 0;
  let uIds = [0];
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('nick@gmail.com', '12345678', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'haydenChannel', false).channelId;
    channelId2 = requestCreate(user.token, 'haydenChannel2', true).channelId;
    channelId3 = requestCreate(user2.token, 'danChannel', true).channelId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId = requestdmCreate(user.token, uIds).dmId;
    requestdmSend(user.token, dmId, 'Hi I am Hayden Smith');
    requestdmSend(user2.token, dmId, 'Hi I am Nicholas Hwang');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful permission change test', () => {
    expect(requestpermissionChange(user.token, user2.authUserId, 2)).toStrictEqual({});
  });
  test('Successful permission change test', () => {
    requestpermissionChange(user.token, user2.authUserId, 2);
    expect(requestpermissionChange(user.token, user2.authUserId, 1)).toStrictEqual({});
  });
  test('Unsuccessful permission change test - only global owner', () => {
    expect(requestpermissionChange(user.token, user.authUserId, 1)).toStrictEqual(BAD);
  });
  test('Unsuccessful removal test - invalid token', () => {
    expect(requestpermissionChange('1234', user2.authUserId, 2)).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful removal test - invalid authUserId', () => {
    expect(requestpermissionChange(user.token, 1234, 2)).toStrictEqual(BAD);
  });
  test('Unsuccessful removal test - not global owner', () => {
    expect(requestpermissionChange(user2.token, user.authUserId, 1)).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful removal test - permission id invalid', () => {
    expect(requestpermissionChange(user.token, user2.authUserId, 3)).toStrictEqual(BAD);
  });
  test('Unsuccessful removal test - Already permission level', () => {
    expect(requestpermissionChange(user.token, user2.authUserId, 1)).toStrictEqual(BAD);
  });
});
