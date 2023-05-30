export function classNames(...names: (string | boolean | undefined)[]) {
  return names.filter(it => it).join(" ");
}
