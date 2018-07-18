const emoji = require("emoji-dictionary");

/**
 * replace (smile) and (wink) with icons
 * @param content 
 */
export function parse(content) {
  return content
    .replace(/\(smile\)/g, emoji.getUnicode("smile"))
    .replace(/\(wink\)/g, emoji.getUnicode("wink"));
}