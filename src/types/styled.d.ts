import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      main: string;
      general: string;
      important: string;
      evenRowColor: string;
    };
  }
}
