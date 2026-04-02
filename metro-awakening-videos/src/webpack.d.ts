// Webpack-specific require.context API used by Remotion's bundler
declare interface RequireContext {
  keys(): string[];
  <T>(id: string): T;
}

declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
    ): RequireContext;
  }
}
