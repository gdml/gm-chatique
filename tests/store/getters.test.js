import each from 'jest-each';

import store from '@/store';


describe('groupByDateChannelMessages', () => {
  const { groupByDateChannelMessages } = store.getters;

  const state = {
    currentChannelName: 100500,
    messages: {
      100500: [
        { index: 2, timestamp: '2019-10-28T12:58:19', author: 'gdml' },
        { index: 3, timestamp: '2019-10-28T12:59:19', author: 'gdml' },
        { index: 4, timestamp: '2019-10-28T12:59:20', author: '100500' },
        { index: 5, timestamp: '2019-10-28T12:59:21', author: 'gdml' },
        { index: 6, timestamp: '2019-10-28T12:59:22', author: 'gdml' },
        { index: 1, timestamp: '2019-10-28T12:58:17', author: 'gdml' },
        { index: 7, timestamp: '2019-10-28T13:00:22', author: '100500' },
        { index: 8, timestamp: '2019-10-28T13:00:23', author: '100500' },
        { index: 9, timestamp: '2019-10-29T13:00:24', author: '100500' },
        { index: 10, timestamp: '2019-11-29T13:00:23', author: '100500' },
        { index: 11, timestamp: '2020-11-29T13:00:23', author: '100500' },
        { index: 12, timestamp: '2020-11-29T13:00:23', author: 'gdml' },
        { index: 13, timestamp: '2020-11-29T13:00:24', author: '100500' },
      ],
    },
  };

  it('Returns messages grouped by minute', () => {
    const got = groupByDateChannelMessages(state, { channelMessages: () => state.messages[100500] })(100500);

    expect(got).toEqual([
      [
        { index: 1, timestamp: '2019-10-28T12:58:17', author: 'gdml' },
        { index: 2, timestamp: '2019-10-28T12:58:19', author: 'gdml' },
      ],
      [
        { index: 3, timestamp: '2019-10-28T12:59:19', author: 'gdml' },
      ],
      [
        { index: 4, timestamp: '2019-10-28T12:59:20', author: '100500' },
      ],
      [
        { index: 5, timestamp: '2019-10-28T12:59:21', author: 'gdml' },
        { index: 6, timestamp: '2019-10-28T12:59:22', author: 'gdml' },
      ],
      [
        { index: 7, timestamp: '2019-10-28T13:00:22', author: '100500' },
        { index: 8, timestamp: '2019-10-28T13:00:23', author: '100500' },
      ],
      [
        { index: 9, timestamp: '2019-10-29T13:00:24', author: '100500' },
      ],
      [
        { index: 10, timestamp: '2019-11-29T13:00:23', author: '100500' },
      ],
      [
        { index: 11, timestamp: '2020-11-29T13:00:23', author: '100500' },
      ],
      [
        { index: 12, timestamp: '2020-11-29T13:00:23', author: 'gdml' },
      ],
      [
        { index: 13, timestamp: '2020-11-29T13:00:24', author: '100500' },
      ],
    ]);
  });
});


describe('currentChannelMessages getter', () => {
  const state = {
    currentChannelName: 100500,
    messages: {
      100: ['lol'],
      500: ['kek'],
    },
  };

  const { currentChannelMessages } = store.getters;

  it('Returns empty array when getting messages from non existent room', () => {
    const got = currentChannelMessages(state);

    expect(got).toEqual([]);
  });

  each([
    [100, ['lol']],
    [500, ['kek']],
  ]).test('Returns messages of the room -> %s', (channelId, expected) => {
    state.currentChannelName = channelId;

    const got = currentChannelMessages(state);

    expect(got).toEqual(expected);
  });
});


describe('channelLastMessage getter', () => {
  const { channelLastMessage } = store.getters;

  each([
    [{ 100500: [{ index: 2, timestamp: '2019-10-28T12:58:18' }, { index: 1, timestamp: '2019-10-28T12:58:17' }] }, { index: 2, timestamp: '2019-10-28T12:58:18' }],
    [{ 100500: [{ index: 1, timestamp: '2019-10-28T12:58:17' }] }, { index: 1, timestamp: '2019-10-28T12:58:17' }],
    [{ 100500: [] }, undefined],
  ]).test('Returns last message of channel', (messages, expected) => {
    const got = channelLastMessage({ messages })(100500);

    expect(got).toEqual(expected);
  });
});
