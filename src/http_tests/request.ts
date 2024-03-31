import request from 'sync-request';
import config from '../config.json';

const OK = 200;
const BAD = 400;
const FORBIDDEN = 403;
const port = config.port;
const url = config.url;

export function requestRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/register/v3`,
    {
      json: {
        email,
        password,
        nameFirst,
        nameLast,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestLogin(email: string, password: string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/login/v3`,
    {
      json: {
        email,
        password,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestClear() {
  const res = request(
    'DELETE',
    `${url}:${port}/clear/v1`,
    {
      qs: {}
    }
  );
  const bodyObj = JSON.parse(res.getBody() as string);
  expect(res.statusCode).toBe(OK);
  return bodyObj;
}

export function requestLogout(token: string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/logout/v2`,
    {
      json: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestCreate(token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
    `${url}:${port}/channels/create/v3`,
    {
      json: {
        name,
        isPublic,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestList(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/channels/list/v3`,
    {
      qs: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestListAll(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/channels/listall/v3`,
    {
      qs: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestDetails(token: string, channelId: number) {
  const res = request(
    'GET',
    `${url}:${port}/channel/details/v3`,
    {
      qs: {
        channelId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestJoin(token: string, channelId: number) {
  const res = request(
    'POST',
    `${url}:${port}/channel/join/v3`,
    {
      json: {
        channelId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestInvite(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    `${url}:${port}/channel/invite/v3`,
    {
      json: {
        channelId,
        uId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessages(token: string, channelId: number, start: number) {
  const res = request(
    'GET',
    `${url}:${port}/channel/messages/v3`,
    {
      qs: {
        channelId,
        start,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestChannelLeave(token: string, channelId: number) {
  const res = request(
    'POST',
    `${url}:${port}/channel/leave/v2`,
    {
      json: {
        channelId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestAddOwner(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    `${url}:${port}/channel/addowner/v2`,
    {
      json: {
        channelId,
        uId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestRemoveOwner(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    `${url}:${port}/channel/removeowner/v2`,
    {
      json: {
        channelId,
        uId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmCreate(token: string, uIds: number[]) {
  const res = request(
    'POST',
    `${url}:${port}/dm/create/v2`,
    {
      json: {
        uIds,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmList(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/dm/list/v2`,
    {
      qs: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmRemove(token: string, dmId: number) {
  const res = request(
    'DELETE',
    `${url}:${port}/dm/remove/v2`,
    {
      qs: {
        dmId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmDetails(token: string, dmId: number) {
  const res = request(
    'GET',
    `${url}:${port}/dm/details/v2`,
    {
      qs: {
        dmId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmLeave(token: string, dmId: number) {
  const res = request(
    'POST',
    `${url}:${port}/dm/leave/v2`,
    {
      json: {
        dmId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmMessages(token: string, dmId: number, start: number) {
  const res = request(
    'GET',
    `${url}:${port}/dm/messages/v2`,
    {
      qs: {
        dmId,
        start,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestdmSend(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
    `${url}:${port}/message/senddm/v2`,
    {
      json: {
        dmId,
        message,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageSend(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
    `${url}:${port}/message/send/v2`,
    {
      json: {
        channelId,
        message,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageEdit(token: string, messageId: number, message: string) {
  const res = request(
    'PUT',
    `${url}:${port}/message/edit/v2`,
    {
      json: {
        messageId,
        message,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageRemove(token: string, messageId: number) {
  const res = request(
    'DELETE',
    `${url}:${port}/message/remove/v2`,
    {
      qs: {
        messageId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestProfile(token: string, uId: number) {
  const res = request(
    'GET',
    `${url}:${port}/user/profile/v3`,
    {
      qs: {
        uId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestUsersAll(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/users/all/v2`,
    {
      qs: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestUserSetname(token: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/setname/v2`,
    {
      json: {
        nameFirst,
        nameLast,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestUserSetemail(token: string, email: string) {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/setemail/v2`,
    {
      json: {
        email,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestUserSethandle(token: string, handleStr: string) {
  const res = request(
    'PUT',
    `${url}:${port}/user/profile/sethandle/v2`,
    {
      json: {
        handleStr,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestStandupStart(token: string, channelId: number, length: number) {
  const res = request(
    'POST',
    `${url}:${port}/standup/start/v1`,
    {
      json: {
        channelId,
        length,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestSearch(token: string, queryStr: string) {
  const res = request(
    'GET',
    `${url}:${port}/search/v1`,
    {
      qs: {
        queryStr,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestStandupActive(token: string, channelId: number) {
  const res = request(
    'GET',
    `${url}:${port}/standup/active/v1`,
    {
      qs: {
        channelId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageShare(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const res = request(
    'POST',
    `${url}:${port}/message/share/v1`,
    {
      json: {
        ogMessageId,
        message,
        channelId,
        dmId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestStandupSend(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
    `${url}:${port}/standup/send/v1`,
    {
      json: {
        channelId,
        message,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageReact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
    `${url}:${port}/message/react/v1`,
    {
      json: {
        messageId,
        reactId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestpasswordresetRequest(token: string, email: string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/passwordreset/request/v1`,
    {
      json: {
        email,
      },
    });
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageUnreact(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
    `${url}:${port}/message/unreact/v1`,
    {
      json: {
        messageId,
        reactId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestpasswordReset(resetCode: number, newPassword: string) {
  const res = request(
    'POST',
    `${url}:${port}/auth/passwordreset/reset/v1`,
    {
      json: {
        resetCode,
        newPassword
      },
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestGetNotifications(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/notifications/get/v1`,
    {
      qs: {},
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestadminRemove(token: string, uId: number) {
  const res = request(
    'DELETE',
    `${url}:${port}/admin/user/remove/v1`,
    {
      headers: {
        token,
      },
      qs: {
        uId,
      }
    });
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessagePin(token: string, messageId: number) {
  const res = request(
    'POST',
    `${url}:${port}/message/pin/v1`,
    {
      json: {
        messageId,
      },
      headers: {
        token,
      }
    });
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestpermissionChange(token: string, uId: number, permissionId: number) {
  const res = request(
    'POST',
    `${url}:${port}/admin/userpermission/change/v1`,
    {
      headers: {
        token,
      },
      json: {
        uId,
        permissionId,
      }
    });
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}

export function requestMessageUnpin(token: string, messageId: number) {
  const res = request(
    'POST',
    `${url}:${port}/message/unpin/v1`,
    {
      json: {
        messageId,
      },
      headers: {
        token,
      }
    }
  );
  if (res.statusCode === BAD) {
    return BAD;
  } else if (res.statusCode === FORBIDDEN) {
    return FORBIDDEN;
  } else {
    const bodyObj = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    return bodyObj;
  }
}
