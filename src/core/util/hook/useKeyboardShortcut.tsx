import useEventListener from "./useEventListener";
export const COMBINATOR_KEYS = {
  SHIFT: "shiftKey",
  CTRL: "ctrlKey",
  META: "metaKey"
} as const;

// keyboardConstants.ts
export const KEYBOARD_EVENT_KEY = {
  K: "k",
  G: "g",
  SLASH: "/",

  // those are not used right now but we'll need them in the future
  ENTER: "Enter",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight"
} as const;

// useKeyboardShortcut.tsx
interface UseKeyboardShortcutItem {
  key: ValueOf<typeof KEYBOARD_EVENT_KEY>;
  callback: VoidFunction;
  options?: {combinatorKey?: ValueOf<typeof COMBINATOR_KEYS>};
}

function useKeyboardShortcut(shortcuts: UseKeyboardShortcutItem[]) {
  useEventListener("keydown", (event) => {
    shortcuts.forEach(({key, options, callback}) => {
      if (options?.combinatorKey && !event[options.combinatorKey]) {
        return;
      }

      if (key === event.key) {
        callback();
      }
    });
  });
}

export default useKeyboardShortcut;
