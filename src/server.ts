import express from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { standupStart, checkstandupActive, standupSend } from './standup';
import { authLoginV1, authLogoutV1, authRegisterV1, sendpasswordRequest, passwordReset } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from './channels';
import { channelDetailsV1, channelJoinV1, channelInviteV1, channelMessagesV1, channelLeave, channelAddOwner, channelRemoveOwner } from './channel';
import { messageSend, messageEdit, messageRemove, search, messageShare, messageReact, messageUnreact, messagePin, messageUnpin } from './message';
import { dmCreate, dmList, dmRemove, dmDetails, dmLeave, dmMessages, dmSend } from './dm';
import { userProfileV1, usersAllV1, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1, getNotifications } from './users';
import { adminuserRemove, adminpermissionChange } from './admin';
import { clearV1 } from './other';

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());

app.post('/auth/login/v3', (req, res, next) => {
  try {
    const { email, password } = req.body;
    return res.json(authLoginV1(email, password));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/register/v3', (req, res, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    return res.json(authRegisterV1(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/logout/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(authLogoutV1(token));
  } catch (err) {
    next(err);
  }
});

app.post('/channels/create/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const { name, isPublic } = req.body;
    return res.json(channelsCreateV1(token, name, isPublic));
  } catch (err) {
    next(err);
  }
});

app.get('/channels/list/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(channelsListV1(token));
  } catch (err) {
    next(err);
  }
});

app.get('/channels/listall/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(channelsListallV1(token));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/details/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    return res.json(channelDetailsV1(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/join/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    return res.json(channelJoinV1(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/invite/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    return res.json(channelInviteV1(token, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.get('/channel/messages/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    const start = parseInt(req.query.start as string);
    return res.json(channelMessagesV1(token, channelId, start));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/leave/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    return res.json(channelLeave(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/addowner/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    return res.json(channelAddOwner(token, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.post('/channel/removeowner/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    return res.json(channelRemoveOwner(token, channelId, uId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/send/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, message } = req.body;
    return res.json(messageSend(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { messageId, message } = req.body;
    return res.json(messageEdit(token, messageId, message));
  } catch (err) {
    next(err);
  }
});

app.delete('/message/remove/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const messageId = parseInt(req.query.messageId as string);
    return res.json(messageRemove(token, messageId));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { uIds } = req.body;
    return res.json(dmCreate(token, uIds));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/list/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(dmList(token));
  } catch (err) {
    next(err);
  }
});

app.delete('/dm/remove/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const dmId = parseInt(req.query.dmId as string);
    return res.json(dmRemove(token, dmId));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/details/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const dmId = parseInt(req.query.dmId as string);
    return res.json(dmDetails(token, dmId));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/leave/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { dmId } = req.body;
    return res.json(dmLeave(token, dmId));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/messages/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const dmId = parseInt(req.query.dmId as string);
    const start = parseInt(req.query.start as string);
    return res.json(dmMessages(token, dmId, start));
  } catch (err) {
    next(err);
  }
});

app.post('/message/senddm/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { dmId, message } = req.body;
    return res.json(dmSend(token, dmId, message));
  } catch (err) {
    next(err);
  }
});

app.get('/user/profile/v3', (req, res, next) => {
  try {
    const token = req.header('token');
    const uId = parseInt(req.query.uId as string);
    return res.json(userProfileV1(token, uId));
  } catch (err) {
    next(err);
  }
});

app.get('/users/all/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(usersAllV1(token));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setname/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { nameFirst, nameLast } = req.body;
    return res.json(userProfileSetnameV1(token, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setemail/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { email } = req.body;
    return res.json(userProfileSetemailV1(token, email));
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/sethandle/v2', (req, res, next) => {
  try {
    const token = req.header('token');
    const { handleStr } = req.body;
    return res.json(userProfileSethandleV1(token, handleStr));
  } catch (err) {
    next(err);
  }
});

app.post('/standup/start/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, length } = req.body;
    return res.json(standupStart(token, channelId, length));
  } catch (err) {
    next(err);
  }
});

app.get('/standup/active/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    return res.json(checkstandupActive(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/standup/send/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { channelId, message } = req.body;
    return res.json(standupSend(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/passwordreset/request/v1', (req, res) => {
  const { email } = req.body;
  return res.json(sendpasswordRequest(email));
});

app.post('/auth/passwordreset/reset/v1', (req, res, next) => {
  try {
    const { newPassword, resetCode } = req.body;
    return res.json(passwordReset(resetCode, newPassword));
  } catch (err) {
    next(err);
  }
});

app.delete('/admin/user/remove/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const uId = parseInt(req.query.uId as string);
    return res.json(adminuserRemove(token, uId));
  } catch (err) {
    next(err);
  }
});

app.get('/search/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const queryStr = req.query.queryStr as string;
    return res.json(search(token, queryStr));
  } catch (err) {
    next(err);
  }
});

app.post('/admin/userpermission/change/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { uId, permissionId } = req.body;
    return res.json(adminpermissionChange(token, uId, permissionId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/share/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { ogMessageId, message, channelId, dmId } = req.body;
    return res.json(messageShare(token, ogMessageId, message, channelId, dmId));
  } catch (err) {
    next(err);
  }
});

app.delete('/clear/v1', (req, res) => {
  clearV1();
  return res.json({});
});

app.post('/message/react/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    return res.json(messageReact(token, messageId, reactId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/unreact/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    return res.json(messageUnreact(token, messageId, reactId));
  } catch (err) {
    next(err);
  }
});

app.get('/notifications/get/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    return res.json(getNotifications(token));
  } catch (err) {
    next(err);
  }
});

app.post('/message/pin/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { messageId } = req.body;
    return res.json(messagePin(token, messageId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/unpin/v1', (req, res, next) => {
  try {
    const token = req.header('token');
    const { messageId } = req.body;
    return res.json(messageUnpin(token, messageId));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// for logging errors
app.use(morgan('dev'));

// start server
const server = app.listen(parseInt(process.env.PORT || config.port), process.env.IP, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || config.port}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
