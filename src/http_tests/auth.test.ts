import { requestRegister, requestLogin, requestClear, requestLogout, requestpasswordresetRequest, requestpasswordReset } from './request';
import { getData } from '../dataStore';

const BAD = 400;
const FORBIDDEN = 403;

describe('auth/register/v3', () => {
  /* eslint-disable no-unused-vars */
  let registerobject = {
    token: '0',
    authUserId: 0
  };
  let fake = {
    token: '0',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  afterEach(() => {
    requestClear();
  });

  test('Successful register', () => {
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    expect(registerobject).toStrictEqual({ token: expect.any(String), authUserId: expect.any(Number) });
  });
  test('Successful register - name over 20 characters', () => {
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Haydenmclalalandha^&', 'Smith');
    expect(registerobject).toStrictEqual({ token: expect.any(String), authUserId: expect.any(Number) });
  });
  test('unsuccessful register - email not valid', () => {
    fake = requestRegister('Haydensmith@eairghrge', 'qwertyuiop', 'Hayden', 'Smith');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - email already being used', () => {
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    fake = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - password less than 6 characters', () => {
    fake = requestRegister('Haydensmith@gmail.com', 'qwert', 'Hayden', 'Smith');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - length of namefirst too short', () => {
    fake = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', '', 'Smith');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - length of namefirst too long', () => {
    fake = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden'.repeat(1000), 'Smith');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - length of namelast too short', () => {
    fake = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', '');
    expect(fake).toStrictEqual(BAD);
  });
  test('unsuccessful register - length of namelast too long', () => {
    fake = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith'.repeat(1000));
    expect(fake).toStrictEqual(BAD);
  });
});

describe('auth/login/v3', () => {
  /* eslint-disable no-unused-vars */
  let registerobject = {
    token: '0',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful login', () => {
    expect(requestLogin('Haydensmith@gmail.com', 'qwertyuiop')).toStrictEqual({ token: expect.any(String), authUserId: expect.any(Number) });
  });
  test('Unsuccessful login - no email address match', () => {
    expect(requestLogin('Haydensmith1@gmail.com', 'qwertyuiop')).toStrictEqual(BAD);
  });
  test('Unsuccessful login - password incorrect', () => {
    expect(requestLogin('Haydensmith@gmail.com', 'qwertyui')).toStrictEqual(BAD);
  });
});

describe('auth/logout/v2', () => {
  /* eslint-disable no-unused-vars */
  let registerobject = {
    token: '0',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful logout', () => {
    expect(requestLogout(registerobject.token)).toStrictEqual({});
  });
  test('Failed logout - Invalid token', () => {
    expect(requestLogout('-1')).toStrictEqual(FORBIDDEN);
  });
});

describe('auth/passwordreset/request/v1 tests', () => {
  /* eslint-disable no-unused-vars */
  let registerobject = {
    token: '0',
    authUserId: 0
  };
  let registerobject1 = {
    token: '0',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    registerobject = requestRegister('nicholas8359@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    registerobject1 = requestLogin('nicholas8359@gmail.com', 'qwertyuiop');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful password send', () => {
    expect(requestpasswordresetRequest(registerobject.token, 'nicholas8359@gmail.com')).toStrictEqual({});
  });
  test('Unsuccessful password send - email does not exist', () => {
    expect(requestpasswordresetRequest(registerobject.token, 'haydensmith@gmail.com')).toStrictEqual({});
  });
});

describe('auth/passwordreset/reset/v1 tests', () => {
  /* eslint-disable no-unused-vars */
  let registerobject = {
    token: '0',
    authUserId: 0
  };
  /* eslint-enable no-unused-vars */

  beforeEach(() => {
    /* eslint-disable no-unused-vars */
    registerobject = requestRegister('Haydensmith@gmail.com', 'qwertyuiop', 'Hayden', 'Smith');
    /* eslint-enable no-unused-vars */
  });

  afterEach(() => {
    requestClear();
  });

  test('Successful password send', () => {
    expect(requestpasswordresetRequest(registerobject.token, 'nicholas8359@gmail.com')).toStrictEqual({});
    const data = getData();
    const code = data.users[0].resetcode;
    expect(requestpasswordReset(code, 'c499e6f4')).toStrictEqual({});
  });
  test('Failed password send', () => {
    expect(requestpasswordresetRequest('registerobject.token', 'nicholas8359@gmail.com')).toStrictEqual({});
    expect(requestpasswordReset(2345678, 'c499e6f4')).toStrictEqual(BAD);
  });
  test('Failed password send', () => {
    expect(requestpasswordresetRequest('registerobject.token', 'nicholas8359@gmail.com')).toStrictEqual({});
    const data = getData();
    const code = data.users[0].resetcode;
    expect(requestpasswordReset(code, '12345')).toStrictEqual(BAD);
  });
});
