import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);
  const childFormRef = useRef();

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }));

  const handleClick = () => {
    if (childFormRef.current && childFormRef.current.clearForm) {
      childFormRef.current.clearForm();
    }
    toggleVisibility();
  };

  const childrenWithRef = React.Children.map(props.children, (child) =>
    React.cloneElement(child, { ref: childFormRef })
  );

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {childrenWithRef}
        <button onClick={handleClick}>cancel</button>
      </div>
    </div>
  );
});

export default Togglable;
