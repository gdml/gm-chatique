import each from 'jest-each';

import { shallowMount } from '@vue/test-utils';

import MessageObserver from '@/components/MessageObserver.vue';
import TextMessage from '@/components/Messages/TextMessage.vue';
import ImageMessage from '@/components/Messages/ImageMessage.vue';
import DocumentMessage from '@/components/Messages/DocumentMessage.vue';
import UnsupportedMessage from '@/components/Messages/UnsupportedMessage.vue';

let props;
let computed;

beforeEach(() => {
  props = {
    user: { id: 100500 },
    message: {},
    platform: { is: {} },
  };

  computed = {};
});

const createWrapper = () => shallowMount(MessageObserver, {
  propsData: props,
  computed,
});

describe('isOutgoing computed, returns true if the message from current user', () => {
  it('Incoming message', () => {
    props.message = { author: 'gdml' };

    const wrapper = createWrapper();

    expect(wrapper.vm.isOutgoing).toBe(false);
  });

  it('Outgoing message', () => {
    props.message = { author: '100500' };

    const wrapper = createWrapper();

    expect(wrapper.vm.isOutgoing).toBe(true);
  });
});

describe('getComponent computed, returns component class for message type', () => {
  each([
    ['text', null, TextMessage],
    ['media', { contentType: 'image/jpg' }, ImageMessage],
    ['media', { contentType: 'image/da_vashe_poebat' }, ImageMessage],
    ['media', { contentType: 'application/pdf' }, DocumentMessage],
    ['media', { contentType: 'application/msword' }, DocumentMessage],
    ['media', {}, DocumentMessage],
    ['foobar', { contentType: 'non_existent' }, UnsupportedMessage],
  ]).test('Returns component class for particular message type %s', (type, media, expected) => {
    props.message = { type, media };

    const wrapper = createWrapper();

    expect(wrapper.vm.getComponent).toEqual(expected);
  });
});
