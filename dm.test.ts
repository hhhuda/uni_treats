import { requestClear, requestRegister, requestdmCreate, requestdmList, requestdmRemove, requestdmDetails, requestdmLeave, requestdmMessages, requestdmSend } from './request';
const BAD = 400;
const FORBIDDEN = 403;

describe('dm/create/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('Dm success - Multiple recipients', () => {
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual({ dmId: expect.any(Number) });
  });
  test('Dm success - Single recipient', () => {
    uIds.push(user2.authUserId);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual({ dmId: expect.any(Number) });
  });
  test('Dm fail - Invalid uId - when there are multiple recipients - all are invalid', () => {
    uIds.push(1234);
    uIds.push(5678);
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    uIds.push(1234);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual(BAD);
  });
  test('Dm fail - Invalid uId - when there are multiple recipients - one is invalid', () => {
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    uIds.push(1234);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual(BAD);
  });
  test('Dm fail - Invalid uId - when there is a single recipient', () => {
    uIds.push(1234);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual(BAD);
  });
  test('Dm fail - duplicate uIds', () => {
    uIds.push(user2.authUserId);
    uIds.push(user2.authUserId);
    expect(requestdmCreate(user1.token, uIds)).toStrictEqual(BAD);
  });
  test('Dm fail - invalid token', () => {
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    expect(requestdmCreate('1234', uIds)).toStrictEqual(FORBIDDEN);
  });
});

describe('dm/list/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let user4 = {
    token: '',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    user4 = requestRegister('Jayson@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('Dmlist - Multiple dms', () => {
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    requestdmCreate(user1.token, uIds);
    uIds = [];
    uIds.push(user2.authUserId);
    requestdmCreate(user1.token, uIds);
    expect(requestdmList(user1.token)).toStrictEqual({
      dms: [{
        dmId: expect.any(Number),
        name: 'danpudig, haydensmith, nicholashwang',
      },
      {
        dmId: expect.any(Number),
        name: 'haydensmith, nicholashwang',
      }]
    });
  });
  test('Dmlist - Multiple dms - same name (alphabetical test)', () => {
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    requestdmCreate(user1.token, uIds);
    uIds = [];
    uIds.push(user2.authUserId);
    uIds.push(user4.authUserId);
    requestdmCreate(user1.token, uIds);
    expect(requestdmList(user1.token)).toStrictEqual({
      dms: [{
        dmId: expect.any(Number),
        name: 'danpudig, haydensmith, nicholashwang',
      },
      {
        dmId: expect.any(Number),
        name: 'haydensmith, haydensmith0, nicholashwang',
      }]
    });
  });
  test('Dmlist - empty dms', () => {
    expect(requestdmList(user1.token)).toStrictEqual({ dms: [] });
  });
  test('Dmlist - fail, token invalid', () => {
    expect(requestdmList('1234')).toStrictEqual(FORBIDDEN);
  });
});

describe('dm/remove/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let dmId1 = 0;
  let dmId2 = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId1 = requestdmCreate(user1.token, uIds).dmId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('Dmremove success - Multiple recipients', () => {
    requestdmRemove(user1.token, dmId1);
    requestdmRemove(user1.token, dmId2);
    expect(requestdmList(user1.token)).toStrictEqual({ dms: [] });
  });
  test('Dmremove fail - Invalid token', () => {
    expect(requestdmRemove('-1', dmId1)).toStrictEqual(FORBIDDEN);
  });
  test('Dmremove fail - Invalid dmId - when there are multiple recipients - all are invalid', () => {
    expect(requestdmRemove(user1.token, 1234)).toStrictEqual(BAD);
  });
  test('Dmremove fail - Valid dmId - user is not DM creator', () => {
    expect(requestdmRemove(user2.token, dmId1)).toStrictEqual(FORBIDDEN);
  });
  test('Dmremove fail - Valid dmId - user left DM', () => {
    requestdmLeave(user2.token, dmId2);
    expect(requestdmRemove(user2.token, dmId2)).toStrictEqual(FORBIDDEN);
  });

  test('Dmremove fail - Valid dmId - user is not DM member', () => {
    expect(requestdmRemove(user3.token, dmId1)).toStrictEqual(FORBIDDEN);
  });
});

describe('dm/details/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let dmId1 = 0;
  let dmId2 = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId1 = requestdmCreate(user1.token, uIds).dmId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('DmDetails success - Multiple recipients', () => {
    expect(requestdmDetails(user1.token, dmId1)).toStrictEqual({
      name: 'danpudig, haydensmith, nicholashwang',
      members: [{
        uId: expect.any(Number),
        email: 'Haydensmith@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        handleStr: 'haydensmith',
      },
      {
        uId: expect.any(Number),
        email: 'Nicholashwang@gmail.com',
        nameFirst: 'Nicholas',
        nameLast: 'Hwang',
        handleStr: 'nicholashwang',
      },
      {
        uId: expect.any(Number),
        email: 'Danpudig@gmail.com',
        nameFirst: 'Dan',
        nameLast: 'Pudig',
        handleStr: 'danpudig',
      }]
    });
  });
  test('DmDetails fail - invalid token', () => {
    expect(requestdmDetails('-1', dmId1)).toStrictEqual(FORBIDDEN);
  });
  test('DmDetails fail - invalid dmId', () => {
    expect(requestdmDetails(user1.token, 1234)).toStrictEqual(BAD);
  });
  test('DmDetails fail - valid dmId - not a member', () => {
    expect(requestdmDetails(user3.token, dmId2)).toStrictEqual(FORBIDDEN);
  });
});

describe('dm/leave/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let dmId1 = 0;
  let dmId2 = 0;
  /* eslint-enable no-unused-vars */

  requestClear();

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId1 = requestdmCreate(user1.token, uIds).dmId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('DmLeave success - One Leaver', () => {
    requestdmLeave(user3.token, dmId1);
    expect(requestdmDetails(user1.token, dmId1)).toStrictEqual({
      name: 'danpudig, haydensmith, nicholashwang',
      members: [{
        uId: expect.any(Number),
        email: 'Haydensmith@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Smith',
        handleStr: 'haydensmith',
      },
      {
        uId: expect.any(Number),
        email: 'Nicholashwang@gmail.com',
        nameFirst: 'Nicholas',
        nameLast: 'Hwang',
        handleStr: 'nicholashwang',
      }]
    });
  });
  test('DmLeave success - Two Leavers', () => {
    requestdmLeave(user1.token, dmId1);
    requestdmLeave(user2.token, dmId1);
    expect(requestdmDetails(user3.token, dmId1)).toStrictEqual({
      name: 'danpudig, haydensmith, nicholashwang',
      members: [{
        uId: expect.any(Number),
        email: 'Danpudig@gmail.com',
        nameFirst: 'Dan',
        nameLast: 'Pudig',
        handleStr: 'danpudig',
      }]
    });
  });
  test('DmLeave fail - Invalid token', () => {
    expect(requestdmLeave('-1', dmId1)).toStrictEqual(FORBIDDEN);
  });
  test('DmLeave fail - Invalid dmId', () => {
    expect(requestdmLeave(user1.token, 12345)).toStrictEqual(BAD);
  });
  test('DmLeave fail - dmId valid - user not member', () => {
    expect(requestdmLeave(user3.token, dmId2)).toStrictEqual(FORBIDDEN);
  });
});

describe('dm/messages/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let dmId1 = 0;
  let dmId2 = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId1 = requestdmCreate(user1.token, uIds).dmId;
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    requestdmSend(user1.token, dmId1, 'Hi I am Hayden Smith');
    requestdmSend(user2.token, dmId1, 'Hi I am Nicholas Hwang');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('DmMessages success', () => {
    for (let i = 0; i < 52; i++) {
      requestdmSend(user1.token, dmId2, 'Hi');
    }
    const result = requestdmMessages(user1.token, dmId2, 0);
    expect(result).toBeInstanceOf(Object);
    expect(requestdmMessages(user1.token, dmId1, 0)).toStrictEqual({
      messages: [{
        messageId: expect.any(Number),
        uId: user2.authUserId,
        message: 'Hi I am Nicholas Hwang',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      },
      {
        messageId: expect.any(Number),
        uId: user1.authUserId,
        message: 'Hi I am Hayden Smith',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
      end: -1,
    });
  });
  test('DmMessage fail - Invalid token', () => {
    expect(requestdmMessages('-1', dmId1, 0)).toStrictEqual(FORBIDDEN);
  });
  test('DmMessages fail - Invalid dmId', () => {
    expect(requestdmMessages(user1.token, 1234, 0)).toStrictEqual(BAD);
  });
  test('DmMessages fail - Invalid start - greater than total messages', () => {
    expect(requestdmMessages(user1.token, dmId1, 3)).toStrictEqual(BAD);
  });
  test('DmMessages fail - Invalid start - negative', () => {
    expect(requestdmMessages(user1.token, dmId1, -5)).toStrictEqual(BAD);
  });
  test('DmMessages fail - valid dmId - not member of channel', () => {
    expect(requestdmMessages(user3.token, dmId2, 0)).toStrictEqual(FORBIDDEN);
  });
});

describe('message/senddm/v2', () => {
  /* eslint-disable no-unused-vars */
  let uIds = [0];
  let user1 = {
    token: '',
    authUserId: 0
  };
  let user2 = {
    token: '',
    authUserId: 0
  };
  let user3 = {
    token: '',
    authUserId: 0
  };
  let dmId1 = 0;
  let dmId2 = 0;
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    uIds = [];
    user1 = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    user2 = requestRegister('Nicholashwang@gmail.com', 'qwertyuiop', 'Nicholas', 'Hwang');
    user3 = requestRegister('Danpudig@gmail.com', 'qwertyuiop', 'Dan', 'Pudig');
    uIds.push(user2.authUserId);
    uIds.push(user3.authUserId);
    dmId1 = requestdmCreate(user1.token, uIds).dmId;
    uIds = [];
    uIds.push(user2.authUserId);
    dmId2 = requestdmCreate(user1.token, uIds).dmId;
    requestdmSend(user1.token, dmId1, 'Hi I am Hayden Smith');
    requestdmSend(user2.token, dmId1, 'Hi I am Nicholas Hwang');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
    uIds = [];
  });

  test('DmSend success', () => {
    expect(requestdmSend(user1.token, dmId1, 'Coolios')).toStrictEqual({ messageId: expect.any(Number) });
  });
  test('DmSend Fail - Invalid token', () => {
    expect(requestdmSend('-1', dmId1, 'Coolios')).toStrictEqual(FORBIDDEN);
  });
  test('DmSend Fail - Invalid dmId', () => {
    expect(requestdmSend(user1.token, -1, 'Coolios')).toStrictEqual(BAD);
  });
  test('DmSend Fail - Too Short message', () => {
    expect(requestdmSend(user1.token, dmId1, '')).toStrictEqual(BAD);
  });
  test('DmSend Fail - Too Long message', () => {
    expect(requestdmSend(user1.token, dmId1, 'Coolios'.repeat(1000))).toStrictEqual(BAD);
  });
  test('Dm fail - Valid dmId - user not member of channel', () => {
    expect(requestdmSend(user3.token, dmId2, 'Coolios')).toStrictEqual(FORBIDDEN);
  });
});
