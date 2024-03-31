import { requestClear, requestRegister, requestProfile, requestUsersAll, requestUserSetname, requestUserSetemail, requestUserSethandle, requestCreate, requestInvite, requestdmCreate, requestdmSend, requestMessageSend, requestAddOwner, requestMessageReact, requestGetNotifications, requestMessageEdit, requestChannelLeave } from './request';
const BAD = 400;
const FORBIDDEN = 403;

describe('user/profile/v3', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let profile = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Profile success', () => {
    profile = requestProfile(user.token, user2.authUserId);
    expect(profile).toStrictEqual({
      user: {
        uId: user2.authUserId,
        email: 'dan@gmail.com',
        nameFirst: 'Dan',
        nameLast: 'Pudig',
        handleStr: 'danpudig',
      }
    });
  });
  test('Profile fail - token is not valid', () => {
    profile = requestProfile('-1', user2.authUserId);
    expect(profile).toStrictEqual(FORBIDDEN);
  });
  test('Profile fail - uId is not valid', () => {
    profile = requestProfile(user.token, 0);
    expect(profile).toStrictEqual(BAD);
  });
});

describe('users/all/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '', authUserId: 0 };
  let user2 = { token: '', authUserId: 0 };
  let user3 = { token: '', authUserId: 0 };
  let all = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    user3 = requestRegister('nick@gmail.com', '123456', 'Nicholas', 'Hwang');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('UsersAll success', () => {
    all = requestUsersAll(user.token);
    expect(all).toStrictEqual({
      users: [{
        uId: user.authUserId,
        email: 'hayden@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        handleStr: 'haydensmith',
      },
      {
        uId: user2.authUserId,
        email: 'dan@gmail.com',
        nameFirst: 'Dan',
        nameLast: 'Pudig',
        handleStr: 'danpudig',
      },
      {
        uId: user3.authUserId,
        email: 'nick@gmail.com',
        nameFirst: 'Nicholas',
        nameLast: 'Hwang',
        handleStr: 'nicholashwang',
      }]
    });
  });
  test('UsersAll success - only one user', () => {
    requestClear();
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    all = requestUsersAll(user.token);
    expect(all).toStrictEqual({
      users: [{
        uId: user.authUserId,
        email: 'hayden@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        handleStr: 'haydensmith',
      }]
    });
  });
  test('UsersAll fail - token is invalid', () => {
    requestClear();
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    all = requestUsersAll('-1');
    expect(all).toStrictEqual(FORBIDDEN);
  });
});

describe('user/profile/setname/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let setname = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Setname success', () => {
    setname = requestUserSetname(user.token, 'Haydin', 'Smeeth');
    expect(setname).toStrictEqual({});
  });
  test('Setname success - identical to name of existing user', () => {
    setname = requestUserSetname(user.token, 'Dan', 'Pudig');
    expect(setname).toStrictEqual({});
  });
  test('Setname success - only wants to change nameFirst', () => {
    setname = requestUserSetname(user.token, 'Haydin', 'Smith');
    expect(setname).toStrictEqual({});
  });
  test('Setname success - only wants to change nameLast', () => {
    setname = requestUserSetname(user.token, 'Hayden', 'Smeeth');
    expect(setname).toStrictEqual({});
  });
  test('Setname success - wants to switch nameFirst to nameLast and vice versa', () => {
    setname = requestUserSetname(user.token, 'Smith', 'Hayden');
    expect(setname).toStrictEqual({});
  });
  test('Setname fail - nameFirst less than one character', () => {
    setname = requestUserSetname(user.token, '', 'Smeeth');
    expect(setname).toStrictEqual(BAD);
  });
  test('Setname fail - nameFirst more than fifty characters', () => {
    setname = requestUserSetname(user.token, '012345678901234567890123456789012345678901234567890', 'Smeeth');
    expect(setname).toStrictEqual(BAD);
  });
  test('Setname fail - nameLast less than one character', () => {
    setname = requestUserSetname(user.token, 'Haydin', '');
    expect(setname).toStrictEqual(BAD);
  });
  test('Setname fail - nameLast more than fifty characters', () => {
    setname = requestUserSetname(user.token, 'Haydin', '012345678901234567890123456789012345678901234567890');
    expect(setname).toStrictEqual(BAD);
  });
  test('Setname fail - token is not valid', () => {
    setname = requestUserSetname('-1', 'Haydin', 'Smeeth');
    expect(setname).toStrictEqual(FORBIDDEN);
  });
});

describe('user/profile/setemail/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let setemail = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Setemail success', () => {
    setemail = requestUserSetemail(user.token, 'haydin@gmail.com');
    expect(setemail).toStrictEqual({});
  });
  test('Setemail fail - email is not a valid email', () => {
    setemail = requestUserSetemail(user.token, 'hayden@eairghrge');
    expect(setemail).toStrictEqual(BAD);
  });
  test('Setemail fail - email address is taken by another user', () => {
    setemail = requestUserSetemail(user.token, 'dan@gmail.com');
    expect(setemail).toStrictEqual(BAD);
  });
  test('Setemail fail - token is not valid', () => {
    setemail = requestUserSetemail('-1', 'hayden@gmail.com');
    expect(setemail).toStrictEqual(FORBIDDEN);
  });
});

describe('user/profile/sethandle/v2', () => {
  /* eslint-disable no-unused-vars */
  let user = { token: '0', authUserId: 0 };
  let user2 = { token: '0', authUserId: 0 };
  let sethandle = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    user = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('dan@gmail.com', '123456789', 'Dan', 'Pudig');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Sethandle success', () => {
    sethandle = requestUserSethandle(user.token, 'hayhayd3n');
    expect(sethandle).toStrictEqual({});
  });
  test('Sethandle fail - identical to handleStr of existing user', () => {
    sethandle = requestUserSethandle(user.token, 'danpudig');
    expect(sethandle).toStrictEqual(BAD);
  });
  test('Sethandle fail - handleStr empty', () => {
    sethandle = requestUserSethandle(user.token, '');
    expect(sethandle).toStrictEqual(BAD);
  });
  test('Sethandle fail - handleStr less than three characters', () => {
    sethandle = requestUserSethandle(user.token, 'ha');
    expect(sethandle).toStrictEqual(BAD);
  });
  test('Sethandle fail - handleStr more than twenty characters', () => {
    sethandle = requestUserSethandle(user.token, 'qwertyuiopasdfghjklzx');
    expect(sethandle).toStrictEqual(BAD);
  });
  test('Sethandle fail - handleStr contains non-alphanumeric characters', () => {
    sethandle = requestUserSethandle(user.token, '()!@#$%^*=:;?/_');
    expect(sethandle).toStrictEqual(BAD);
  });
  test('Sethandle fail - token is not valid', () => {
    sethandle = requestUserSethandle('-1', 'hayhayd3n');
    expect(sethandle).toStrictEqual(FORBIDDEN);
  });
});

describe('notifications/get/v1', () => {
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
  let messageId5 = 0;
  let addOwner = 0;
  let invite = 0;
  let uIds = [0];
  let dmId = 0;
  let messageDmId1 = 0;
  let messageDmId2 = 0;
  let messageDmId3 = 0;
  let messageDmId4 = 0;
  let notifications = [];
  let react = 0;
  let edit = 0;
  let remove = 0;
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
    invite = requestInvite(user1.token, channelId, user2.authUserId);
    invite = requestInvite(user1.token, channelId, user4.authUserId);
    messageId1 = requestMessageSend(user2.token, channelId, 'Hello there, I am Steven Le').messageId;
    messageId2 = requestMessageSend(user4.token, channelId, 'WHAT?! ... dumbass').messageId;
    messageId3 = requestMessageSend(user1.token, channelId, 'Hello there. Ah General Kenobi.').messageId;
    messageId4 = requestMessageSend(user2.token, channelId, 'Where am I?').messageId;
    react = requestMessageReact(user1.token, messageId1, 1);
    react = requestMessageReact(user4.token, messageId4, 1);

    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId = requestdmCreate(user1.token, uIds).dmId;
    messageDmId1 = requestdmSend(user1.token, dmId, 'Hello I am Cool').messageId;
    messageDmId2 = requestdmSend(user2.token, dmId, 'Dan is really cool.').messageId;
    messageDmId3 = requestdmSend(user2.token, dmId, 'RANDOM MESSAGE!!!').messageId;
    messageDmId4 = requestdmSend(user3.token, dmId, '@danpudig says hello to @stevenle!').messageId;
    react = requestMessageReact(user3.token, messageDmId2, 1);
    react = requestMessageReact(user2.token, messageDmId3, 1);
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Get notifications success - user has more than 20 notifications', () => {
    edit = requestMessageEdit(user4.token, messageId2, '@danpudig says hello to @stevenle in the channel.');
    react = requestMessageReact(user1.token, messageDmId2, 1);
    react = requestMessageReact(user2.token, messageDmId2, 1);
    react = requestMessageReact(user3.token, messageDmId3, 1);
    react = requestMessageReact(user1.token, messageDmId3, 1);
    react = requestMessageReact(user2.token, messageId1, 1);
    react = requestMessageReact(user4.token, messageId1, 1);
    react = requestMessageReact(user1.token, messageId4, 1);
    react = requestMessageReact(user2.token, messageId4, 1);
    remove = requestChannelLeave(user2.token, channelId);
    invite = requestInvite(user1.token, channelId, user2.authUserId);
    edit = requestMessageEdit(user1.token, messageDmId1, 'Hello I am Cool. What do you think @stevenle?');
    messageId5 = requestMessageSend(user2.token, channelId, 'Another random message for more notifications').messageId;
    react = requestMessageReact(user1.token, messageId5, 1);
    react = requestMessageReact(user2.token, messageId5, 1);
    react = requestMessageReact(user4.token, messageId5, 1);

    notifications = requestGetNotifications(user2.token);
    expect(notifications).toStrictEqual([
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'maddiestevens reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'stevenle reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith reacted to your message in ChannelOne'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'haydensmith tagged you in danpudig, haydensmith, stevenle: Hello I am Cool. Wha'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith added you to ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'stevenle reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'maddiestevens reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'stevenle reacted to your message in ChannelOne'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'haydensmith reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'danpudig reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'stevenle reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'haydensmith reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'maddiestevens tagged you in ChannelOne: @danpudig says hello'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'stevenle reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'danpudig reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'danpudig tagged you in danpudig, haydensmith, stevenle: @danpudig says hello'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'haydensmith added you to danpudig, haydensmith, stevenle'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'maddiestevens reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith reacted to your message in ChannelOne'
      }
    ]);
  });

  test('Get notifications success - user has less than 20 notifications', () => {
    notifications = requestGetNotifications(user2.token);
    expect(notifications).toStrictEqual([
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'stevenle reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'danpudig reacted to your message in danpudig, haydensmith, stevenle'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'danpudig tagged you in danpudig, haydensmith, stevenle: @danpudig says hello'
      },
      {
        channelId: -1,
        dmId: dmId,
        notificationMessage: 'haydensmith added you to danpudig, haydensmith, stevenle'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'maddiestevens reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith reacted to your message in ChannelOne'
      },
      {
        channelId: channelId,
        dmId: -1,
        notificationMessage: 'haydensmith added you to ChannelOne'
      }
    ]);
  });

  test('Get notifications success - user has no notifications', () => {
    requestClear();
    user1 = requestRegister('hayden@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    notifications = requestGetNotifications(user1.token);
    expect(notifications).toStrictEqual([]);
  });

  test('Get notifications fail - token is invalid', () => {
    notifications = requestGetNotifications('-1');
    expect(notifications).toStrictEqual(FORBIDDEN);
  });
});
