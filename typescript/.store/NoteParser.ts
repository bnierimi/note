class NoteParser {
    private readonly input: string;
    private inList: boolean;
    private listPack: string[];

    constructor(input: string) {
        this.input = input;
        this.inList = false;
        this.listPack = [];
    }

    parse(): string {
        let output: string = this.input;

        // Headings
        output = output.replace(/^#1\s(.*)/gm, this.parseText('header-1', '$1'));
        output = output.replace(/^#2\s(.*)/gm, this.parseText('header-2', '$1'));
        output = output.replace(/^#3\s(.*)/gm, this.parseText('header-3', '$1'));
        output = output.replace(/^#4\s(.*)/gm, this.parseText('header-4', '$1'));
        output = output.replace(/^#5\s(.*)/gm, this.parseText('header-5', '$1'));
        output = output.replace(/^#6\s(.*)/gm, this.parseText('header-6', '$1'));

        // Text :: Bold and Italic
        output = output.replace(/\*(.*)\*/gm, this.parseFormatting('bold', '$1'));
        output = output.replace(/\_(.*)\_/gm, this.parseFormatting('italic', '$1'));

        // Inline Code
        output = output.replace(/\`(.*)\`/gm, this.parseText('code', '$1'));

        // Code block
        output = output.replace(/([a-zA-Z]+)\`([\s\S]*?)\`/gm, '<pre language="$1"><code>$2</code></pre>');

        // Media :: Image
        output = output.replace(/!\[([^\[]+)\]\(([^\)]+)\)/gm, '<img alt="$1" src="$2"/>');

        // Link
        output = output.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');


        // Hr
        output = output.replace(/^\-\-\-\s*$/gm, '<hr/>');


        // List
        output = output.replace(/^\s*[*+-]\s+(.*)/gm, this.parseListItem('$1'));

        // Checkbox
        output = output.replace(/\[(x)\]\s(.+)/gm, `<input type="checkbox" checked disabled>$2`);
        output = output.replace(/\[( )\]\s(.+)/gm, `<input type="checkbox" disabled>$2`);

        // Blockquote
        output = output.replace(/^\>\s(.+)/gm, this.parseText('blockquote', '$1'));

        // Comments
        output = output.replace(/^\/\/(.+)/gm, this.parseText('comment', '$1'));

        // @ Mention
        output = output.replace(/@([a-zA-Z0-9_-]+)\(([^\)]+)\)/gm, '<a href="$2/$1">@$1</a>');

        // t/ Mention
        output = output.replace(/t\/([a-zA-Z0-9_-]+)/gm, '<a href="https://tcitro.gg/$1">t/$1</a>');

        // Paragraph
        output = output.replace(/(.+)/gms, this.parseText('paragraph', '$1'));

        if (this.inList) {
            output = `<ul>${this.listPack}</ul>`
            this.inList = false
            this.listPack = []
        }

        return output;
    }

    // list
    parseListItem(line: string): string {
        // let lineArray = line.split("/n");
        // lineArray.forEach(element => {
        // });
        // this.listPack.push(`<li>${line}</li>`)
        return `<li>${line}</li>`
    }

    // bold, italic
    parseFormatting(type: string, line: string): string {
        let output: string = ""
        if (type === 'bold') {
            output = `<strong>${line}</strong>`
        } else if (type === 'italic') {
            output = `<em>${line}</em>`
        }
        // this.inList = true;
        return output;
    }

    // header, paragraph, comment, code, blockcode, quote, blockquote
    parseText(type: string, line: string): string {
        let output: string = ""
        if (type === 'paragraph') {
            output = `<p>${line}</p>`
        } else if (type === 'comment') {
            output = `<comment>${line}</comment>`
        } else if (type === 'blockquote') {
            output = `<blockquote>${line}</blockquote>`
        } else if (type === 'code') {
            output = `<code>${line}</code>`
        } else if (type.startsWith('header-')) {
            let headerId = type.split('header-')[1]
            output = `<h${headerId}>$1</h${headerId}>`
        }
        // this.inList = true;
        return output;
    }
}

const sample = `
#1 header 1
#2 header 2
#3 header 3
#4 header 4
#5 header 5
#6 header 6

the paragraph look inside \`/lang\` dir you will find _italic_ and *bold*

// still working on list
- list 1
- list 2

1. list num 1
2. list num 2

* [x] create the /lang dir
* [ ] rename the dir

[nierimi/challanges](github.com/nierimi/challanges)
![nierimi](from.github.com/img/2je230r9e2d2)

[x] @awesome(https://github.com)
[ ] t/nierimi

---

> this as a code blockquote lets see whats up \
and the tab man added

rust\`
    // this is a comment
    fn main() {
        println!("this is a codeblock");
    }
\`


`

const parser = new NoteParser(sample);
const htmlOutput = parser.parse();
console.log(htmlOutput);