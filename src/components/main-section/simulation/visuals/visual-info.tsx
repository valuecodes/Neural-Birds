const VisualInfo = ({ text, message }: { text: string; message?: string }) => (
  <div className="visualInfo">
    <p>{text}</p>
    <p className="visualMessage">{message}</p>
  </div>
);

export { VisualInfo };
