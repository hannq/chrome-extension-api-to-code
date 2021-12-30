declare namespace React {
  interface Attributes {
    styleName?: string;
  }
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    styleName?: string;
  }
  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    styleName?: string;
  }
}
