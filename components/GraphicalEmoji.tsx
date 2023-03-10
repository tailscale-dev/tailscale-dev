export interface GraphicalEmojiProps {
  emoji: string;
}

/** Listen to me for my tale of woe:
 * Fonts are complicated. Fun fact: fonts are actually Turing-complete programs
 * that run in browsers. Yes, font rendering is really that complicated. This
 * component is a dirty, ugly, disgusting HACK that works around font
 * rendering in order to forcibly display the graphical form of an emoji.
 *
 * This works because Papyrus always displays the graphical forms of
 * emoji. No, I don't know why either. It slightly scares me.
 *
 * Either way, this works and I'm not brave enough to question why.
 */
export default function GraphicalEmoji({ emoji }: GraphicalEmojiProps) {
  return <span style={{ fontFamily: 'Papyrus' }}>{emoji}</span>;
}
