struct Parser {
    input: String,
}

impl Parser {
    fn new(input: String) -> Parser {
        Parser { input }
    }

    fn parse(&self) -> String {
        let mut output = String::new();
        let mut in_list = false;
        let lines = self.input.lines();
        for line in lines {
            if line.starts_with("* ") || line.starts_with("- ") {
                if !in_list {
                    output.push_str("<ul>");
                    in_list = true;
                }
                output.push_str(&self.parse_list_item(line));
            } else if line.starts_with('#') {
                let level = line.chars().take_while(|&c| c == '#').count();
                output.push_str(&format!("<h{}>{}</h{}>", level, &line[level+1..], level));
            } else if line.starts_with("!") {
                output.push_str(&self.parse_image(line));
            } else if line.starts_with("```") {
                output.push_str("<pre><code>");
                output.push_str(&line[3..]);
                output.push_str("</code></pre>");
            } else {
                if in_list {
                    output.push_str("</ul>");
                    in_list = false;
                }
                output.push_str(&self.parse_text(line));
            }
        }
        if in_list {
            output.push_str("</ul>");
        }
        output
    }

    fn parse_list_item(&self, line: &str) -> String {
        let mut output = String::new();
        output.push_str("<li>");
        output.push_str(&line[1..].trim());
        output.push_str("</li>");
        output
    }

    fn parse_text(&self, line: &str) -> String {
        let mut output = String::new();
        let mut inside_code = false;
        let parts: Vec<&str> = line.split('`').collect();
        for (i, part) in parts.iter().enumerate() {
            if i % 2 == 0 {
                if inside_code {
                    output.push_str("</code>");
                    inside_code = false;
                }
                output.push_str(&self.parse_formatting(part));
            } else {
                output.push_str("<code>");
                output.push_str(part);
                inside_code = true;
            }
        }
        if inside_code {
            output.push_str("</code>");
        }
        output
    }

    fn parse_formatting(&self, text: &str) -> String {
        let mut output = String::new();
        let mut remaining = text;
        while !remaining.is_empty() {
            if remaining.starts_with("*") {
                let bold_parts: Vec<&str> = remaining.splitn(3, "*").collect();
                if bold_parts.len() < 3 {
                    output.push_str(remaining);
                    break;
                }
                let bold_text = bold_parts[1].trim();
                output.push_str("<strong>");
                output.push_str(bold_text);
                output.push_str("</strong>");
                remaining = bold_parts[2];
            } else if remaining.starts_with("_") {
                let italic_parts: Vec<&str> = remaining.splitn(3, "_").collect();
                if italic_parts.len() < 3 {
                    output.push_str(remaining);
                    break;
                }
                let italic_text = italic_parts[1].trim();
                output.push_str("<em>");
                output.push_str(italic_text);
                output.push_str("</em>");
                remaining = italic_parts[2];
            } else if remaining.starts_with("@") {
                let mention_parts: Vec<&str> = remaining.splitn(3, "@").collect();
                if mention_parts.len() < 3 {
                    output.push_str(remaining);
                    break;
                }
                let username = mention_parts[1].trim();
                output.push_str("<a href=\"https://example.com/users/");
                output.push_str(username);
                output.push_str("\">@");
                output.push_str(username);
                output.push_str("</a>");
                remaining = mention_parts[2];
            } else {
                if let Some(index) = remaining.find(&['*', '@'][..]) {
                    output.push_str(&remaining[..=index]);
                    remaining = &remaining[index+1..];
                } else {
                    output.push_str(remaining);
                    break;
                }
            }
        }
        output
    }

    fn parse_image(&self, line: &str) -> String {
        let parts: Vec<&str> = line.splitn(2, |c| c == '[' || c == ']').collect();
        if parts.len() < 3 {
            return line.to_string();
        }
        let alt_text = parts[1].trim();
        let remaining = parts[2];
        let image_parts: Vec<&str> = remaining.splitn(2, |c| c == '(' || c == ')').collect();
        if image_parts.len() < 3 {
            return line.to_string();
        }
        let src = image_parts[1].trim();
        format!("<img src=\"{}\" alt=\"{}\">", src, alt_text)
    }
}

fn main() {
    let input = "This is a paragraph with *bold* and _italic_ text. Also, here's an example of an image: ![Example Image](example.jpg).\n```rust\nfn main() {\n    println!(\"Hello, world!\");\n}\n```".to_string();
    let parser = Parser::new(input);
    let output = parser.parse();
    println!("{}", output);
}
