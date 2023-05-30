export function useModalClose(
  cleanUp: () => void,
  onClose: () => void
) {
  return () => {
    onClose();
    setTimeout(cleanUp, 300);
  };
}
