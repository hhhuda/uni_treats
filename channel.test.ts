import { requestClear, requestRegister, requestCreate, requestDetails, requestJoin, requestInvite, requestMessages, requestChannelLeave, requestAddOwner, requestRemoveOwner, requestMessageSend } from './request';

const BAD = 400;
const FORBIDDEN = 403;

describe('channel/details/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId2 = 0;
  let channelId3 = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('nick@gmail.com', '12345678', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'haydenChannel', false).channelId;
    channelId2 = requestCreate(user.token, 'haydenChannel2', true).channelId;
    channelId3 = requestCreate(user2.token, 'danChannel', true).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Details success (channelId)', () => {
    expect(requestDetails(user.token, channelId)).toMatchObject({
      name: 'haydenChannel',
      isPublic: false,
      ownerMembers: [{
        email: 'hayden@gmail.com',
        handleStr: 'haydensmith',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        uId: user.authUserId,
      }],
      allMembers: [{
        email: 'hayden@gmail.com',
        handleStr: 'haydensmith',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        uId: user.authUserId,
      }],
    });
  });
  test('Details fail - channelId is not valid', () => {
    expect(requestDetails(user.token, 0)).toStrictEqual(BAD);
  });
  test('Details fail - channelId is valid and user is not a member', () => {
    expect(requestDetails(user3.token, channelId3)).toStrictEqual(FORBIDDEN);
  });
  test('Details fail - token is invalid', () => {
    expect(requestDetails('1234', channelId3)).toStrictEqual(FORBIDDEN);
  });
});

describe('channel/join/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = '0';
  let user2 = '0';
  let user3 = '0';
  let join = 0;
  let channelId = 0;
  let channelIdPrivate = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith').token;
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig').token;
    user3 = requestRegister('Bock@gmail.com', 'qwertyuiop', 'Bock', 'Daniels').token;
    channelId = requestCreate(user, 'ChannelOne', true).channelId;
    channelIdPrivate = requestCreate(user2, 'PrivateChannel', false).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Joining success', () => {
    join = requestJoin(user2, channelId);
    expect(join).toStrictEqual({});
  });
  test('Joining fail - token is not valid', () => {
    join = requestJoin('-1', channelId);
    expect(join).toStrictEqual(FORBIDDEN);
  });
  test('Joining fail - channelId is not valid', () => {
    join = requestJoin(user2, -1);
    expect(join).toStrictEqual(BAD);
  });
  test('Joining fail - user is already apart of channel', () => {
    join = requestJoin(user2, channelId);
    join = requestJoin(user2, channelId);
    expect(join).toStrictEqual(BAD);
  });
  test('Joining fail - user is not allowed to join private channel', () => {
    join = requestJoin(user3, channelIdPrivate);
    expect(join).toStrictEqual(FORBIDDEN);
  });
  test('Joining fail - user is not allowed to join private channel', () => {
    join = requestJoin(user, channelIdPrivate);
    expect(join).toStrictEqual({});
  });
});

describe('channel/invite/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelIdPrivate = 0;
  let join = 0;
  let invite = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    channelIdPrivate = requestCreate(user.token, 'PrivateChannel', false).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Invite success - public channel', () => {
    invite = requestInvite(user.token, channelId, user2.authUserId);
    expect(invite).toMatchObject({});
  });
  test('Invite success - private channel', () => {
    invite = requestInvite(user.token, channelIdPrivate, user2.authUserId);
    expect(invite).toMatchObject({});
  });
  test('Invite fail - channelId is not valid', () => {
    invite = requestInvite(user.token, 0, user2.authUserId);
    expect(invite).toStrictEqual(BAD);
  });
  test('Invite fail - token', () => {
    invite = requestInvite('1234', channelId, user2.authUserId);
    expect(invite).toStrictEqual(FORBIDDEN);
  });
  test('Invite fail - uId is not valid', () => {
    const invite = requestInvite(user.token, channelId, 1);
    expect(invite).toStrictEqual(BAD);
  });
  test('Invite fail - uId is already a member', () => {
    invite = requestInvite(user.token, channelId, user.authUserId);
    expect(invite).toStrictEqual(BAD);
  });
  test('Invite fail - authUId is not from channel', () => {
    invite = requestInvite(user2.token, channelId, user3.authUserId);
    expect(invite).toStrictEqual(FORBIDDEN);
  });
  test('Invite success - recently-joined user invites someone', () => {
    join = requestJoin(user2.token, channelId);
    invite = requestInvite(user2.token, channelId, user3.authUserId);
    expect(invite).toMatchObject({});
  });
  test('Invite fail - recently-joined user invites himself', () => {
    join = requestJoin(user2.token, channelId);
    invite = requestInvite(user2.token, channelId, user2.authUserId);
    expect(invite).toStrictEqual(BAD);
  });
  test('Invite fail - recently-joined user invites owner', () => {
    join = requestJoin(user2.token, channelId);
    invite = requestInvite(user2.token, channelId, user.authUserId);
    expect(invite).toStrictEqual(BAD);
  });
  test('Invite fail - recently-joined user invites existing non-owner member', () => {
    join = requestJoin(user2.token, channelId);
    join = requestJoin(user2.token, channelIdPrivate);
    invite = requestInvite(user2.token, channelId, user.authUserId);
    expect(invite).toStrictEqual(BAD);
  });
});

describe('channel/messages/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelIdPrivate = 0;
  let channelId3 = 0;
  let messages = [0];
  let message = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    messages = [];
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    user3 = requestRegister('danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    channelId = requestCreate(user.token, 'PublicOne', true).channelId;
    channelIdPrivate = requestCreate(user.token, 'PrivateChannel', false).channelId;
    channelId3 = requestCreate(user3.token, '50messageone', false).channelId;
    requestJoin(user2.token, channelId);
    requestJoin(user2.token, channelIdPrivate);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Messages success - Public channel + no more messages to load', () => {
    for (let i = 0; i < 52; i++) {
      requestMessageSend(user3.token, channelId3, 'Hell0 everyone!');
    }
    const result = requestMessages(user3.token, channelId3, 0);
    expect(result).toBeInstanceOf(Object);
    requestMessageSend(user.token, channelId, 'Hell0 everyone!');
    requestMessageSend(user2.token, channelId, 'Hell0 everyone!');
    message = requestMessages(user.token, channelId, 0);
    expect(message).toStrictEqual({
      messages: [{
        messageId: expect.any(Number),
        uId: user2.authUserId,
        message: 'Hell0 everyone!',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      },
      {
        messageId: expect.any(Number),
        uId: user.authUserId,
        message: 'Hell0 everyone!',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
      end: -1,
    });
  });
  test('Messages success - Private channel', () => {
    requestMessageSend(user.token, channelIdPrivate, 'Hell0 everyone!');
    requestInvite(user.token, channelIdPrivate, user2.authUserId);
    requestMessageSend(user2.token, channelIdPrivate, 'Hell0 everyone!');
    message = requestMessages(user.token, channelIdPrivate, 0);
    expect(message).toStrictEqual({
      messages: [{
        messageId: expect.any(Number),
        uId: user2.authUserId,
        message: 'Hell0 everyone!',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      },
      {
        messageId: expect.any(Number),
        uId: user.authUserId,
        message: 'Hell0 everyone!',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
      end: -1,
    });
  });
  test('Messages success (Start = total no. of messages)', () => {
    requestMessageSend(user.token, channelId, 'Hell0 everyone!');
    requestMessageSend(user2.token, channelId, 'Hell0 everyone!');
    message = requestMessages(user.token, channelId, 2);
    expect(message).toStrictEqual({
      messages: [],
      start: 2,
      end: -1,
    });
  });
  test('Messages fail - channelId is valid with message, and user is not a member', () => {
    requestMessageSend(user.token, channelIdPrivate, 'Hell0 everyone!');
    message = requestMessages(user3.token, channelId, 0);
    expect(message).toStrictEqual(FORBIDDEN);
  });
  test('Messages fail - tokeninvalid', () => {
    message = requestMessages('1234', channelId, 0);
    expect(message).toStrictEqual(FORBIDDEN);
  });
  test('Messages fail - channelId in not valid', () => {
    message = requestMessages(user.token, 8, 0);
    expect(message).toStrictEqual(BAD);
  });
  test('Messages fail - Start > total np. of messages', () => {
    message = requestMessages(user.token, channelId, 1);
    expect(message).toStrictEqual(BAD);
  });
  test('Messages fail - Start is a negative integer', () => {
    message = requestMessages(user.token, channelId, -1);
    expect(message).toStrictEqual(BAD);
  });
});

describe('channel/leave/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = '0';
  let leave = 0;
  let channelId = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Leaving success', () => {
    requestAddOwner(user.token, channelId, user.authUserId);
    leave = requestChannelLeave(user.token, channelId);
    expect(leave).toStrictEqual({});
  });
  test('Leaving fail - channelId is not valid', () => {
    leave = requestChannelLeave(user.token, channelId + 1);
    expect(leave).toStrictEqual(BAD);
  });
  test('Leaving fail - token invalid', () => {
    leave = requestChannelLeave('1234', channelId);
    expect(leave).toStrictEqual(FORBIDDEN);
  });
  /*
  test('Leaving fail - user is the starter of an active standup in channel', () => {

  });
  */
  test('Leaving fail - user is not apart of channel', () => {
    user2 = requestRegister('danpudig@gmail.com', '123456789', 'Dan', 'Pudig').token;
    leave = requestChannelLeave(user2, channelId);
    expect(leave).toStrictEqual(FORBIDDEN);
  });
});

describe('channel/addowner/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let add = 0;
  let channelId = 0;
  let join = {};
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('maddie@gmail.com', '654321', 'Maddie', 'Stevens');
    user4 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    join = requestJoin(user2.token, channelId);
    join = requestJoin(user3.token, channelId);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Adding owner success', () => {
    add = requestAddOwner(user.token, channelId, user2.authUserId);
    expect(add).toStrictEqual({});
  });
  test('Adding owner fail - token is not valid', () => {
    add = requestAddOwner('-1', channelId, user2.authUserId);
    expect(add).toStrictEqual(FORBIDDEN);
  });
  test('Adding owner fail - channelId is not valid', () => {
    add = requestAddOwner(user.token, -1, user2.authUserId);
    expect(add).toStrictEqual(BAD);
  });
  test('Adding owner fail - uId is not valid', () => {
    add = requestAddOwner(user.token, channelId, -1);
    expect(add).toStrictEqual(BAD);
  });
  test('Adding owner fail - uId is not a member of the channel', () => {
    add = requestAddOwner(user.token, channelId, user4.authUserId);
    expect(add).toStrictEqual(BAD);
  });
  test('Adding owner fail - uId is already an owner of the channel', () => {
    add = requestAddOwner(user.token, channelId, user2.authUserId);
    add = requestAddOwner(user.token, channelId, user2.authUserId);
    expect(add).toStrictEqual(BAD);
  });
  test('Adding owner fail - token is associated with a user that is not an owner', () => {
    add = requestAddOwner(user2.token, channelId, user3.authUserId);
    expect(add).toStrictEqual(FORBIDDEN);
  });
});

describe('channel/removeowner/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let remove = 0;
  let channelId = 0;
  let join = {};
  let addOwner = {};
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('maddie@gmail.com', '654321', 'Maddie', 'Stevens');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    join = requestJoin(user2.token, channelId);
    join = requestJoin(user3.token, channelId);
    addOwner = requestAddOwner(user.token, channelId, user.authUserId);
    addOwner = requestAddOwner(user.token, channelId, user2.authUserId);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Removing owner success', () => {
    remove = requestRemoveOwner(user.token, channelId, user2.authUserId);
    expect(remove).toStrictEqual({});
  });
  test('Removing owner fail - token is not valid', () => {
    remove = requestRemoveOwner('-1', channelId, user2.authUserId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });
  test('Removing owner fail - channelId is not valid', () => {
    remove = requestRemoveOwner(user.token, -1, user2.authUserId);
    expect(remove).toStrictEqual(BAD);
  });
  test('Removing owner fail - uId is not valid', () => {
    remove = requestRemoveOwner(user.token, channelId, -1);
    expect(remove).toStrictEqual(BAD);
  });
  test('Removing owner fail - uId is not an owner of the channel', () => {
    remove = requestRemoveOwner(user.token, channelId, user3.authUserId);
    expect(remove).toStrictEqual(BAD);
  });
  test('Removing owner fail - uId is the only owner of the channel', () => {
    remove = requestRemoveOwner(user.token, channelId, user2.authUserId);
    remove = requestRemoveOwner(user.token, channelId, user.authUserId);
    expect(remove).toStrictEqual(BAD);
  });
  test('Removing owner fail - token is associated with a user that is not an owner', () => {
    remove = requestRemoveOwner(user3.token, channelId, user.authUserId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });
});
