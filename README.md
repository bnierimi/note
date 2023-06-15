# Note
`/dev/note`

> Note is a lightweight, minimalistic markup language designed for creating and formatting plain text notes. It was developed as a simplified alternative to more complex markup languages


## Elements

### Header
```note
#1 header 1
#2 header 2
#3 header 3
#4 header 4
#5 header 5
#6 header 6
```

### Bold
```note
a *bold* text
```

### Italic
```note
an *italic* text
```

### Code
```note
a short `code`
```

### Block Code
```note
rust`
    // this is a comment
    fn main() {
        println!("this is a codeblock");
    }
`
```

### Block Quote
```note
> the blockquote
```

### Link
```note
[text](link)
```

### Mention
```note
/* mention any account -> https://github.com/bnierimi */
@bnierimi(https://github.com)

/* mention a tcitrogg's account -> https://tcitrogg.org/bnierimi */
t/bnierimi
```

### Image
```note
!image[alt_text](link_to_img)

/* short form */
![alt_text](link_to_img)
```

### Horizontal Line
```note
---
```

### Unordered List
```note
* item 1
* item 2
```

### Ordered List
```note
- item 1
- item 2
```


## Im
- [ ] rust
- [ ] typescript
- [ ] javascript
- [ ] python
- [ ] go
- [ ] ...

yours [bnierimi@tcitrogg](https://github.com/bnierimi)
