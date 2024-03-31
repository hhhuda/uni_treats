import { requestClear, requestRegister, requestCreate, requestJoin, requestdmCreate, requestdmSend, requestMessageSend, requestMessageEdit, requestMessageRemove, requestAddOwner, requestdmMessages, requestSearch, requestMessageShare, requestMessageReact, requestMessageUnreact, requestMessagePin, requestMessages, requestMessageUnpin } from './request';
const BAD = 400;
const FORBIDDEN = 403;

describe('message/send/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user1 = { token: '0', authUserId: 0 };
  let send = 0;
  let channelId = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    user1 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful messages sent', () => {
    send = requestMessageSend(user.token, channelId, 'Hello I am Hayden');
    expect(send).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Unsuccessful message sent- token is not valid', () => {
    send = requestMessageSend('-420', channelId, 'Hello I am Hayden');
    expect(send).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessful message send- channelId is not valid', () => {
    send = requestMessageSend(user.token, -420, 'Hello I am Hayden');
    expect(send).toStrictEqual(BAD);
  });

  test('Unsuccessful message sent- message too short', () => {
    send = requestMessageSend(user.token, channelId, '');
    expect(send).toStrictEqual(BAD);
  });

  test('Unsuccessful message sent- message too long', () => {
    send = requestMessageSend(user.token, channelId, 'HelloIAmHayden'.repeat(1000));
    expect(send).toStrictEqual(BAD);
  });

  test('Unsuccessful message sent- user not a member in the channel', () => {
    send = requestMessageSend(user1.token, channelId, 'Hello I am Hayden');
    expect(send).toStrictEqual(FORBIDDEN);
  });
});

describe('message/edit/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let messageId = 0;
  let messageId2 = 0;
  let edit = 0;
  let channelId = 0;
  let addOwner = 0;
  let join = {};
  let messageDmId = 0;
  let messageDmId1 = 0;
  let dmId = 0;
  let uIds = [0];
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user1 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user2 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user.token, channelId, user.authUserId);
    messageId = requestMessageSend(user.token, channelId, 'Hello I am Hayden').messageId;
    join = requestJoin(user2.token, channelId);
    messageId2 = requestMessageSend(user2.token, channelId, 'Hello I am Dan');
    user3 = requestRegister('nicholas@gmail.com', 'nopasswordtoday', 'nicholas', 'hwang');
    uIds.push(user.authUserId);
    uIds.push(user1.authUserId);
    dmId = requestdmCreate(user.token, uIds).dmId;
    messageDmId = requestdmSend(user.token, dmId, 'Hello I am Hayden').messageId;
    messageDmId1 = requestdmSend(user2.token, dmId, 'Whaddup').messageId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('Successful message edit- not deleted', () => {
    edit = requestMessageEdit(user.token, messageId, 'Hello I am only Hayden not Smith');
    expect(edit).toStrictEqual({});
  });

  test('Successful message edit- deleted', () => {
    edit = requestMessageEdit(user.token, messageId, '');
    expect(edit).toStrictEqual({});
  });

  test('Unsuccessful message edit- token is not valid', () => {
    edit = requestMessageEdit('-420', messageId, 'Unhappy Days');
    expect(edit).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessful message edit- message too long', () => {
    edit = requestMessageEdit(user.token, messageId, 'HelloIAmHayden'.repeat(1000));
    expect(edit).toStrictEqual(BAD);
  });

  test('Unsuccessful message edit- messageId not referring to any message', () => {
    edit = requestMessageEdit(user.token, 420, 'Hello I am only Hayden not Smith');
    expect(edit).toStrictEqual(BAD);
  });

  test('Unsuccessful message edit- not sent by authorised user', () => {
    edit = requestMessageEdit(user1.token, messageId, 'Hello I am an imposter');
    expect(edit).toStrictEqual(BAD);
  });

  test('Unsuccessful message edit- not an owner', () => {
    edit = requestMessageEdit(user2.token, messageId2, 'Hello I not an owner');
    expect(edit).toStrictEqual(BAD);
  });

  test('Successful message edit- DM not deleted', () => {
    edit = requestMessageEdit(user.token, messageDmId, 'Hello I am only Hayden not Smith');
    expect(edit).toStrictEqual({});
  });

  test('Successful message edit- DM deleted', () => {
    edit = requestMessageEdit(user.token, messageDmId, '');
    expect(edit).toStrictEqual({});
    expect(requestdmMessages(user.token, dmId, 0)).toStrictEqual({
      end: -1,
      messages: [],
      start: 0,
    });
  });

  test('Unsuccessful message edit- DM token is not valid', () => {
    edit = requestMessageEdit('-420', messageDmId, 'Unhappy Days');
    expect(edit).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessful message edit- DM messageId not referring to any message', () => {
    edit = requestMessageEdit(user.token, -420, 'Hello I am only Hayden not Smith');
    expect(edit).toStrictEqual(BAD);
  });

  test('Unsuccessful message edit- DM not sent by authorised user', () => {
    edit = requestMessageEdit(user1.token, messageDmId, 'Hello I am an imposter');
    expect(edit).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessful message edit- not an owner', () => {
    edit = requestMessageEdit(user3.token, messageDmId1, 'Hello I am not an owner');
    expect(edit).toStrictEqual(BAD);
  });
});

describe('message/remove/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let messageId = 0;
  let addOwner = 0;
  let join = 0;
  let remove = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let messageDmId1 = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    uIds = [];
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user1 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user2 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user.token, channelId, user.authUserId);
    join = requestJoin(user2.token, channelId);

    uIds.push(user.authUserId);
    uIds.push(user1.authUserId);
    dmId = requestdmCreate(user.token, uIds).dmId;
    messageDmId = requestdmSend(user.token, dmId, 'Hello I am Cool').messageId;
    messageDmId1 = requestdmSend(user1.token, dmId, 'Hello not an owner message').messageId;

    messageId = requestMessageSend(user.token, channelId, 'Hello I am Hayden').messageId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful message remove', () => {
    remove = requestMessageRemove(user.token, messageId);
    expect(remove).toStrictEqual({});
  });

  test('Unsucessful message remove- token is not valid', () => {
    remove = requestMessageRemove('-420', messageId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful message remove- messageId is not valid', () => {
    remove = requestMessageRemove(user.token, -420);
    expect(remove).toStrictEqual(BAD);
  });

  test('Unsucessful message remove- message sent by unauthorised user', () => {
    remove = requestMessageRemove(user1.token, messageId);
    expect(remove).toStrictEqual(BAD);
  });

  test('Unsucessful message remove- not an owner', () => {
    remove = requestMessageRemove(user2.token, messageId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });

  test('Successful DM message remove', () => {
    requestMessageRemove(user.token, messageDmId);
    expect(requestdmMessages(user.token, dmId, 0)).toStrictEqual({
      end: -1,
      messages: [{
        message: 'Hello not an owner message',
        messageId: expect.any(Number),
        timeSent: expect.any(Number),
        uId: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
    });
  });

  test('Unsuccessful DM message remove- token is not valid', () => {
    remove = requestMessageRemove('-420', messageDmId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful DM message remove- message sent by unauthorised user', () => {
    remove = requestMessageRemove(user1.token, messageDmId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful DM message remove- not an owner', () => {
    remove = requestMessageRemove(user1.token, messageDmId);
    expect(remove).toStrictEqual(FORBIDDEN);
  });
});

describe('search/v1', () => {
  /* eslint-disable no-unused-vars */
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let messageId1 = 0;
  let messageId2 = 0;
  let messageId3 = 0;
  let messageId4 = 0;
  let addOwner = 0;
  let join = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId1 = 0;
  let messageDmId2 = 0;
  let messageDmId3 = 0;
  let messageDmId4 = 0;
  let search = [];
  let search1 = {};
  let search2 = {};
  let search3 = {};
  let search4 = {};
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user3 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    user4 = requestRegister('maddie@gmail.com', 'somethingCool', 'Maddie', 'Stevens');
    channelId = requestCreate(user1.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user1.token, channelId, user1.authUserId);
    join = requestJoin(user2.token, channelId);
    join = requestJoin(user4.token, channelId);
    messageId1 = requestMessageSend(user2.token, channelId, 'Hello I am Hayden').messageId;
    messageId2 = requestMessageSend(user4.token, channelId, 'WHAT?! ... dumbass').messageId;
    messageId3 = requestMessageSend(user1.token, channelId, 'Hello there. Ah General Kenobi.').messageId;
    messageId4 = requestMessageSend(user2.token, channelId, 'Where am I?').messageId;

    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId = requestdmCreate(user1.token, uIds).dmId;
    messageDmId1 = requestdmSend(user1.token, dmId, 'Hello I am Cool').messageId;
    messageDmId2 = requestdmSend(user2.token, dmId, 'Dan is really cool.').messageId;
    messageDmId3 = requestdmSend(user2.token, dmId, 'RANDOM MESSAGE!!!').messageId;
    messageDmId4 = requestdmSend(user3.token, dmId, 'Dan says hello there!').messageId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful search - multiple results -- just channel', () => {
    search = requestSearch(user4.token, 'hello');
    search1 = {
      messageId: messageId1,
      uId: user2.authUserId,
      message: 'Hello I am Hayden',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    search2 = {
      messageId: messageId3,
      uId: user1.authUserId,
      message: 'Hello there. Ah General Kenobi.',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
    expect(search).toContainEqual(search2);
  });

  test('Successful search - single result -- just channel', () => {
    search = requestSearch(user4.token, 'dumbass');
    search1 = {
      messageId: messageId2,
      uId: user4.authUserId,
      message: 'WHAT?! ... dumbass',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
  });

  test('Successful search - no results -- just channel', () => {
    expect(requestSearch(user4.token, 'random')).toStrictEqual([]);
  });

  test('Successful search - multiple results -- just dm', () => {
    search = requestSearch(user3.token, 'hello');
    search1 = {
      messageId: messageDmId1,
      uId: user1.authUserId,
      message: 'Hello I am Cool',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    search2 = {
      messageId: messageDmId4,
      uId: user3.authUserId,
      message: 'Dan says hello there!',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
    expect(search).toContainEqual(search2);
  });

  test('Successful search - single result -- just dm', () => {
    search = requestSearch(user3.token, 'random');
    search1 = {
      messageId: messageDmId3,
      uId: user2.authUserId,
      message: 'RANDOM MESSAGE!!!',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
  });

  test('Successful search - no results -- just dm', () => {
    expect(requestSearch(user3.token, 'WHAT')).toStrictEqual([]);
  });

  test('Successful search - multiple results -- channel and dm', () => {
    search = requestSearch(user1.token, 'hello');
    search1 = {
      messageId: messageDmId1,
      uId: user1.authUserId,
      message: 'Hello I am Cool',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    search2 = {
      messageId: messageDmId4,
      uId: user3.authUserId,
      message: 'Dan says hello there!',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    search3 = {
      messageId: messageId1,
      uId: user2.authUserId,
      message: 'Hello I am Hayden',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    search4 = {
      messageId: messageId3,
      uId: user1.authUserId,
      message: 'Hello there. Ah General Kenobi.',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
    expect(search).toContainEqual(search2);
    expect(search).toContainEqual(search3);
    expect(search).toContainEqual(search4);
  });

  test('Successful search - single result -- channel and dm', () => {
    search = requestSearch(user1.token, 'random');
    search1 = {
      messageId: messageDmId3,
      uId: user2.authUserId,
      message: 'RANDOM MESSAGE!!!',
      timeSent: expect.any(Number),
      isPinned: false,
      reacts: [],
    };
    expect(search).toContainEqual(search1);
  });

  test('Successful search - no results -- channel and dm', () => {
    expect(requestSearch(user1.token, 'Something that does not exist')).toStrictEqual([]);
  });

  test('Unsucessful search - token is invalid', () => {
    expect(requestSearch('-1', 'Hello')).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful search - queryStr is too short', () => {
    expect(requestSearch(user1.token, '')).toStrictEqual(BAD);
  });

  test('Unsucessful search - queryStr is too long', () => {
    expect(requestSearch(user1.token, 'Hello'.repeat(1000))).toStrictEqual(BAD);
  });
});

describe('message/share/v1', () => {
  /* eslint-disable no-unused-vars */
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let messageId = 0;
  let addOwner = 0;
  let join = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let share = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user3 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    channelId = requestCreate(user1.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user1.token, channelId, user1.authUserId);
    join = requestJoin(user2.token, channelId);
    messageId = requestMessageSend(user1.token, channelId, 'Hello there.').messageId;

    uIds.push(user3.authUserId);
    dmId = requestdmCreate(user1.token, uIds).dmId;
    messageDmId = requestdmSend(user3.token, dmId, 'Dan says hello there!').messageId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful message share to a channel -- extra message', () => {
    share = requestMessageShare(user1.token, messageId, 'Ah General Kenobi!', channelId, -1);
    expect(share).toEqual(expect.any(Number));
  });

  test('Successful message share to a channel -- no extra message', () => {
    share = requestMessageShare(user1.token, messageId, '', channelId, -1);
    expect(share).toEqual(expect.any(Number));
  });

  test('Successful message share to a dm -- extra message', () => {
    share = requestMessageShare(user1.token, messageDmId, 'Ah General Kenobi!', -1, dmId);
    expect(share).toEqual(expect.any(Number));
  });

  test('Successful message share to a dm -- no extra message', () => {
    share = requestMessageShare(user1.token, messageDmId, '', -1, dmId);
    expect(share).toEqual(expect.any(Number));
  });

  test('Unsucessful message share - token is invalid', () => {
    share = requestMessageShare('-1', messageId, 'Ah General Kenobi!', channelId, -1);
    expect(share).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful message share - channelId is invalid and dmId is -1', () => {
    share = requestMessageShare(user1.token, messageId, 'Ah General Kenobi!', -420, -1);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - channelId is -1 and dmId is invalid', () => {
    share = requestMessageShare(user1.token, messageId, 'Ah General Kenobi!', -1, -420);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - both channelId and dmId are -1', () => {
    share = requestMessageShare(user1.token, messageId, 'Ah General Kenobi!', -1, -1);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - neither channelId and dmId are -1', () => {
    share = requestMessageShare(user1.token, messageId, 'Ah General Kenobi!', channelId, dmId);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - ogMessageId is invalid', () => {
    share = requestMessageShare(user1.token, -1, 'Ah General Kenobi!', channelId, -1);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - length of message is more than 1000 characters', () => {
    share = requestMessageShare(user1.token, messageId, 'Hello'.repeat(1000), channelId, -1);
    expect(share).toStrictEqual(BAD);
  });

  test('Unsucessful message share - user is not apart of the channel', () => {
    share = requestMessageShare(user3.token, messageDmId, 'Ah General Kenobi!', channelId, -1);
    expect(share).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful message share - user is not apart of the dm', () => {
    share = requestMessageShare(user2.token, messageId, 'Ah General Kenobi!', -1, dmId);
    expect(share).toStrictEqual(FORBIDDEN);
  });
});

describe('message/react/v1', () => {
  /* eslint-disable no-unused-vars */
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let messageId = 0;
  let addOwner = 0;
  let join = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let react = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user3 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    channelId = requestCreate(user1.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user1.token, channelId, user1.authUserId);
    join = requestJoin(user2.token, channelId);
    messageId = requestMessageSend(user1.token, channelId, 'Hello there.').messageId;

    uIds.push(user3.authUserId);
    dmId = requestdmCreate(user1.token, uIds).dmId;
    messageDmId = requestdmSend(user3.token, dmId, 'Dan says hello there!').messageId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful message react - in a channel', () => {
    react = requestMessageReact(user1.token, messageId, 1);
    expect(react).toStrictEqual({});
  });

  test('Successful message react - in a dm', () => {
    react = requestMessageReact(user1.token, messageDmId, 1);
    expect(react).toStrictEqual({});
  });

  test('Unsucessful message react - token is invalid', () => {
    react = requestMessageReact('-1', messageId, 1);
    expect(react).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful message react - messageId is invalid', () => {
    react = requestMessageReact(user1.token, -1, 1);
    expect(react).toStrictEqual(BAD);
  });

  test('Unsucessful message react - messageId is valid but the user isn\'t apart of the channel', () => {
    react = requestMessageReact(user3.token, messageId, 1);
    expect(react).toStrictEqual(BAD);
  });

  test('Unsucessful message react - messageId is valid but the user isn\'t apart of the dm', () => {
    react = requestMessageReact(user2.token, messageDmId, 1);
    expect(react).toStrictEqual(BAD);
  });

  test('Unsucessful message react - reactId is not valid', () => {
    react = requestMessageReact(user1.token, messageId, -1);
    expect(react).toStrictEqual(BAD);
  });

  test('Unsucessful message react - the message already contains a react from the given user', () => {
    react = requestMessageReact(user1.token, messageId, 1);
    react = requestMessageReact(user1.token, messageId, 1);
    expect(react).toStrictEqual(BAD);
  });
});

describe('message/unreact/v1', () => {
  /* eslint-disable no-unused-vars */
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let user3 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let messageId = 0;
  let addOwner = 0;
  let join = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let react = 0;
  let unreact = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    user3 = requestRegister('dan@gmail.com', 'iamaflute', 'Dan', 'Pudig');
    channelId = requestCreate(user1.token, 'ChannelOne', true).channelId;
    addOwner = requestAddOwner(user1.token, channelId, user1.authUserId);
    join = requestJoin(user2.token, channelId);
    messageId = requestMessageSend(user1.token, channelId, 'Hello there.').messageId;
    react = requestMessageReact(user1.token, messageId, 1);

    uIds.push(user3.authUserId);
    dmId = requestdmCreate(user1.token, uIds).dmId;
    messageDmId = requestdmSend(user3.token, dmId, 'Dan says hello there!').messageId;
    react = requestMessageReact(user1.token, messageDmId, 1);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful message unreact - in a channel', () => {
    unreact = requestMessageUnreact(user1.token, messageId, 1);
    expect(unreact).toStrictEqual({});
  });

  test('Successful message unreact - in a dm', () => {
    unreact = requestMessageUnreact(user1.token, messageDmId, 1);
    expect(unreact).toStrictEqual({});
  });

  test('Unsucessful message unreact - token is invalid', () => {
    unreact = requestMessageUnreact('-1', messageId, 1);
    expect(unreact).toStrictEqual(FORBIDDEN);
  });

  test('Unsucessful message unreact - messageId is invalid', () => {
    unreact = requestMessageUnreact(user1.token, -1, 1);
    expect(unreact).toStrictEqual(BAD);
  });

  test('Unsucessful message unreact - messageId is valid but the user isn\'t apart of the channel', () => {
    unreact = requestMessageUnreact(user3.token, messageId, 1);
    expect(unreact).toStrictEqual(BAD);
  });

  test('Unsucessful message unreact - messageId is valid but the user isn\'t apart of the dm', () => {
    unreact = requestMessageUnreact(user2.token, messageDmId, 1);
    expect(unreact).toStrictEqual(BAD);
  });

  test('Unsucessful message unreact - reactId is not valid', () => {
    unreact = requestMessageUnreact(user1.token, messageId, -1);
    expect(unreact).toStrictEqual(BAD);
  });

  test('Unsucessful message unreact - the message does not contains a react from the given user', () => {
    unreact = requestMessageUnreact(user1.token, messageId, 1);
    unreact = requestMessageUnreact(user1.token, messageId, 1);
    expect(unreact).toStrictEqual(BAD);
  });
});

describe('message/pinned/v1', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId1 = 0;
  let user1Join = 0;
  let messageId = 0;
  let messageId1 = 0;
  let messageId2 = 0;

  let pin = 0;
  let pinnedAlready = 0;

  let user3 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let messageDmId1 = 0;

  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    uIds = [];
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user1 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    user1Join = requestJoin(user1.token, channelId);
    messageId = requestMessageSend(user.token, channelId, 'Hello I am Hayden').messageId;
    messageId1 = requestMessageSend(user1.token, channelId, 'Hello I am Small').messageId;

    user2 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'sdf', 'sdf');
    channelId1 = requestCreate(user2.token, 'something', true).channelId;
    messageId2 = requestMessageSend(user2.token, channelId1, 'Hello I am Happy').messageId;
    pinnedAlready = requestMessagePin(user2.token, messageId2);

    user3 = requestRegister('smithy@gmail.com', 'hiamcoll', 'Hayden', 'James');
    user4 = requestRegister('tyujk@gmail.com', 'highasakite', 'Steven', 'Happy');
    uIds.push(user3.authUserId);
    uIds.push(user4.authUserId);
    dmId = requestdmCreate(user3.token, uIds).dmId;
    messageDmId = requestdmSend(user3.token, dmId, 'Hello I am Oliver').messageId;
    messageDmId1 = requestdmSend(user4.token, dmId, 'Hello not a cool person').messageId;

    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful message pin', () => {
    pin = requestMessagePin(user.token, messageId);
    expect(pin).toStrictEqual({});
  });

  test('Successful message pin show', () => {
    pin = requestMessagePin(user.token, messageId);
    expect(requestMessages(user.token, channelId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          message: 'Hello I am Small',
          messageId: expect.any(Number),
          isPinned: false,
          timeSent: expect.any(Number),
          uId: expect.any(Number),
          reacts: [],
        },
        {
          message: 'Hello I am Hayden',
          messageId: expect.any(Number),
          isPinned: true,
          timeSent: expect.any(Number),
          uId: expect.any(Number),
          reacts: [],
        }
      ],
      start: 0,
    });
  });

  test('Unsuccessful message pin- token is invalid', () => {
    pin = requestMessagePin('-420', messageId);
    expect(pin).toStrictEqual(FORBIDDEN);
  });
  test('Unsuccessful message pin- messageId not a valid message in channel', () => {
    pin = requestMessagePin(user.token, -420);
    expect(pin).toStrictEqual(BAD);
  });
  test('Unsuccessful message pin- messageId already pinned', () => {
    requestMessagePin(user.token, messageId);
    pin = requestMessagePin(user.token, messageId);
    expect(pin).toStrictEqual(BAD);
  });
  test('Unsuccessful message pin- Unauthorised user', () => {
    pin = requestMessagePin(user1.token, messageId1);
    expect(pin).toStrictEqual(FORBIDDEN);
  });

  test('Successful DM message pin', () => {
    pin = requestMessagePin(user3.token, messageDmId);
    expect(pin).toStrictEqual({});
  });
  test('Unsuccessful DM message pin- messageId not a valid message in dm', () => {
    pin = requestMessagePin(user3.token, -123);
    expect(pin).toStrictEqual(BAD);
  });
  test('Unsuccessful DM message pin- message already pinned', () => {
    requestMessagePin(user3.token, messageDmId);
    pin = requestMessagePin(user3.token, messageDmId);
    expect(pin).toStrictEqual(BAD);
  });
  test('Unsuccessful DM message pin- Unauthorised user', () => {
    pin = requestMessagePin(user4.token, messageDmId1);
    expect(pin).toStrictEqual(FORBIDDEN);
  });
});

describe('message/unpin/v1', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user1 = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let channelId = 0;
  let channelId1 = 0;
  let user1Join = 0;
  let messageId = 0;
  let messageId1 = 0;
  let messageId2 = 0;

  const pin = 0;
  let pinnedAlready = 0;

  let unpin = 0;

  let user3 = { token: '0', authUserId: 0 };
  let user4 = { token: '0', authUserId: 0 };
  let uIds = [0];
  let dmId = 0;
  let messageDmId = 0;
  let messageDmId1 = 0;

  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    uIds = [];
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user1 = requestRegister('steven@gmail.com', 'highasakite', 'Steven', 'Le');
    channelId = requestCreate(user.token, 'ChannelOne', true).channelId;
    user1Join = requestJoin(user1.token, channelId);
    messageId = requestMessageSend(user.token, channelId, 'Hello I am Hayden').messageId;
    messageId1 = requestMessageSend(user1.token, channelId, 'Hello I am Small').messageId;

    user2 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'sdf', 'sdf');
    channelId1 = requestCreate(user2.token, 'something', true).channelId;
    messageId2 = requestMessageSend(user2.token, channelId1, 'Hello I am Happy').messageId;
    pinnedAlready = requestMessageUnpin(user2.token, messageId2);

    user3 = requestRegister('smithy@gmail.com', 'hiamcoll', 'Hayden', 'James');
    user4 = requestRegister('tyujk@gmail.com', 'highasakite', 'Steven', 'Happy');
    uIds.push(user3.authUserId);
    uIds.push(user4.authUserId);
    dmId = requestdmCreate(user3.token, uIds).dmId;
    messageDmId = requestdmSend(user3.token, dmId, 'Hello I am Oliver').messageId;
    messageDmId1 = requestdmSend(user4.token, dmId, 'Hello not a cool person').messageId;

    requestMessagePin(user.token, messageId);

    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful Unpin', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin(user.token, messageId);
    expect(unpin).toStrictEqual({});
  });

  test('Successful message pin show', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin(user.token, messageId);
    expect(requestMessages(user.token, channelId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          message: 'Hello I am Small',
          messageId: expect.any(Number),
          isPinned: false,
          timeSent: expect.any(Number),
          uId: expect.any(Number),
          reacts: [],
        },
        {
          message: 'Hello I am Hayden',
          messageId: expect.any(Number),
          isPinned: false,
          timeSent: expect.any(Number),
          uId: expect.any(Number),
          reacts: [],
        }
      ],
      start: 0,
    });
  });

  test('Unsuccessuful Unpin- token is invalid', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin('-420', messageId);
    expect(unpin).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessuful Unpin- messageId not valid', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin(user.token, -420);
    expect(unpin).toStrictEqual(BAD);
  });

  test('Unsuccessuful Unpin- messageId not pinned anyway', () => {
    requestMessagePin(user.token, messageId);
    requestMessageUnpin(user.token, messageId);
    unpin = requestMessageUnpin(user.token, messageId);
    expect(unpin).toStrictEqual(BAD);
  });

  test('Unsuccessful message Unpin- Unauthorised user', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin(user1.token, messageId1);
    expect(unpin).toStrictEqual(FORBIDDEN);
  });

  test('Unsuccessful DM message Unpin- messageId not a valid message in dm', () => {
    requestMessagePin(user.token, messageId);
    unpin = requestMessageUnpin(user3.token, -123);
    expect(unpin).toStrictEqual(BAD);
  });
});
