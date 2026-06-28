function ErrorState({ message }) {
  if (!message) return null;
  return <div className="state-box state-error">{message}</div>;
}

export default ErrorState;
