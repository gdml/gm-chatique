import each from 'jest-each';

import Vuex from 'vuex';

import { shallowMount, createLocalVue } from '@vue/test-utils';

import ChatNotifications from '@/components/ChatNotifications/ChatNotifications.vue';

import gmChat from '@/store/';

const localVue = createLocalVue();

localVue.use(Vuex);

let store;
let props;
let computed;

beforeEach(() => {
  store = new Vuex.Store({ modules: { gmChat } });

  props = {
    isOnline: true,
  };

  computed = {
    connecting: () => false,
    connected: () => true,
  };
});

const createWrapper = () => shallowMount(ChatNotifications, {
  stub: [
    {
      name: 'Icon',
      template: '<span />',
    },
  ],
  propsData: props,
  computed,
  localVue,
  store,
});

describe('show computed', () => {
  each([
    [false, false, true, true],
    [false, true, false, true],
    [false, false, false, true],
    [true, true, false, true],
    [true, true, true, false],
    [false, true, true, false],
  ]).test('Shows component when user is online and chat is connected (connecting %s -> connected %s -> isOnline %s -> expected %s', (connecting, connected, isOnline, expected) => {
    props.isOnline = isOnline;

    computed.connecting = () => connecting;
    computed.connected = () => connected;

    const wrapper = createWrapper();

    expect(wrapper.vm.show).toBe(expected);
  });
});


describe('date computed', () => {
  each([
    ['2019-09-28T12:58:18', '28 сентября в 12:58'],
    ['2019-10-01T15:28:23', '1 октября в 15:28'],
    ['2019-11-14T11:44:23', '14 ноября в 11:44'],
  ]).test('Formats date (%s -> %s)', (lastMessageDate, expected) => {
    props.lastMessageDate = lastMessageDate;

    const wrapper = createWrapper();

    expect(wrapper.vm.date).toEqual(expected);
  });
});
