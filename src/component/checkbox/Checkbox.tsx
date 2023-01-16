import {
  CheckboxInput as HipoCheckboxInput,
  CheckboxInputProps as HipoCheckboxInputProps
} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

// This SCSS file is imported to the app under index.tsx
// import "./_checkbox-input.scss";

function CheckboxInput(props: HipoCheckboxInputProps) {
  const {customClassName, ...otherProps} = props;
  const className = classNames(customClassName, `pera-checkbox-input`);

  return <HipoCheckboxInput customClassName={className} {...otherProps} />;
}

export default CheckboxInput;
