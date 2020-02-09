import each from 'jest-each';

import { shallowMount } from '@vue/test-utils';

import MessageGroup from '@/components/MessageGroup.vue';

let props;
let computed;

beforeEach(() => {
  props = {
    user: { id: 100500 },
    messages: [],
    platform: { is: {} },
  };

  computed = {};
});

const createWrapper = () => shallowMount(MessageGroup, {
  propsData: props,
  computed,
});

describe('isOutgoing computed, returns true if some message from current user', () => {
  it('Incoming message', () => {
    props.messages = [{ author: 'gdml' }];

    const wrapper = createWrapper();

    expect(wrapper.vm.isOutgoing).toBe(false);
  });

  it('Outgoing message', () => {
    props.messages = [{ author: '100500' }];

    const wrapper = createWrapper();

    expect(wrapper.vm.isOutgoing).toBe(true);
  });
});


describe('time computed, date formatting', () => {
  each([
    ['2019-10-28T12:58:18', '12:58'],
    ['2019-10-28T12:58:23', '12:58'],
    ['2019-10-28T11:44:23', '11:44'],
  ]).test('Test date formatting, %s -> %s', (date, expected) => {
    props.messages = [{ date }];

    const wrapper = createWrapper();

    expect(wrapper.vm.time).toEqual(expected);
  });
});
