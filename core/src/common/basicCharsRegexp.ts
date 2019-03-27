/*
 *  Regexp that matches strings containing only:
 *  - alphanumeric characters from the basic Latin alphabet
 *  - underscores, dashes, dots, and slashes
 *
 *  Strings only containing these basic characters are:
 *  - unambiguous to read (with a monospaced font)
 *  - easy to type in a shell
 *  - easy to display in a url
 */
export default /^[\w-\.\/]{1,255}$/;
