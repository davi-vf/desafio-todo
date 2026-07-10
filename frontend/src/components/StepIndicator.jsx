export default function StepIndicator({ current, total }) {
  return (
    <div
      className="auth-step-dots"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`auth-step-dot${index + 1 < current ? " completed" : ""}${
            index + 1 === current ? " active" : ""
          }`}
        />
      ))}
    </div>
  );
}
