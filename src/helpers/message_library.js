import dayjs from 'dayjs';

export default {
  getMessageHash(message) {
    /** Returns hash for particular message needs to be able to group by date and author */
    if (!message) return null;

    return `${dayjs(message.date).format('YYYYMMDDHHmm')}${message.author}`;
  },

  sortByDate(messages) {
    /** Returns messages sorted by date (old goes first) */
    return [...messages].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  },

  group(messages) {
    /**
     * Returns messages grouped by author and date
     * If a few messages from an author follow each other for a minute they will be grouped
     */
    const groups = [[]];

    this.sortByDate(messages).forEach((message, index, arr) => {
      const lastIndex = groups.length - 1;
      const prevMessage = arr[index - 1];
      const hash = this.getMessageHash(message);
      const prevHash = this.getMessageHash(prevMessage);

      if (hash === prevHash || !prevHash) {
        groups[lastIndex].push(message);
      } else {
        groups[lastIndex + 1] = [message];
      }
    });

    return groups;
  },

  withLinks(message = '') {
    /** Wraps all links into a tag */
    return message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="gm-chat-message-link" target="_blank">$1</a>');
  },
};
