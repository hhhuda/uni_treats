import { getData, setData } from './dataStore';
import validator from 'validator';
import { checkEmail, findEmail, whichUser, whichToken, totalTokens } from './other';
import HTTPError from 'http-errors';
import hash from 'string-hash';
const nodemailer = require('nodemailer');

const SECRET = 678;

/**
 * Checks if the emails and password matches to a registered user.
 * @function
 * @param {string} email - Email of user.
 * @param {string} password - Password of email.
 * @throws 400 error if the email is not registered.
 * @throws 400 error if the password is incorrect.
 * @returns {object} authUserId - User's uId and token.
 */

function authLoginV1(email: string, password: string): { error?: string, authUserId?: number, token?: string } {
  const data = getData();

  const index = findEmail(email);
  if (index === -1) {
    throw HTTPError(400, 'Email does not exist.');
  } else if (data.users[index].password !== password) {
    throw HTTPError(400, 'Wrong password.');
  } else {
    const newTotal = totalTokens() + 1;
    const currToken = newTotal.toString();
    data.users[index].tokens.push(hash(currToken + SECRET).toString());
    setData(data);
    return {
      authUserId: data.users[index].uId,
      token: currToken,
    };
  }
}

/**
 * Registers the given email with the password, nameFirst, and nameLast. Also creates a new handle for the registered user.
 * @function
 * @param {string} email - Email of user.
 * @param {string} password - Password of email.
 * @param {string} nameFirst - First name of user.
 * @param {string} nameLast - Last name of user.
 * @throws 400 error if email is invalid.
 * @throws 400 error if email address is already being used by another user.
 * @throws 400 error if the password is less than 6 characters.
 * @throws 400 error if length of nameFirst is not between 1 and 50 characters inclusive.
 * @throws 400 error if length of nameLast is not between 1 and 50 characters inclusive.
 * @returns {string} token - Token of user.
 * @returns {object} authUser - User's uId and token.
 */

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string): { error?: string, authUserId?: number, token?: string } {
  const data = getData();

  if (!validator.isEmail(email)) throw HTTPError(400, 'Invalid email.');
  if (checkEmail(email)) throw HTTPError(400, 'Email already used.');
  if (password.length < 6) throw HTTPError(400, 'Password too short.');
  if (nameFirst.length < 1) throw HTTPError(400, 'First name is too short.');
  if (nameFirst.length > 50) throw HTTPError(400, 'First name is too long.');
  if (nameLast.length < 1) throw HTTPError(400, 'Last name is too short.');
  if (nameLast.length > 50) throw HTTPError(400, 'Last name is too long.');

  const handleArray = [];
  let name = nameFirst + nameLast;
  let nameLength = name.length;
  let handleIndex = 0;

  name = name.toLowerCase();

  if (nameLength > 20) {
    nameLength = 20;
  }

  for (let i = 0; i < nameLength; i++) {
    if ((name[i] >= 'a' && name[i] <= 'z') || (name[i] >= '0' && name[i] <= '9')) {
      handleArray[handleIndex] = name[i];
      handleIndex++;
    } else {
      if (nameLength <= 20) {
        nameLength++;
      }
    }
  }

  let handle = handleArray.join('');
  let extraHandleNumber = 0;

  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].handleStr === handle) {
      handleArray[handleIndex] = extraHandleNumber;
      handle = handleArray.join('');
      extraHandleNumber++;
    }
  }

  const currUId = data.users.length + 1;
  const newTotal = totalTokens() + 1;
  const currToken = newTotal.toString();

  if (data.users.length === 0) {
    data.users[data.users.length] = {
      email: email,
      uId: currUId,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
      handleStr: handle,
      tokens: [hash(currToken + SECRET).toString()],
    };
    data.globalowners.push(currUId);
  } else {
    data.users[data.users.length] = {
      email: email,
      uId: currUId,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
      handleStr: handle,
      tokens: [hash(currToken + SECRET).toString()],
    };
  }

  setData(data);
  const index = findEmail(email);
  return {
    authUserId: data.users[index].uId,
    token: currToken,
  };
}

/**
 * Invalidates user's token to log user out.
 * @function
 * @param {string} token - Token of user.
 */

function authLogoutV1(token: string) {
  const data = getData();
  const currUser = whichUser(token);
  if (currUser === -1) throw HTTPError(403, 'Invalid token.');
  const currToken = whichToken(token);
  data.users[currUser].tokens.splice(currToken, 1);
  setData(data);

  return {};
}
/**
 * Sends a password request - email to account, logs out all tokens
 * @function
 * @param {string} email - email of user
 * @returns {}
 */
function sendpasswordRequest(email: string) {
  const data = getData();
  if (!checkEmail(email)) return {};

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'e397ad43f4baf4',
      pass: '738ed2dedec259'
    }
  });

  const code = Math.floor(Math.random() * 10000);
  const code1 = code.toString();

  const mailOptions = {
    from: 'tester8359@gmail.com',
    to: email,
    subject: 'Sending password reset request',
    text: code1,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transporter.sendMail(mailOptions, function(error, info) {
    /* istanbul ignore if */
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  const uIndex = findEmail(email);
  data.users[uIndex].tokens = [];
  data.users[uIndex].resetcode = code;
  setData(data);

  return {};
}
/**
 * Change the password
 * @function
 * @param {string} newPassword - desired password.
 * @param {integer} resetCode - a reset code.
 * @throws 400 error if resetcode is incorrect
 * @returns {}
 */
function passwordReset(resetCode: number, newPassword: string) {
  if (newPassword.length < 6) {
    throw HTTPError(400, 'New password too short');
  }
  const data = getData();
  for (const i in data.users) {
    if (resetCode === data.users[i].resetcode) {
      data.users[i].password = newPassword;
      data.users[i].resetcode = -1;
      setData(data);
      return {};
    }
  }
  throw HTTPError(400, 'Not a valid reset code');
}

export { authLoginV1, authRegisterV1, authLogoutV1, sendpasswordRequest, passwordReset };
