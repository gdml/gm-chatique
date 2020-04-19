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
    this.currentChannel = null;
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
    this.client.on('connectionStateChanged', (status) => this.onConnectionStateChanged(status));
  }

  async getOrCreateChannel(channelID) {
    if (!this.client) await this.createClient();

    try {
      this.currentChannel = await this.client.getChannelByUniqueName(channelID);
    } catch (e) {
      this.currentChannel = await this.client.createChannel({
        uniqueName: channelID,
      });
      this.currentChannel.join();
    }
    this.currentChannel.on('messageAdded', (message) => this.receiveMessage(message));

    return this.currentChannel.state.uniqueName;
  }

  async getAllMessages() {
    const messagePaginator = await this.currentChannel.getMessages(1000);
    return messagePaginator.items;
  }

  async receiveMessage(message) {
    this.vuexContext.dispatch('gmChat/RECEIVE_MESSAGE', { message, channelName: message.channel.state.uniqueName }, { root: true });
  }

  async sendMessage(message) {
    return this.currentChannel.sendMessage(message);
  }
}

export default TwilioClient;
