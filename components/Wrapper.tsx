export default function Wrapper ({ children, condition, wrapper }) {
  return condition ? wrapper(children) : children;
}