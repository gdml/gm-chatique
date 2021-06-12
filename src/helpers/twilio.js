import { Client } from 'twilio-chat';
import axios from 'axios';

async function getAccessToken(backofficeURL, jwtToken) {
  return axios({
    url: '/api/v1/chat/twilio/token/',
    baseURL: backofficeURL,
    headers: {
      Authorization: `JWT ${jwtToken}`,
    },
  });
}


class TwilioClient {
  constructor(backofficeURL, backofficeJWTToken, vuexContext) {
    this.backofficeURL = backofficeURL;
    this.backofficeJWTToken = backofficeJWTToken;
    this.vuexContext = vuexContext;

    this.client = null;
    this.channels = {};
  }

  async getToken() {
    const response = await getAccessToken(this.backofficeURL, this.backofficeJWTToken);
    return response.data.token;
  }

  async refreshToken() {
    const token = await this.getToken();
    this.client.updateToken(token);
  }

  onConnectionStateChanged(status) {
    this.vuexContext.dispatch('gmChat/CHANGE_CONNECTION_STATUS', status, { root: true });
  }

  async createClient() {
    const token = await this.getToken();

    this.client = await Client.create(token);
    this.client.on('tokenExpired', () => this.refreshToken());
    this.client.on('connectionStateChanged', status => this.onConnectionStateChanged(status));
  }

  async getUserChannels() {
    const paginator = await this.client.getUserChannelDescriptors();
    await this.processUserChannelPaginator(paginator);
  }

  async processUserChannelPaginator(paginator) {
    const items = paginator.items.filter(item => item.uniqueName);

    items.forEach(async (channelDescriptor) => {
      const obj = {};
      obj[channelDescriptor.uniqueName] = {
        uniqueName: channelDescriptor.uniqueName,
        lastConsumedMessageIndex: channelDescriptor.lastConsumedMessageIndex,
        friendlyName: channelDescriptor.friendlyName,
      };

      this.vuexContext.commit('SET_CHANNELS', obj);
      this.vuexContext.dispatch('GET_CHANNEL_LAST_MESSAGE', channelDescriptor.uniqueName);

      this.channels[channelDescriptor.uniqueName] = await this.getOrCreateChannel(channelDescriptor.uniqueName);
    });

    if (paginator.hasNextPage) await this.processUserChannelPaginator(await paginator.nextPage());
  }

  async getOrCreateChannel(channelID) {
    if (this.channels[channelID]) return this.channels[channelID];

    if (!this.client) await this.createClient();

    let channel;
    try {
      channel = await this.client.getChannelByUniqueName(channelID);
    } catch (e) {
      channel = await this.client.createChannel({
        uniqueName: channelID,
      });
      await channel.join();
    }
    channel.on('messageAdded', message => this.receiveMessage(message));
    this.channels[channelID] = channel;

    return channel;
  }

  async getChannelMessages(channelID, pageSize = 1000) {
    const channel = await this.getOrCreateChannel(channelID);
    const messagePaginator = await channel.getMessages(pageSize);
    return messagePaginator.items;
  }

  async getChannelLastMessage(channelId) {
    const messages = await this.getChannelMessages(channelId, 1);
    return messages[0];
  }

  async setAllChannelMessagesConsumed(channelId) {
    const channel = await this.getOrCreateChannel(channelId);
    await channel.setAllMessagesConsumed();
  }

  async receiveMessage(message) {
    this.vuexContext.dispatch('gmChat/RECEIVE_MESSAGE', { message, channelName: message.channel.state.uniqueName }, { root: true });
  }

  async sendMessage(channelID, message) {
    const channel = await this.getOrCreateChannel(channelID);
    return channel.sendMessage(message);
  }
}

export default TwilioClient;
