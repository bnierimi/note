
/* [note]: Parser */

class Parser {
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * parse
   */
  public parse(): string {
    let output = ''
    const lines = this.input.split('\n')
    let inBlockCode = false
    let inList = false
    let currentListType = ''

    for (const line of lines) {

      // (header)
      if (line.startsWith('#')) {
        const headerLevel = line.indexOf(" ")
        const level = line[headerLevel - 1]
        const content = line.substring(headerLevel + 1)
        output += `\n<h${level}>${content}</h${level}>`
      }

      // (horizontal line)
      else if (line.startsWith('---')) {
        output += '\n<hr>\n'
      }

      // (unordered list)
      else if (line.startsWith('*')) {
        if (!inList) {
          output += '<ul>'
          inList = true
          currentListType = 'ul'
        }
        output += this.parseListItem(line)
      }

      // (ordered list)
      else if (line.startsWith('-')) {
        if (!inList) {
          output += '<ol>'
          inList = true
          currentListType = 'ol'
        }
        output += this.parseListItem(line)
      }

      // (blockquote)
      else if (line.startsWith('>')) {
        if (!inBlockCode) {
          output += '<blockquote>'
          inBlockCode = true
        }
        output += this.parseBlockquote(line)
      }

      // (paragraph)
      else {
        if (inList) {
          output += currentListType === 'ul' ? '\n</ul>\n' : '\n</ol>\n'
          inList = false
        }
        if (line.length !== 0) {
          output += this.parseText(line)
        }
      }
    }

    if (inList) {
      output += currentListType === 'ul' ? '\n</ul>\n' : '\n</ol>\n'
    }

    return output

  }

  private parseListItem(line: string): string {
    const trimmedLine = line.trim()
    const listItemContent = trimmedLine.substring(1).trim()
    return `\n<li>${this.parseText(listItemContent)}</li>`
  }

  // (parse): text
  private parseText(line: string): string {
    let parsedLine = line

    // (bold)
    parsedLine = parsedLine.replace(/\*(.*?)\*/g, '<strong>$1</strong>')

    // (italic)
    parsedLine = parsedLine.replace(/\_(.*?)\_/g, '<em>$1</em>')

    // (block code)
    parsedLine = parsedLine.replace(/([a-zA-Z]+)\`([\s\S]*?)\`/gm, '\n<pre language="$1"><code>$2</code></pre>\n');

    // (inline code)
    parsedLine = parsedLine.replace(/\`(.*?)\`/g, '<code>$1</code>');

    // (@mention)
    parsedLine = parsedLine.replace(/@(\w+)\((.*?)\)/g, '<a href="$2/$1">@$1</a>')

    // (t/mention)
    parsedLine = parsedLine.replace(/t\/([a-zA-Z0-9_-]+)/g, '<a href="https://tcitro.gg/$1">t/$1</a>')

    // (image)
    parsedLine = parsedLine.replace(/(!|!image)\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')

    // (link)
    parsedLine = parsedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    return parsedLine
  }

  // (parse): text
  private parseBlockquote(line: string): string {
    const trimmedLine = line.trim()
    const blockquoteContent = trimmedLine.substring(1).trim()
    return `<p>${blockquoteContent}</p>\n`
  }

  // // (parse): text
  // private parseParagraph(line: string): string {
  //    return `<p>${line}</p>\n`
  // }

}


// <test>
const input = `

#1 header 1
#2 header 2
#3 header 3
#4 header 4
#5 header 5
#6 header 6

--------------

Unordered List
* item 1
   * subitem 3
   * subitem 4
* item 2

Ordered List
- item 1
- item 2

> the blockquote

--------------

the paragraph look inside \`/lang\` dir you will find _italic_ and *bold*

--------------
@awesome(https://github.com)
---
t/bnierimi
---
@kunoichi()
[nierimi/challanges](github.com/nierimi/challanges)
---
!image[nierimi](from.github.com/img/2je230r9e2d2)
---
!audio[nierimi](from.github.com/img/2je230r9e2d2)
!video[nierimi](from.github.com/img/2je230r9e2d2)
---

rust\`
    // this is a comment
    fn main() {
        println!("this is a codeblock");
    }
\`

`
const parser = new Parser(input)
const output = parser.parse()
console.log(output)