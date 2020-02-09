import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

export default {
  currentUser: null,

  connect(userId) {
    const chatkitInstance = 'v1:us1:5f08988a-ec69-468f-b79b-b4580bd7a88d'.split(':')[2];

    const manager = new ChatManager({
      instanceLocator: 'v1:us1:5f08988a-ec69-468f-b79b-b4580bd7a88d',
      userId: String(userId),
      tokenProvider: new TokenProvider({
        url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${chatkitInstance}/token`,
      }),
    });

    return manager.connect();
  },
};
