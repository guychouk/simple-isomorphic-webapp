import styled, { css } from "styled-components";

export type ButtonProps = {
  fullWidth?: boolean;
  important?: boolean;
  small?: boolean;
};

const ButtonWidthCss = css<ButtonProps>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "200px")};
`;

export default styled.button<ButtonProps>`
  display: inline-block;
  border-radius: 5px;
  background-color: ${({ important, theme: { colors } }) =>
    important ? colors.important : colors.general};
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: ${({ small }) => (small ? "14" : "24")}px;
  padding: ${({ small }) => (small ? "5" : "10")}px;
  ${({ small }) => (!small ? ButtonWidthCss : undefined)};
  transition: all 0.5s;
  cursor: pointer;
`;
