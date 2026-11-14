export default function Button({
  children,
  variant = "primary",
  as: Component = "button",
  className = "",
  type = "button",
  ...props
}) {
  const buttonProps = Component === "button" ? { type } : {};
  return (
    <Component
      className={`button button--${variant} ${className}`.trim()}
      {...buttonProps}
      {...props}
    >
      {children}
    </Component>
  );
}
